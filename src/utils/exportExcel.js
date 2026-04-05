import * as XLSX from 'xlsx'

export function exportToExcel(project, results, cashFlows) {
  const wb = XLSX.utils.book_new()

  // Sheet 1: Summary
  const summaryData = [
    ['Investment ROI Calculator — สรุปผล'],
    [],
    ['ชื่อโปรเจค', project.name],
    ['วันที่', new Date().toLocaleDateString('th-TH')],
    [],
    ['ข้อมูลการลงทุน'],
    ['เงินลงทุนเริ่มต้น (บาท)', Number(project.data.initialInvestment)],
    ['จำนวนปี', Number(project.data.years)],
    ['อัตราคิดลด (%)', Number(project.data.discountRate)],
    ['อัตราเติบโต (%)', Number(project.data.growthRate)],
    ['กระแสเงินสดปีแรก (บาท)', Number(project.data.baseCashFlow)],
    [],
    ['ผลการคำนวณ'],
    ['NPV (บาท)', results?.npv != null ? Math.round(results.npv) : 'N/A'],
    ['IRR (%)', results?.irr != null ? Number(results.irr.toFixed(2)) : 'N/A'],
    ['ROI (%)', results?.roi != null ? Number(results.roi.toFixed(2)) : 'N/A'],
    ['ระยะคืนทุน (ปี)', results?.paybackPeriod != null ? Number(results.paybackPeriod.toFixed(2)) : 'ไม่คืนทุน'],
  ]

  const ws1 = XLSX.utils.aoa_to_sheet(summaryData)
  ws1['!cols'] = [{ wch: 30 }, { wch: 20 }]
  XLSX.utils.book_append_sheet(wb, ws1, 'สรุปผล')

  // Sheet 2: Cash Flow Detail
  if (cashFlows && cashFlows.length > 0) {
    const cfHeader = ['ปีที่', 'กระแสเงินสด (บาท)', 'กระแสเงินสดสะสม (บาท)']
    const cfData = [cfHeader]
    let cumulative = -Number(project.data.initialInvestment)
    
    cashFlows.forEach((cf, i) => {
      cumulative += cf
      cfData.push([i + 1, Math.round(cf), Math.round(cumulative)])
    })

    const ws2 = XLSX.utils.aoa_to_sheet(cfData)
    ws2['!cols'] = [{ wch: 10 }, { wch: 25 }, { wch: 25 }]
    XLSX.utils.book_append_sheet(wb, ws2, 'กระแสเงินสด')
  }

  XLSX.writeFile(wb, `${project.name || 'investment-report'}.xlsx`)
}
