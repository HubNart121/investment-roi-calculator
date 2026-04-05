import { useRef } from 'react'
import { X, Download, Upload, AlertTriangle } from 'lucide-react'
import { exportBackup, importBackup } from '../../utils/storage'

export default function BackupRestoreModal({ projects, onImport, onClose, addToast }) {
  const fileRef = useRef(null)

  const handleBackup = () => {
    exportBackup(projects)
    addToast(`สำรองข้อมูล ${projects.length} โปรเจคเรียบร้อย`)
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const imported = await importBackup(file)
      if (window.confirm(`พบ ${imported.length} โปรเจค\n\nต้องการรวม (Merge) หรือ แทนที่ (Replace) ข้อมูลปัจจุบัน?\n\nกด OK = Merge, Cancel = Replace`)) {
        onImport(imported, 'merge')
      } else {
        onImport(imported, 'replace')
      }
    } catch (err) {
      addToast(err.message, 'error')
    }

    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
        <div className="modal-header">
          <h2 className="modal-title">💾 สำรอง / กู้คืนข้อมูล</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Backup */}
          <div className="backup-option" onClick={handleBackup}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Download size={24} style={{ color: 'var(--primary-500)' }} />
              <div>
                <div className="backup-option-title">📥 สำรองข้อมูล (Backup)</div>
                <div className="backup-option-desc">
                  ดาวน์โหลดข้อมูลทั้งหมดเป็นไฟล์ JSON ({projects.length} โปรเจค)
                </div>
              </div>
            </div>
          </div>

          {/* Restore */}
          <div className="backup-option" onClick={() => fileRef.current?.click()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Upload size={24} style={{ color: 'var(--accent-500)' }} />
              <div>
                <div className="backup-option-title">📤 กู้คืนข้อมูล (Restore)</div>
                <div className="backup-option-desc">
                  นำเข้าข้อมูลจากไฟล์ JSON ที่สำรองไว้
                </div>
              </div>
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            padding: 12,
            background: 'var(--warning-bg)',
            borderRadius: 'var(--radius-md)',
            fontSize: 13,
            color: 'var(--warning)',
            marginTop: 16,
          }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>
              ข้อมูลถูกเก็บไว้ใน Browser ของคุณ หากเปลี่ยนเครื่องหรือล้าง Browser 
              ข้อมูลจะหายไป แนะนำให้สำรองข้อมูลเป็นประจำ
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
