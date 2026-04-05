import { TrendingUp, TrendingDown, Clock, Percent } from 'lucide-react'
import { formatCurrency, formatPercent } from '../../constants/defaults'

export default function ResultsPanel({ results }) {
  if (!results) return null

  const { npv, irr, roi, paybackPeriod } = results
  const isNpvPositive = npv >= 0

  const cards = [
    {
      label: 'NPV',
      sublabel: 'Net Present Value',
      value: `฿${formatCurrency(Math.round(npv))}`,
      isPositive: isNpvPositive,
      icon: isNpvPositive ? TrendingUp : TrendingDown,
      type: isNpvPositive ? 'positive' : 'negative',
    },
    {
      label: 'IRR',
      sublabel: 'Internal Rate of Return',
      value: irr != null ? formatPercent(irr) : '—',
      icon: Percent,
      type: 'accent',
    },
    {
      label: 'ROI',
      sublabel: 'Return on Investment',
      value: roi != null ? formatPercent(roi) : '—',
      isPositive: roi >= 0,
      icon: roi >= 0 ? TrendingUp : TrendingDown,
      type: roi >= 0 ? 'positive' : 'negative',
    },
    {
      label: 'Payback',
      sublabel: 'ระยะเวลาคืนทุน',
      value: paybackPeriod != null ? `${paybackPeriod.toFixed(1)} ปี` : 'ไม่คืนทุน',
      icon: Clock,
      type: paybackPeriod != null ? 'positive' : 'negative',
    },
  ]

  return (
    <div className="results-grid">
      {cards.map((c) => (
        <div key={c.label} className={`result-card ${c.type}`}>
          <div className="result-label">{c.label}</div>
          <div className={`result-value ${c.type}`}>{c.value}</div>
          <div className="result-sub">{c.sublabel}</div>
        </div>
      ))}
    </div>
  )
}
