import { formatCurrency } from '../../constants/defaults'

export default function CashFlowTable({ cashFlows, initialInvestment, onUpdateCashFlows }) {
  let cumulative = -initialInvestment

  const handleCashFlowChange = (index, value) => {
    const updated = [...cashFlows]
    updated[index] = value
    onUpdateCashFlows(updated)
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">📋 ตารางกระแสเงินสด</h3>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 70 }}>ปีที่</th>
              <th className="num">กระแสเงินสด (บาท)</th>
              <th className="num">สะสม (บาท)</th>
              <th className="num" style={{ width: 80 }}>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>0</strong></td>
              <td className="num negative-cell">
                -฿{formatCurrency(initialInvestment)}
              </td>
              <td className="num negative-cell">
                -฿{formatCurrency(initialInvestment)}
              </td>
              <td className="num">
                <span style={{ color: 'var(--negative)', fontSize: 12 }}>ลงทุน</span>
              </td>
            </tr>
            {cashFlows.map((cf, i) => {
              cumulative += cf
              const isPositive = cumulative >= 0
              return (
                <tr key={i}>
                  <td><strong>{i + 1}</strong></td>
                  <td className="num">
                    <input
                      className="table-input"
                      type="number"
                      value={cf === 0 ? '' : Math.round(cf)}
                      onChange={(e) => handleCashFlowChange(i, Number(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </td>
                  <td className={`num ${isPositive ? 'positive-cell' : 'negative-cell'}`}>
                    {cumulative >= 0 ? '฿' : '-฿'}{formatCurrency(Math.abs(Math.round(cumulative)))}
                  </td>
                  <td className="num">
                    {isPositive ? (
                      <span style={{ color: 'var(--positive)', fontSize: 12, fontWeight: 600 }}>✓ คืนทุน</span>
                    ) : (
                      <span style={{ color: 'var(--gray-400)', fontSize: 12 }}>
                        {Math.round((1 - Math.abs(cumulative) / initialInvestment) * 100)}%
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
