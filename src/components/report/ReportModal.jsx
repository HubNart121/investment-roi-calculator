import React from 'react'
import { X, FileText, Image, FileSpreadsheet } from 'lucide-react'
import { formatCurrency, formatPercent } from '../../constants/defaults'
import { exportToPdf, exportToImage } from '../../utils/exportPdf'
import { exportToExcel } from '../../utils/exportExcel'

export default function ReportModal({ project, results, cashFlows, chartData, onClose, addToast }) {
  const [exporting, setExporting] = React.useState(false)

  const handleExportPdf = async () => {
    setExporting(true)
    try {
      await exportToPdf('report-content', project.name || 'investment-report')
      addToast('ส่งออก PDF เรียบร้อย')
    } catch (err) {
      console.error('PDF export error:', err)
      addToast('เกิดข้อผิดพลาดในการส่งออก PDF: ' + err.message, 'error')
    } finally {
      setExporting(false)
    }
  }

  const handleExportImage = async () => {
    setExporting(true)
    try {
      await exportToImage('report-content', project.name || 'investment-report')
      addToast('ส่งออกรูปภาพเรียบร้อย')
    } catch (err) {
      console.error('Image export error:', err)
      addToast('เกิดข้อผิดพลาดในการส่งออกรูปภาพ: ' + err.message, 'error')
    } finally {
      setExporting(false)
    }
  }

  const handleExportExcel = () => {
    try {
      exportToExcel(project, results, cashFlows)
      addToast('ส่งออก Excel เรียบร้อย')
    } catch (err) {
      console.error('Excel export error:', err)
      addToast('เกิดข้อผิดพลาดในการส่งออก Excel: ' + err.message, 'error')
    }
  }

  // Use inline colors instead of CSS variables for html2canvas compatibility
  const colors = {
    gray50: '#f8fafc',
    gray500: '#64748b',
    gray900: '#0f172a',
    positive: '#059669',
    negative: '#dc2626',
    accent600: '#d97706',
    primary600: '#0f766e',
    primary500: '#0d9488',
    borderColor: '#e2e8f0',
    grayText: '#94a3b8',
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 800 }}>
        <div className="modal-header">
          <h2 className="modal-title">📄 รายงานผลการคำนวณ</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Export Buttons */}
          <div className="export-buttons" style={{ marginBottom: 24 }}>
            <button className="btn btn-primary" onClick={handleExportPdf} disabled={exporting}>
              <FileText size={16} />
              {exporting ? 'กำลังสร้าง...' : 'ส่งออก PDF'}
            </button>
            <button className="btn btn-outline" onClick={handleExportImage} disabled={exporting}>
              <Image size={16} />
              {exporting ? 'กำลังสร้าง...' : 'ส่งออกรูปภาพ'}
            </button>
            <button className="btn btn-outline" onClick={handleExportExcel} disabled={exporting}>
              <FileSpreadsheet size={16} />
              ส่งออก Excel
            </button>
          </div>

          {/* Report Content - uses INLINE styles for html2canvas */}
          <div
            id="report-content"
            style={{
              background: '#ffffff',
              padding: 32,
              fontFamily: "'IBM Plex Sans Thai', 'Inter', sans-serif",
              color: colors.gray900,
              lineHeight: 1.6,
            }}
          >
            {/* Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: 32,
              paddingBottom: 24,
              borderBottom: `3px solid ${colors.primary500}`,
            }}>
              <h1 style={{
                fontSize: 24,
                fontWeight: 800,
                color: colors.gray900,
                marginBottom: 8,
                fontFamily: "'Inter', sans-serif",
              }}>
                รายงานผลตอบแทนการลงทุน
              </h1>
              <p style={{ fontSize: 14, color: colors.gray500 }}>
                {project.name} — วันที่ {new Date().toLocaleDateString('th-TH', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </div>

            {/* Investment Info */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: 16, marginBottom: 12, color: colors.gray900, fontWeight: 700 }}>
                ข้อมูลการลงทุน
              </h3>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 14,
              }}>
                <tbody>
                  {[
                    ['เงินลงทุนเริ่มต้น', `฿${formatCurrency(Number(project.data.initialInvestment))}`],
                    ['จำนวนปี', `${project.data.years} ปี`],
                    ['อัตราคิดลด (Discount Rate)', `${project.data.discountRate}%`],
                    ['อัตราเติบโต (Growth Rate)', `${project.data.growthRate}%`],
                    ['กระแสเงินสดปีแรก', `฿${formatCurrency(Number(project.data.baseCashFlow))}`],
                  ].map(([label, value], i) => (
                    <tr key={i}>
                      <td style={{
                        padding: '10px 16px',
                        borderBottom: `1px solid ${colors.borderColor}`,
                        fontWeight: 600,
                        color: colors.gray900,
                      }}>
                        {label}
                      </td>
                      <td style={{
                        padding: '10px 16px',
                        borderBottom: `1px solid ${colors.borderColor}`,
                        textAlign: 'right',
                        fontFamily: "'Inter', sans-serif",
                        color: colors.gray900,
                      }}>
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Results */}
            {results && (
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 16, marginBottom: 12, color: colors.gray900, fontWeight: 700 }}>
                  ผลการคำนวณ
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  {[
                    { label: 'NPV', value: `฿${formatCurrency(Math.round(results.npv))}`, color: results.npv >= 0 ? colors.positive : colors.negative },
                    { label: 'IRR', value: results.irr != null ? formatPercent(results.irr) : '—', color: colors.accent600 },
                    { label: 'ROI', value: results.roi != null ? formatPercent(results.roi) : '—', color: results.roi >= 0 ? colors.positive : colors.negative },
                    { label: 'Payback Period', value: results.paybackPeriod != null ? `${results.paybackPeriod.toFixed(1)} ปี` : 'ไม่คืนทุน', color: colors.primary600 },
                  ].map((item, i) => (
                    <div key={i} style={{
                      background: colors.gray50,
                      padding: 16,
                      borderRadius: 10,
                      textAlign: 'center',
                      border: `1px solid ${colors.borderColor}`,
                    }}>
                      <div style={{
                        fontSize: 12,
                        color: colors.gray500,
                        fontWeight: 600,
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: 4,
                      }}>
                        {item.label}
                      </div>
                      <div style={{
                        fontSize: 24,
                        fontWeight: 800,
                        fontFamily: "'Inter', sans-serif",
                        color: item.color,
                      }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cash Flow Table */}
            {cashFlows && (
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 16, marginBottom: 12, color: colors.gray900, fontWeight: 700 }}>
                  กระแสเงินสดรายปี
                </h3>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: 14,
                }}>
                  <thead>
                    <tr>
                      <th style={{
                        textAlign: 'left',
                        padding: '10px 16px',
                        borderBottom: `2px solid ${colors.borderColor}`,
                        fontSize: 12,
                        fontWeight: 600,
                        color: colors.gray500,
                        fontFamily: "'Inter', sans-serif",
                      }}>ปีที่</th>
                      <th style={{
                        textAlign: 'right',
                        padding: '10px 16px',
                        borderBottom: `2px solid ${colors.borderColor}`,
                        fontSize: 12,
                        fontWeight: 600,
                        color: colors.gray500,
                        fontFamily: "'Inter', sans-serif",
                      }}>กระแสเงินสด (บาท)</th>
                      <th style={{
                        textAlign: 'right',
                        padding: '10px 16px',
                        borderBottom: `2px solid ${colors.borderColor}`,
                        fontSize: 12,
                        fontWeight: 600,
                        color: colors.gray500,
                        fontFamily: "'Inter', sans-serif",
                      }}>สะสม (บาท)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      let cum = -Number(project.data.initialInvestment)
                      return cashFlows.map((cf, i) => {
                        cum += cf
                        return (
                          <tr key={i}>
                            <td style={{
                              padding: '10px 16px',
                              borderBottom: `1px solid ${colors.borderColor}`,
                              fontWeight: 600,
                              color: colors.gray900,
                            }}>{i + 1}</td>
                            <td style={{
                              padding: '10px 16px',
                              borderBottom: `1px solid ${colors.borderColor}`,
                              textAlign: 'right',
                              fontFamily: "'Inter', sans-serif",
                              color: colors.gray900,
                            }}>
                              ฿{formatCurrency(Math.round(cf))}
                            </td>
                            <td style={{
                              padding: '10px 16px',
                              borderBottom: `1px solid ${colors.borderColor}`,
                              textAlign: 'right',
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 600,
                              color: cum >= 0 ? colors.positive : colors.negative,
                            }}>
                              {cum >= 0 ? '฿' : '-฿'}{formatCurrency(Math.abs(Math.round(cum)))}
                            </td>
                          </tr>
                        )
                      })
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer */}
            <div style={{
              borderTop: `1px solid ${colors.borderColor}`,
              paddingTop: 16,
              marginTop: 32,
              fontSize: 11,
              color: colors.grayText,
              textAlign: 'center',
            }}>
              สร้างโดย Investment ROI Calculator — {new Date().toLocaleString('th-TH')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

