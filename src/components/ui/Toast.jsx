import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
}

export default function Toast({ toasts }) {
  if (!toasts.length) return null

  return (
    <div className="toast-container">
      {toasts.map((t) => {
        const Icon = icons[t.type] || icons.success
        return (
          <div key={t.id} className={`toast ${t.type}`}>
            <Icon size={18} />
            <span>{t.message}</span>
          </div>
        )
      })}
    </div>
  )
}
