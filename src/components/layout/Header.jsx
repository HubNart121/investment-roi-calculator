import { Menu, FileText, ArrowLeft } from 'lucide-react'

export default function Header({
  view,
  projectName,
  onMenuToggle,
  onShowReport,
  onUpdateProject,
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
          {view === 'dashboard' ? (
            <h1 className="header-title" style={{ fontSize: 18 }}>แดชบอร์ด</h1>
          ) : (
            <input
              className="header-title-input"
              type="text"
              value={projectName || ''}
              onChange={(e) => onUpdateProject({ name: e.target.value })}
              placeholder="ชื่อโปรเจค..."
              autoFocus={!projectName}
            />
          )}
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
