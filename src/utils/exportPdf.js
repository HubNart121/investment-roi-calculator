import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

function resolveComputedStyles(element) {
  const allElements = element.querySelectorAll('*')
  const inlineBackups = []

  // Convert CSS variables to computed values for html2canvas compatibility
  ;[element, ...allElements].forEach((el) => {
    const computed = window.getComputedStyle(el)
    const backup = { el, color: el.style.color, bg: el.style.backgroundColor, borderColor: el.style.borderColor }
    inlineBackups.push(backup)

    if (computed.color) el.style.color = computed.color
    if (computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)') {
      el.style.backgroundColor = computed.backgroundColor
    }
    if (computed.borderColor) el.style.borderColor = computed.borderColor
  })

  return inlineBackups
}

function restoreStyles(backups) {
  backups.forEach(({ el, color, bg, borderColor }) => {
    el.style.color = color
    el.style.backgroundColor = bg
    el.style.borderColor = borderColor
  })
}

async function captureElement(element) {
  // Clone the element outside the modal to avoid backdrop-filter issues
  const clone = element.cloneNode(true)
  clone.style.position = 'absolute'
  clone.style.left = '-9999px'
  clone.style.top = '0'
  clone.style.width = element.offsetWidth + 'px'
  clone.style.background = '#ffffff'
  clone.style.zIndex = '-1'

  // Remove any SVG charts from clone (they don't render well)
  const svgContainers = clone.querySelectorAll('.recharts-wrapper, .chart-container')
  svgContainers.forEach((container) => {
    const placeholder = document.createElement('div')
    placeholder.style.cssText = `
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      color: #94a3b8;
      font-size: 14px;
      font-family: 'IBM Plex Sans Thai', sans-serif;
    `
    placeholder.textContent = '📊 กราฟแสดงในแอปพลิเคชัน'
    container.parentNode.replaceChild(placeholder, container)
  })

  document.body.appendChild(clone)

  // Resolve CSS variables on clone
  const backups = resolveComputedStyles(clone)

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      allowTaint: true,
      removeContainer: false,
      width: clone.offsetWidth,
      height: clone.scrollHeight,
      windowWidth: clone.offsetWidth,
      windowHeight: clone.scrollHeight,
    })

    return canvas
  } finally {
    restoreStyles(backups)
    document.body.removeChild(clone)
  }
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()

  // Cleanup after short delay
  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 500)
}

export async function exportToPdf(elementId, filename = 'report') {
  const element = document.getElementById(elementId)
  if (!element) throw new Error('ไม่พบ element สำหรับ export')

  const canvas = await captureElement(element)

  if (!canvas || canvas.width === 0 || canvas.height === 0) {
    throw new Error('ไม่สามารถ capture หน้ารายงานได้')
  }

  const imgData = canvas.toDataURL('image/jpeg', 0.95)
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width
  const pageHeight = pdf.internal.pageSize.getHeight()

  let heightLeft = pdfHeight
  let position = 0

  pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight)
  heightLeft -= pageHeight

  while (heightLeft > 0) {
    position = heightLeft - pdfHeight
    pdf.addPage()
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight)
    heightLeft -= pageHeight
  }

  // Use blob-based download for better compatibility
  const pdfBlob = pdf.output('blob')
  triggerDownload(pdfBlob, `${filename}.pdf`)
}

export async function exportToImage(elementId, filename = 'report') {
  const element = document.getElementById(elementId)
  if (!element) throw new Error('ไม่พบ element สำหรับ export')

  const canvas = await captureElement(element)

  if (!canvas || canvas.width === 0 || canvas.height === 0) {
    throw new Error('ไม่สามารถ capture หน้ารายงานได้')
  }

  canvas.toBlob((blob) => {
    if (!blob) {
      console.error('Failed to create image blob')
      return
    }
    triggerDownload(blob, `${filename}.png`)
  }, 'image/png')
}
