import { useState, useCallback } from 'react'
import { useProjects } from './hooks/useProjects'
import { useCalculation } from './hooks/useCalculation'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import MobileNav from './components/layout/MobileNav'
import Dashboard from './components/dashboard/Dashboard'
import CalculatorPage from './components/calculator/CalculatorPage'
import ReportModal from './components/report/ReportModal'
import BackupRestoreModal from './components/backup/BackupRestoreModal'
import Toast from './components/ui/Toast'

export default function App() {
  const {
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    createProject,
    updateProject,
    updateProjectData,
    deleteProject,
    duplicateProject,
    importProjects,
  } = useProjects()

  const [view, setView] = useState('dashboard')
  const [showReport, setShowReport] = useState(false)
  const [showBackup, setShowBackup] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toasts, setToasts] = useState([])

  const { results, cashFlows, chartData, sensitivityData } = useCalculation(
    activeProject?.data
  )

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const handleOpenProject = useCallback((id) => {
    setActiveProjectId(id)
    setView('calculator')
    setSidebarOpen(false)
  }, [setActiveProjectId])

  const handleCreateProject = useCallback(() => {
    const id = createProject()
    setView('calculator')
    setActiveProjectId(id)
    setSidebarOpen(false)
    addToast('สร้างโปรเจคใหม่เรียบร้อย')
  }, [createProject, setActiveProjectId, addToast])

  const handleBackToDashboard = useCallback(() => {
    setView('dashboard')
    setActiveProjectId(null)
  }, [setActiveProjectId])

  const handleDeleteProject = useCallback((id) => {
    deleteProject(id)
    if (activeProjectId === id) {
      setView('dashboard')
    }
    addToast('ลบโปรเจคเรียบร้อย')
  }, [deleteProject, activeProjectId, addToast])

  const handleDuplicate = useCallback((id) => {
    duplicateProject(id)
    addToast('คัดลอกโปรเจคเรียบร้อย')
  }, [duplicateProject, addToast])

  const handleImport = useCallback((imported, mode) => {
    importProjects(imported, mode)
    addToast(`นำเข้า ${imported.length} โปรเจคเรียบร้อย`)
    setShowBackup(false)
  }, [importProjects, addToast])

  return (
    <div className="app-layout">
      <Sidebar
        projects={projects}
        activeProjectId={activeProjectId}
        view={view}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={(v) => { setView(v); setSidebarOpen(false); }}
        onOpenProject={handleOpenProject}
        onCreateProject={handleCreateProject}
        onShowBackup={() => setShowBackup(true)}
      />

      <Header
        view={view}
        projectName={activeProject?.name}
        onMenuToggle={() => setSidebarOpen((v) => !v)}
        onShowReport={() => setShowReport(true)}
        onBackToDashboard={handleBackToDashboard}
        onUpdateProject={(updates) => updateProject(activeProjectId, updates)}
      />

      <main className="app-main">
        {view === 'dashboard' && (
          <Dashboard
            projects={projects}
            onOpenProject={handleOpenProject}
            onCreateProject={handleCreateProject}
            onDeleteProject={handleDeleteProject}
            onDuplicateProject={handleDuplicate}
          />
        )}

        {view === 'calculator' && activeProject && (
          <CalculatorPage
            project={activeProject}
            results={results}
            cashFlows={cashFlows}
            chartData={chartData}
            sensitivityData={sensitivityData}
            onUpdateData={(updates) => updateProjectData(activeProjectId, updates)}
            onUpdateProject={(updates) => updateProject(activeProjectId, updates)}
          />
        )}
      </main>

      <MobileNav
        view={view}
        onNavigate={setView}
      />

      {showReport && activeProject && (
        <ReportModal
          project={activeProject}
          results={results}
          cashFlows={cashFlows}
          chartData={chartData}
          onClose={() => setShowReport(false)}
          addToast={addToast}
        />
      )}

      {showBackup && (
        <BackupRestoreModal
          projects={projects}
          onImport={handleImport}
          onClose={() => setShowBackup(false)}
          addToast={addToast}
        />
      )}

      <Toast toasts={toasts} />
    </div>
  )
}
