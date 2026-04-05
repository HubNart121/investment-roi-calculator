import { useState } from 'react'
import { Settings, ChevronDown, ChevronUp } from 'lucide-react'

export default function InputPanel({ project, onUpdateData, onUpdateProject }) {
  const [showAdvanced, setShowAdvanced] = useState(
    Number(project.data.growthRate) > 0
  )
  const { data } = project

  const handleChange = (field, value) => {
    onUpdateData({ [field]: value })
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <Settings size={18} className="card-title-icon" />
          ข้อมูลการลงทุน
        </h3>
      </div>

      {/* Project Name */}
      <div className="form-group">
        <label className="form-label">ชื่อโปรเจค</label>
        <input
          className="form-input"
          type="text"
          value={project.name}
          onChange={(e) => onUpdateProject({ name: e.target.value })}
          placeholder="เช่น เครื่อง CNC รุ่น X100"
        />
      </div>

      {/* Investment */}
      <div className="form-group">
        <label className="form-label">💰 เงินลงทุนเริ่มต้น (บาท)</label>
        <input
          className="form-input"
          type="number"
          value={data.initialInvestment}
          onChange={(e) => handleChange('initialInvestment', e.target.value)}
          placeholder="เช่น 500000"
          min="0"
        />
      </div>

      {/* Years */}
      <div className="form-group">
        <label className="form-label">📅 จำนวนปี</label>
        <input
          className="form-input"
          type="number"
          value={data.years}
          onChange={(e) => handleChange('years', e.target.value)}
          placeholder="5"
          min="1"
          max="50"
        />
      </div>

      {/* Base Cash Flow */}
      <div className="form-group">
        <label className="form-label">💵 กระแสเงินสดปีแรก (บาท/ปี)</label>
        <input
          className="form-input"
          type="number"
          value={data.baseCashFlow}
          onChange={(e) => handleChange('baseCashFlow', e.target.value)}
          placeholder="เช่น 120000"
          min="0"
        />
        <div className="form-hint">กระแสเงินสดสุทธิที่คาดว่าจะได้รับในปีแรก</div>
      </div>

      {/* Discount Rate */}
      <div className="form-group">
        <label className="form-label">📉 อัตราคิดลด — Discount Rate (%)</label>
        <input
          className="form-input"
          type="number"
          value={data.discountRate}
          onChange={(e) => handleChange('discountRate', e.target.value)}
          placeholder="10"
          min="0"
          max="100"
          step="0.5"
        />
        <div className="form-hint">ต้นทุนของเงินทุน หรืออัตราผลตอบแทนที่คาดหวัง</div>
      </div>

      {/* Advanced Section */}
      <div className="expandable-section">
        <button
          className="expandable-toggle"
          onClick={() => setShowAdvanced((v) => !v)}
        >
          {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          ตั้งค่าขั้นสูง
        </button>

        {showAdvanced && (
          <div className="expandable-content">
            <div className="form-group">
              <label className="form-label">📈 อัตราเติบโต — Growth Rate (%)</label>
              <input
                className="form-input"
                type="number"
                value={data.growthRate}
                onChange={(e) => handleChange('growthRate', e.target.value)}
                placeholder="0"
                min="-50"
                max="100"
                step="0.5"
              />
              <div className="form-hint">อัตราการเติบโตของกระแสเงินสดต่อปี (ค่าลบ = ลดลง)</div>
            </div>

            <div className="form-group">
              <label className="form-label">📝 รายละเอียดโครงการ</label>
              <textarea
                className="form-input"
                value={data.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="ใส่รายละเอียดโครงการที่นี่ (สูงสุด 8 บรรทัด)..."
                rows={8}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">🔗 Link 1</label>
                <input
                  className="form-input"
                  type="text"
                  value={data.link1 || ''}
                  onChange={(e) => handleChange('link1', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">🔗 Link 2</label>
                <input
                  className="form-input"
                  type="text"
                  value={data.link2 || ''}
                  onChange={(e) => handleChange('link2', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">📌 หมายเหตุ (เพิ่มเติม)</label>
              <textarea
                className="form-input"
                value={data.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="บันทึกย่อ..."
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
