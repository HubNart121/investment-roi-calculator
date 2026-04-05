import { LayoutDashboard, Plus, FolderOpen, Archive } from 'lucide-react'

export default function Sidebar({
  projects,
  activeProjectId,
  view,
  isOpen,
  onClose,
  onNavigate,
  onOpenProject,
  onCreateProject,
  onShowBackup,
}) {
  return (
    <>
      {isOpen && <div className="modal-overlay" onClick={onClose} style={{ zIndex: 45 }} />}
      <aside className={`sidebar${isOpen ? ' mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">IC</div>
          <div>
            <div className="sidebar-title">Investment Calc</div>
            <div className="sidebar-subtitle">คำนวณผลตอบแทนการลงทุน</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Menu</div>

          <button
            className={`nav-item${view === 'dashboard' ? ' active' : ''}`}
            onClick={() => onNavigate('dashboard')}
          >
            <LayoutDashboard size={18} className="nav-item-icon" />
            แดชบอร์ด
          </button>

          <button className="nav-item" onClick={onCreateProject}>
            <Plus size={18} className="nav-item-icon" />
            สร้างโปรเจคใหม่
          </button>

          <button className="nav-item" onClick={onShowBackup}>
            <Archive size={18} className="nav-item-icon" />
            สำรอง / กู้คืนข้อมูล
          </button>

          {projects.length > 0 && (
            <>
              <div className="sidebar-section-title" style={{ marginTop: 16 }}>
                โปรเจค ({projects.length})
              </div>
              <div className="project-list">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    className={`project-nav-item${activeProjectId === p.id ? ' active' : ''}`}
                    onClick={() => onOpenProject(p.id)}
                  >
                    <FolderOpen size={14} />
                    <span className="project-nav-name">{p.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div style={{ fontSize: 11, color: 'var(--gray-400)', textAlign: 'center' }}>
            Investment ROI Calculator v1.0
          </div>
        </div>
      </aside>
    </>
  )
}
