import React, { useState, useEffect, useContext } from 'react'
import { ToastContext } from '../App'

export default function WorkerManagement() {
  const showToast = useContext(ToastContext)
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ id: null, full_name: '', phone: '', job: '' })
  const [isEditing, setIsEditing] = useState(false)

  const API_KEY = 'my_super_secret_key_123'
  const BASE_URL = 'http://127.0.0.1:8000/api/v1/marketplace/providers'

  useEffect(() => { fetchWorkers() }, [])

  const fetchWorkers = async () => {
    try {
      const res = await fetch(BASE_URL)
      const data = await res.json()
      setWorkers(data)
    } catch (err) {
      showToast('فشل في جلب البيانات', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = isEditing ? 'PUT' : 'POST'
    const url = isEditing ? `${BASE_URL}/${formData.id}` : BASE_URL

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': API_KEY
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          phone: formData.phone,
          job: formData.job
        })
      })

      if (res.ok) {
        showToast(isEditing ? 'تم تحديث البيانات' : 'تم إضافة العامل بنجاح')
        setShowModal(false)
        setFormData({ id: null, full_name: '', phone: '', job: '' })
        fetchWorkers()
      } else {
        showToast('حدث خطأ أثناء الحفظ', 'error')
      }
    } catch (err) {
      showToast('خطأ في الاتصال بالسيرفر', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا العامل نهائياً؟')) return

    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'X-API-KEY': API_KEY }
      })
      if (res.ok) {
        showToast('تم حذف العامل بنجاح')
        fetchWorkers()
      }
    } catch (err) {
      showToast('فشل في الحذف', 'error')
    }
  }

  const openEdit = (w) => {
    setFormData(w)
    setIsEditing(true)
    setShowModal(true)
  }

  return (
    <div className="worker-mgmt-container">
      <div className="section-card-header" style={{ marginBottom: '24px' }}>
        <h1 className="dashboard-title" style={{ fontSize: '24px' }}>👷 إدارة طاقم العمال</h1>
        <button className="btn btn-whatsapp" onClick={() => { setIsEditing(false); setFormData({ id: null, full_name: '', phone: '', job: '' }); setShowModal(true); }}>
          + إضافة عامل جديد
        </button>
      </div>

      <div className="glass-card section-card">
        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>الاسم الكامل</th>
                <th>رقم الهاتف</th>
                <th>المهنة / التخصص</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {workers.map(w => (
                <tr key={w.id}>
                  <td style={{ fontWeight: '600' }}>{w.full_name}</td>
                  <td>{w.phone}</td>
                  <td><span className="badge badge-whatsapp">{w.job}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(w)}>✏️ تعديل</button>
                      <button className="btn btn-ghost btn-sm" style={{ color: '#ff4d4d' }} onClick={() => handleDelete(w.id)}>🗑️ حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content" style={{ maxWidth: '500px', width: '90%' }}>
            <h2>{isEditing ? 'تعديل بيانات العامل' : 'إضافة عامل جديد'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label className="input-label">الاسم الكامل</label>
                <input className="input-field" required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="input-label">رقم الواتساب (213XXXXXXXXX)</label>
                <input className="input-field" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="input-label">المهنة (كهربائي، سباك...)</label>
                <input className="input-field" required value={formData.job} onChange={e => setFormData({...formData, job: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                <button type="submit" className="btn btn-whatsapp" style={{ flex: 1 }}>حفظ البيانات</button>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .worker-mgmt-container { padding: 20px; }
        .data-table { width: 100%; border-collapse: collapse; text-align: right; }
        .data-table th, .data-table td { padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .data-table th { color: var(--text-secondary); font-size: 14px; }
        .data-table tr:hover { background: rgba(255,255,255,0.05); }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justifyContent: center; z-index: 1000; }
        .modal-content { animation: slideUp 0.3s ease-out; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  )
}
