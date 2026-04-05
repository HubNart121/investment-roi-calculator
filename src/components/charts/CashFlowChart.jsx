import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Area,
} from 'recharts'

const formatValue = (v) => {
  if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(1)}M`
  if (Math.abs(v) >= 1e3) return `${(v / 1e3).toFixed(0)}K`
  return v.toFixed(0)
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: 'white',
        padding: '12px 16px',
        borderRadius: 10,
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        border: '1px solid #e2e8f0',
        fontSize: 13,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>ปีที่ {label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: p.color }} />
          <span style={{ color: '#64748b' }}>{p.name}:</span>
          <span style={{ fontWeight: 600, color: p.value >= 0 ? '#059669' : '#dc2626' }}>
            ฿{formatValue(p.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function CashFlowChart({ data }) {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
            label={{ value: 'ปี', position: 'insideBottomRight', offset: -5, fontSize: 12, fill: '#94a3b8' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatValue}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
          <Bar
            dataKey="cashFlow"
            name="กระแสเงินสด"
            fill="#0d9488"
            radius={[4, 4, 0, 0]}
            opacity={0.8}
          />
          <Line
            dataKey="cumulative"
            name="สะสม"
            stroke="#f59e0b"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#f59e0b', stroke: 'white', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
