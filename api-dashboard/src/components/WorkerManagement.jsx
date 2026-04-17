import React, { useState, useEffect, useContext } from 'react'
import { ToastContext } from '../App'

export default function WorkerManagement() {
  const showToast = useContext(ToastContext)
  const [workers, setWorkers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ id: null, full_name: '', phone: '', job: '' })
  const [isEditing, setIsEditing] = useState(false)

  const API_KEY = 'my_super_secret_key_123'
  const BASE_URL = 'http://127.0.0.1:8000/api/v1/marketplace/providers'

  useEffect(() => { fetchWorkers() }, [])

  const fetchWorkers = async () => {
    try {
      setLoading(true)
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
        showToast(isEditing ? '✅ تم تحديث بيانات العامل' : '🚀 تم تسجيل العامل بنجاح')
        setShowModal(false)
        setFormData({ id: null, full_name: '', phone: '', job: '' })
        fetchWorkers()
      } else {
        showToast('❌ حدث خطأ أثناء الحفظ', 'error')
      }
    } catch (err) {
      showToast('⚠️ خطأ في الاتصال بالسيرفر', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('🚨 هل أنت متأكد من حذف هذا العامل نهائياً من قاعدة البيانات؟')) return

    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'X-API-KEY': API_KEY }
      })
      if (res.ok) {
        showToast('🗑️ تم حذف العامل بنجاح')
        fetchWorkers()
      }
    } catch (err) {
      showToast('فشل في عملية الحذف', 'error')
    }
  }

  const openEdit = (w) => {
    setFormData(w)
    setIsEditing(true)
    setShowModal(true)
  }

  const filteredWorkers = workers.filter(w => 
    w.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.job?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="worker-mgmt-container fade-in-up">
      <header className="page-header">
        <div className="page-header-top">
          <div className="page-icon page-icon-whatsapp">👷</div>
          <div style={{ flex: 1 }}>
            <h1>إدارة طاقم العمال</h1>
            <p>التحكم الكامل في سجلات المزودين المسجلين في قاعدة بيانات abc</p>
          </div>
          <button className="btn btn-whatsapp" onClick={() => { setIsEditing(false); setFormData({ id: null, full_name: '', phone: '', job: '' }); setShowModal(true); }}>
            + تسجيل عامل جديد
          </button>
        </div>
      </header>

      <div className="glass-card section-card" style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="🔍 ابحث عن عامل بالاسم أو التخصص..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingRight: '45px' }}
          />
        </div>
      </div>

      <div className="worker-grid">
        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : filteredWorkers.length > 0 ? (
          filteredWorkers.map(w => (
            <div key={w.id} className="glass-card worker-admin-card fade-in-up">
              <div className="worker-admin-info">
                <div className="worker-admin-avatar">
                  {w.full_name[0]}
                </div>
                <div>
                  <h3>{w.full_name}</h3>
                  <p>{w.phone}</p>
                </div>
              </div>
              <div className="worker-admin-job">
                <span className="badge badge-whatsapp">{w.job}</span>
              </div>
              <div className="worker-admin-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(w)}>✏️ تعديل</button>
                <button className="btn btn-ghost btn-sm btn-danger" onClick={() => handleDelete(w.id)}>🗑️ حذف</button>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card section-card" style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '50px' }}>
            <p style={{ color: 'var(--text-muted)' }}>لا توجد نتائج تطابق بحثك حالياً.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content" style={{ maxWidth: '500px', width: '90%' }}>
            <h2 className="section-title">
              {isEditing ? '✏️ تعديل بيانات العامل' : '🚀 تسجيل عامل جديد'}
            </h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label className="input-label">الاسم الكامل</label>
                <input className="input-field" required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} placeholder="مثال: سليم حامد..." />
              </div>
              <div className="form-group">
                <label className="input-label">رقم الهاتف (WhatsApp)</label>
                <input className="input-field" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="213XXXXXXXXX" />
              </div>
              <div className="form-group">
                <label className="input-label">المهنة أو التخصص</label>
                <input className="input-field" required value={formData.job} onChange={e => setFormData({...formData, job: e.target.value})} placeholder="سباك، كهربائي..." />
              </div>
              <div className="modal-actions" style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                <button type="submit" className="btn btn-whatsapp" style={{ flex: 1 }}>{isEditing ? 'تحديث' : 'حفظ'}</button>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .worker-admin-card { display: flex; flex-direction: column; gap: 15px; transition: transform 0.2s; position: relative; overflow: hidden; }
        .worker-admin-card:hover { transform: translateY(-5px); border-color: var(--accent-whatsapp); }
        .worker-admin-info { display: flex; align-items: center; gap: 15px; }
        .worker-admin-avatar { width: 45px; height: 45px; background: var(--accent-whatsapp); border-radius: 50%; display: flex; align-items: center; justifyContent: center; font-weight: bold; color: #000; }
        .worker-admin-card h3 { margin: 0; font-size: 16px; }
        .worker-admin-card p { margin: 0; font-size: 13px; color: var(--text-secondary); }
        .worker-admin-actions { display: flex; justify-content: space-between; margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.05); pt: 15px; }
        .worker-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .btn-danger { color: #ff6b6b !important; }
        .btn-danger:hover { background: rgba(255,107,107,0.1) !important; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); display: flex; align-items: center; justifyContent: center; z-index: 1000; padding: 20px; }
      `}</style>
    </div>
  )
}
