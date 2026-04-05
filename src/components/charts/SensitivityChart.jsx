import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from 'recharts'

const formatValue = (v) => {
  if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(1)}M`
  if (Math.abs(v) >= 1e3) return `${(v / 1e3).toFixed(0)}K`
  return v.toFixed(0)
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const npv = payload[0]?.value
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
      <div style={{ fontWeight: 700, marginBottom: 4 }}>Discount Rate: {label}%</div>
      <div style={{ color: npv >= 0 ? '#059669' : '#dc2626', fontWeight: 600 }}>
        NPV: ฿{formatValue(npv)}
      </div>
    </div>
  )
}

export default function SensitivityChart({ data, currentRate }) {
  const currentPoint = data.find((d) => Math.abs(d.rate - currentRate) < 0.5)

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
          <defs>
            <linearGradient id="npvGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="rate"
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
            label={{ value: 'Discount Rate (%)', position: 'insideBottomRight', offset: -5, fontSize: 12, fill: '#94a3b8' }}
            unit="%"
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatValue}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#dc2626" strokeDasharray="4 4" strokeWidth={1.5} />
          <ReferenceLine
            x={currentRate}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: `ปัจจุบัน ${currentRate}%`,
              position: 'top',
              fontSize: 11,
              fill: '#f59e0b',
              fontWeight: 600,
            }}
          />
          <Area
            type="monotone"
            dataKey="npv"
            stroke="#0d9488"
            strokeWidth={2.5}
            fill="url(#npvGradient)"
            dot={false}
            activeDot={{ r: 5, fill: '#0d9488', stroke: 'white', strokeWidth: 2 }}
          />
          {currentPoint && (
            <ReferenceDot
              x={currentRate}
              y={currentPoint.npv}
              r={6}
              fill="#f59e0b"
              stroke="white"
              strokeWidth={2}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
