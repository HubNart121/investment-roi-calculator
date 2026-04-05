import { LayoutDashboard, Calculator, Plus } from 'lucide-react'

export default function MobileNav({ view, onNavigate }) {
  return (
    <nav className="mobile-nav">
      <button
        className={`mobile-nav-item${view === 'dashboard' ? ' active' : ''}`}
        onClick={() => onNavigate('dashboard')}
      >
        <LayoutDashboard size={20} />
        <span>แดชบอร์ด</span>
      </button>
      <button
        className={`mobile-nav-item${view === 'calculator' ? ' active' : ''}`}
        onClick={() => onNavigate('calculator')}
      >
        <Calculator size={20} />
        <span>คำนวณ</span>
      </button>
    </nav>
  )
}
