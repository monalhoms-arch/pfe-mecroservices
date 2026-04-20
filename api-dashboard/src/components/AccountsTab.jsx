import React, { useState, useEffect, useContext } from 'react'
import { ToastContext } from '../App'

export default function AccountsTab() {
  const showToast = useContext(ToastContext)
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  
  // Form State
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [isBusiness, setIsBusiness] = useState(false)

  const API_KEY = 'my_super_secret_key_123'
  const BASE_URL = 'http://127.0.0.1:8000/api/v1/accounts'

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/`, {
        headers: { 'X-API-KEY': API_KEY }
      })
      if (res.ok) {
        const data = await res.json()
        setAccounts(data || [])
      } else {
        const errData = await res.json().catch(() => ({}))
        showToast(`خطأ جلب الحسابات: ${errData.detail || 'غير معروف'}`, 'error')
      }
    } catch (err) {
      showToast('خطأ في الاتصال بسيرفر الواتساب', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAddAccount = async () => {
    if (!phone || !name) return showToast('يرجى إدخال الهاتف والاسم', 'error')
    setActionLoading(true)
    try {
      const payload = {
        phone_number: phone,
        name: name,
        is_business_whatsapp: isBusiness,
        is_verified: true
      }
      const res = await fetch(`${BASE_URL}/`, {
        method: 'POST',
        headers: { 
          'X-API-KEY': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        showToast('✅ تم إضافة الحساب بنجاح')
        setPhone('')
        setName('')
        setIsBusiness(false)
        setShowModal(false)
        fetchAccounts()
      } else {
        const errData = await res.json().catch(() => ({}))
        showToast(`❌ فشل: ${errData.detail}`, 'error')
      }
    } catch (err) {
      showToast('خطأ أثناء إضافة الحساب', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (phone) => {
    if (!window.confirm(`⚠️ هل أنت متأكد من حذف الحساب "${phone}"؟`)) return
    setActionLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/${phone}`, {
        method: 'DELETE',
        headers: { 'X-API-KEY': API_KEY }
      })
      if (res.ok) {
        showToast('🗑️ تم الحذف بنجاح')
        fetchAccounts()
      } else {
         const errData = await res.json().catch(() => ({}))
         showToast(`❌ خطأ: ${errData.detail}`, 'error')
      }
    } catch (err) {
      showToast('خطأ في الحذف', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="fade-in-up">
      <header className="page-header">
        <div className="page-header-top">
          <div className="page-icon" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>👥</div>
          <div>
            <h1>إدارة الحسابات</h1>
            <p>سجل تفصيلي لجميع الأرقام المربوطة والموثقة في قاعدة بيانات الواتساب</p>
          </div>
        </div>
        <div className="header-actions">
           <button className="btn btn-primary" onClick={() => setShowModal(true)}>
             <span>+ إضافة حساب يدوي</span>
           </button>
           <button className="btn btn-ghost" onClick={fetchAccounts} disabled={loading}>
             {loading ? 'جاري التحديث...' : 'تحديث 🔄'}
           </button>
        </div>
      </header>

      <div className="main-content">
        <section className="glass-card section-card">
          <h2 className="section-title">السجلات المتوفرة ({accounts.length})</h2>
          
          {loading && !accounts.length ? (
            <div className="loading-state">جاري الجلب...</div>
          ) : (
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>الرقم</th>
                    <th>الاسم</th>
                    <th>النوع</th>
                    <th>التوثيق</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((acc) => (
                    <tr key={acc.phone_number}>
                      <td dir="ltr" style={{ textAlign: 'right' }}>{acc.phone_number}</td>
                      <td>{acc.name}</td>
                      <td>
                        <span className={`status-badge ${acc.is_business_whatsapp ? 'status-open' : 'status-business'}`} style={{ backgroundColor: acc.is_business_whatsapp ? 'rgba(0,123,255,0.1)' : 'rgba(37,211,102,0.1)', color: acc.is_business_whatsapp ? '#007bff' : '#25D366' }}>
                          {acc.is_business_whatsapp ? 'أعمال (Business)' : 'شخصي'}
                        </span>
                      </td>
                      <td>
                         <span className="status-badge" style={{ backgroundColor: acc.is_verified ? 'rgba(37,211,102,0.1)' : 'rgba(255,75,75,0.1)', color: acc.is_verified ? '#25D366' : '#FF4B4B'}}>
                            {acc.is_verified ? 'موثق ✅' : 'غير موثق ❌'}
                         </span>
                      </td>
                      <td>
                         <button className="btn-sm btn-ghost" onClick={() => handleDelete(acc.phone_number)} title="حذف" style={{color: '#ff4b4b'}}>
                           حذف
                         </button>
                      </td>
                    </tr>
                  ))}
                  {accounts.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{textAlign: 'center', padding: '30px', color: '#888'}}>
                        لا توجد حسابات مسجلة حالياً
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
           <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
              <h2>إضافة رقم في قاعدة البيانات</h2>
              <div className="form-group" style={{ margin: '15px 0' }}>
                 <label>رقم الهاتف (بصيغة دولية)</label>
                 <input className="input-field" placeholder="مثال: 213XXXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} dir="ltr" />
              </div>
              <div className="form-group" style={{ margin: '15px 0' }}>
                 <label>اسم صاحب الحساب</label>
                 <input className="input-field" placeholder="الاسم الكامل" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group" style={{ margin: '15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <input type="checkbox" id="isBus" checked={isBusiness} onChange={e => setIsBusiness(e.target.checked)} />
                 <label htmlFor="isBus">هذا الحساب هو واتساب أعمال (Business)</label>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button className="btn btn-primary" onClick={handleAddAccount} disabled={actionLoading}>
                   {actionLoading ? 'جاري الإضافة...' : 'حفظ في السيرفر'}
                </button>
                <button className="btn btn-ghost" onClick={() => setShowModal(false)}>إلغاء</button>
              </div>
           </div>
        </div>
      )}
      
      <style>{`
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(5px); }
        .modal-content { max-width: 450px; width: 90%; padding: 30px; text-align: right; border: 1px solid rgba(255,255,255,0.2); }
      `}</style>
    </div>
  )
}
