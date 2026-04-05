import { Menu, FileText, ArrowLeft } from 'lucide-react'

export default function Header({
  view,
  projectName,
  onMenuToggle,
  onShowReport,
  onBackToDashboard,
}) {
  return (
    <header className="app-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuToggle} aria-label="เปิดเมนู">
          <Menu size={22} />
        </button>

        {view === 'calculator' && (
          <button className="btn btn-ghost btn-sm" onClick={onBackToDashboard}>
            <ArrowLeft size={16} />
            กลับ
          </button>
        )}

        <div>
          <h1 className="header-title" style={{ fontSize: view === 'calculator' ? 16 : 18 }}>
            {view === 'dashboard' ? 'แดชบอร์ด' : projectName || 'โปรเจค'}
          </h1>
          {view === 'calculator' && (
            <div className="header-breadcrumb">คำนวณผลตอบแทนการลงทุน</div>
          )}
        </div>
      </div>

      <div className="header-right">
        {view === 'calculator' && (
          <button className="btn btn-outline btn-sm" onClick={onShowReport}>
            <FileText size={16} />
            รายงาน
          </button>
        )}
      </div>
    </header>
  )
}
