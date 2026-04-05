import { Copy, Trash2 } from 'lucide-react'
import { formatCurrency, formatPercent } from '../../constants/defaults'
import {
  generateCashFlows,
  calculateNPV,
  calculateIRR,
  calculateROI,
} from '../../utils/calculations'

export default function ProjectCard({ project, onOpen, onDelete, onDuplicate }) {
  const { data } = project
  const inv = Number(data.initialInvestment) || 0
  const yrs = Number(data.years) || 0
  const base = Number(data.baseCashFlow) || 0

  let npv = null
  let irr = null

  if (inv > 0 && yrs > 0 && base > 0) {
    const cfs = generateCashFlows(base, yrs, Number(data.growthRate) || 0)
    npv = calculateNPV(inv, cfs, Number(data.discountRate) || 0)
    irr = calculateIRR(inv, cfs)
  }

  return (
    <div className="project-card" onClick={onOpen}>
      <div className="project-card-actions">
        <button
          className="btn btn-ghost btn-icon"
          onClick={(e) => { e.stopPropagation(); onDuplicate() }}
          title="คัดลอก"
        >
          <Copy size={14} />
        </button>
        <button
          className="btn btn-ghost btn-icon"
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          title="ลบ"
          style={{ color: 'var(--negative)' }}
        >
          <Trash2 size={14} />
        </button>
      </div>

      <h3 className="project-card-name">{project.name}</h3>
      <div className="project-card-meta">
        สร้างเมื่อ {new Date(project.createdAt).toLocaleDateString('th-TH')}
      </div>

      <div className="project-card-stats">
        <div className="project-card-stat">
          <div className="project-card-stat-label">Investment</div>
          <div className="project-card-stat-value">
            {inv > 0 ? `฿${formatCurrency(inv)}` : '—'}
          </div>
        </div>
        <div className="project-card-stat">
          <div className="project-card-stat-label">NPV</div>
          <div
            className="project-card-stat-value"
            style={{ color: npv != null ? (npv >= 0 ? 'var(--positive)' : 'var(--negative)') : undefined }}
          >
            {npv != null ? `฿${formatCurrency(npv)}` : '—'}
          </div>
        </div>
        <div className="project-card-stat">
          <div className="project-card-stat-label">IRR</div>
          <div className="project-card-stat-value">
            {irr != null ? formatPercent(irr) : '—'}
          </div>
        </div>
        <div className="project-card-stat">
          <div className="project-card-stat-label">Years</div>
          <div className="project-card-stat-value">{yrs || '—'}</div>
        </div>
      </div>
    </div>
  )
}
