import { Plus, FolderOpen } from 'lucide-react'
import ProjectCard from './ProjectCard'
import QuickStats from './QuickStats'

export default function Dashboard({
  projects,
  onOpenProject,
  onCreateProject,
  onDeleteProject,
  onDuplicateProject,
}) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">โปรเจคการลงทุน</h1>
          <p className="dashboard-desc">จัดการและเปรียบเทียบผลตอบแทนจากการลงทุนเครื่องจักร</p>
        </div>
        <button className="btn btn-primary" onClick={onCreateProject}>
          <Plus size={18} />
          สร้างโปรเจคใหม่
        </button>
      </div>

      {projects.length > 0 && <QuickStats projects={projects} />}

      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FolderOpen size={36} />
          </div>
          <h2 className="empty-state-title">ยังไม่มีโปรเจค</h2>
          <p className="empty-state-desc">
            เริ่มต้นด้วยการสร้างโปรเจคใหม่เพื่อคำนวณผลตอบแทนจากการลงทุนเครื่องจักร
          </p>
          <button className="btn btn-primary btn-lg" onClick={onCreateProject}>
            <Plus size={20} />
            สร้างโปรเจคแรก
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onOpen={() => onOpenProject(p.id)}
              onDelete={() => onDeleteProject(p.id)}
              onDuplicate={() => onDuplicateProject(p.id)}
            />
          ))}
          <div className="project-add-card" onClick={onCreateProject}>
            <div className="project-add-icon">
              <Plus size={24} />
            </div>
            <span style={{ fontWeight: 600, fontSize: 14 }}>เพิ่มโปรเจคใหม่</span>
          </div>
        </div>
      )}
    </div>
  )
}
