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
  const [actionLoading, setActionLoading] = useState(false)

  const API_KEY = 'my_super_secret_key_123'
  const BASE_URL = 'http://127.0.0.1:8000/api/v1/marketplace/providers'

  useEffect(() => { fetchWorkers() }, [])

  const fetchWorkers = async () => {
    try {
      setLoading(true)
      const res = await fetch(BASE_URL)
      const data = await res.json()
      setWorkers(Array.isArray(data) ? data : [])
    } catch (err) {
      showToast('⚠️ فشل في جلب بيانات العمال', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setActionLoading(true)
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
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('🚨 هل أنت متأكد من حذف هذا العامل نهائياً؟')) return

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
    (w.job && w.job.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="worker-mgmt-container fade-in-up">
      <header className="page-header">
        <div className="page-header-top">
          <div className="page-icon" style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>👷</div>
          <div style={{ flex: 1 }}>
            <h1>إدارة طاقم العمال</h1>
            <p>التحكم الكامل في سجلات المزودين والخدمات المتاحة</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setIsEditing(false); setFormData({ id: null, full_name: '', phone: '', job: '' }); setShowModal(true); }}>
            + تسجيل عامل جديد
          </button>
        </div>
      </header>

      <div className="search-bar-wrap glass-card">
         <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 ابحث بالاسم، الرقم، أو التخصص..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
      </div>

      {loading ? (
        <div className="loading-grid">
           {[1,2,3,4].map(i => <div key={i} className="skeleton-card glass-card"></div>)}
        </div>
      ) : (
        <div className="worker-grid">
          {filteredWorkers.length > 0 ? (
            filteredWorkers.map((w, index) => (
              <div key={w.id} className="glass-card worker-admin-card" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="worker-card-header">
                  <div className="worker-avatar">
                    {w.full_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                  </div>
                  <div className="worker-main-info">
                    <h3>{w.full_name}</h3>
                    <span className="worker-job-badge">{w.job || 'بدون تخصص'}</span>
                  </div>
                </div>
                
                <div className="worker-details">
                   <div className="detail-item">
                      <span className="label">رقم الهاتف</span>
                      <span className="value">{w.phone}</span>
                   </div>
                </div>

                <div className="card-actions-footer">
                  <button className="btn-icon-text" onClick={() => openEdit(w)}>
                    <span className="icon">✏️</span> تعديل
                  </button>
                  <button className="btn-icon-text danger" onClick={() => handleDelete(w.id)}>
                    <span className="icon">🗑️</span> حذف
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state glass-card">
               <div className="empty-icon">📭</div>
               <p>لا يوجد عمال مسجلون حالياً أو لا تطابق نتائج البحث.</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="glass-card modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">
              {isEditing ? '✏️ تعديل بيانات العامل' : '🚀 تسجيل عامل جديد'}
            </h2>
            <form onSubmit={handleSubmit} className="modern-form">
              <div className="form-row">
                <div className="form-group">
                  <label>الاسم الكامل</label>
                  <input className="input-field" required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} placeholder="مثال: يوسف أحمد" />
                </div>
                <div className="form-group">
                  <label>المهنة</label>
                  <input className="input-field" required value={formData.job} onChange={e => setFormData({...formData, job: e.target.value})} placeholder="مثال: مصلح مكيفات" />
                </div>
              </div>
              <div className="form-group">
                <label>رقم الواتساب</label>
                <input className="input-field" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="213XXXXXXXXX" />
              </div>
              <div className="modal-footer-btns">
                <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                  {actionLoading ? 'جاري الحفظ...' : (isEditing ? 'تحديث البيانات' : 'إتمام التسجيل')}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .search-bar-wrap { margin-bottom: 25px; padding: 5px; border-radius: 15px; }
        .search-input { width: 100%; padding: 12px 20px; background: transparent; border: none; color: white; outline: none; font-size: 15px; }
        
        .worker-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .worker-admin-card { 
          padding: 20px; 
          display: flex; 
          flex-direction: column; 
          gap: 15px; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: slideIn 0.5s ease backwards;
        }
        .worker-admin-card:hover { transform: translateY(-8px); border-color: var(--accent-whatsapp); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        
        .worker-card-header { display: flex; align-items: center; gap: 15px; }
        .worker-avatar { 
          width: 50px; height: 50px; 
          background: linear-gradient(135deg, var(--accent-whatsapp), #128c7e); 
          border-radius: 15px; 
          display: flex; align-items: center; justify-content: center; 
          font-weight: bold; color: #000; font-size: 18px;
        }
        .worker-main-info h3 { margin: 0; font-size: 17px; }
        .worker-job-badge { font-size: 11px; background: rgba(37, 211, 102, 0.15); color: #25d366; padding: 2px 8px; border-radius: 10px; margin-top: 4px; display: inline-block; }
        
        .worker-details { padding: 12px; background: rgba(255,255,255,0.03); border-radius: 10px; }
        .detail-item { display: flex; justify-content: space-between; font-size: 13px; }
        .detail-item .label { color: var(--text-dim); }
        
        .card-actions-footer { display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px; }
        .btn-icon-text { background: transparent; border: none; color: white; display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 14px; opacity: 0.7; transition: 0.3s; }
        .btn-icon-text:hover { opacity: 1; color: var(--accent-whatsapp); }
        .btn-icon-text.danger:hover { color: #ff6b6b; }
        
        .empty-state { grid-column: 1 / -1; text-align: center; padding: 60px; }
        .empty-icon { font-size: 50px; margin-bottom: 15px; opacity: 0.5; }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-content { width: 100%; max-width: 550px; padding: 35px; border: 1px solid rgba(255,255,255,0.1); }
        .modal-title { margin-bottom: 25px; font-size: 22px; }
        .form-row { display: flex; gap: 15px; }
        .form-row .form-group { flex: 1; }
        .modal-footer-btns { display: flex; gap: 15px; margin-top: 30px; }
        .modal-footer-btns .btn { flex: 1; }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .skeleton-card { height: 180px; border-radius: 20px; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 0.6; } 100% { opacity: 0.3; } }
      `}</style>
    </div>
  )
}
