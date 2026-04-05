import { formatCurrency } from '../../constants/defaults'
import {
  generateCashFlows,
  calculateNPV,
} from '../../utils/calculations'

export default function QuickStats({ projects }) {
  const totalInvestment = projects.reduce(
    (sum, p) => sum + (Number(p.data.initialInvestment) || 0),
    0
  )

  let totalNPV = 0
  let countPositive = 0

  projects.forEach((p) => {
    const inv = Number(p.data.initialInvestment) || 0
    const base = Number(p.data.baseCashFlow) || 0
    const yrs = Number(p.data.years) || 0
    if (inv > 0 && base > 0 && yrs > 0) {
      const cfs = generateCashFlows(base, yrs, Number(p.data.growthRate) || 0)
      const npv = calculateNPV(inv, cfs, Number(p.data.discountRate) || 0)
      totalNPV += npv
      if (npv >= 0) countPositive++
    }
  })

  return (
    <div className="quick-stats">
      <div className="quick-stat-card">
        <div className="quick-stat-value">{projects.length}</div>
        <div className="quick-stat-label">โปรเจคทั้งหมด</div>
      </div>
      <div className="quick-stat-card">
        <div className="quick-stat-value">฿{formatCurrency(totalInvestment)}</div>
        <div className="quick-stat-label">เงินลงทุนรวม</div>
      </div>
      <div className="quick-stat-card">
        <div
          className="quick-stat-value"
          style={{ color: totalNPV >= 0 ? 'var(--positive)' : 'var(--negative)' }}
        >
          ฿{formatCurrency(totalNPV)}
        </div>
        <div className="quick-stat-label">NPV รวม ({countPositive} โปรเจคกำไร)</div>
      </div>
    </div>
  )
}
