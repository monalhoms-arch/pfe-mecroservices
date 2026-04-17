import React, { useState, useContext } from 'react'
import { ToastContext } from '../App'

const PROVIDERS = [
  { id: 1, name: 'أحمد محمد', job: 'فني كهرباء (صيانة عامة)', avatar: 'أ' },
  { id: 2, name: 'سليم بن عيسى', job: 'سباك صحي (تمديدات)', avatar: 'س' },
  { id: 3, name: 'ياسين حامد', job: 'مصلح أجهزة (إلكترونيات)', avatar: 'ي' }
]

export default function MarketplaceTab() {
  const showToast = useContext(ToastContext)
  const [custName, setCustName] = useState('')
  const [apptDate, setApptDate] = useState('')
  const [location, setLocation] = useState({ lat: null, lng: null })
  const [locStatus, setLocStatus] = useState('لم يتم تحديد الموقع')
  const [loadingId, setLoadingId] = useState(null)

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showToast('المتصفح لا يدعم تحديد الموقع', 'error')
      return
    }
    setLocStatus('⏳ جاري التحليل...')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocStatus(`✅ موقعك: ${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}`)
        showToast('تم تحديد الموقع بنجاح', 'success')
      },
      () => {
        setLocStatus('❌ تعذّر تحديد الموقع')
        showToast('يرجى السماح بالوصول للموقع', 'error')
      }
    )
  }

  const handleWhatsApp = async (pId) => {
    if (!custName.trim()) return showToast('يرجى كتابة اسم الزبون أولاً', 'error')
    setLoadingId(pId)
    
    const body = {
      provider_id: pId,
      customer_name: custName,
      appointment_datetime: apptDate || null,
      latitude: location.lat,
      longitude: location.lng
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/send-to-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (data.status === 'processing') {
        window.location.href = data.redirect
      }
    } catch {
      showToast('خطأ في الاتصال بسيرفر الواتساب', 'error')
    } finally { setLoadingId(null) }
  }

  const handleInvoice = async (pId) => {
    if (!custName.trim()) return showToast('يرجى كتابة اسم الزبون أولاً', 'error')
    const price = prompt('أدخل سعر الخدمة (DZD):')
    if (!price || isNaN(price)) return showToast('سعر غير صحيح', 'error')

    setLoadingId(pId + '-inv')
    try {
      const res = await fetch('http://127.0.0.1:8000/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_id: pId,
          customer_name: custName,
          service_price: parseFloat(price),
          appointment_datetime: apptDate || null
        })
      })
      const data = await res.json()
      if (data.status === 'success') {
        showToast('تم إنشاء الفاتورة بنجاح', 'success')
        window.open(data.invoice_url, '_blank')
      }
    } catch {
      showToast('خطأ في الاتصال بسيرفر الفواتير', 'error')
    } finally { setLoadingId(null) }
  }

  return (
    <div className="marketplace-container">
      <div className="page-header">
        <div className="page-header-top">
          <div className="page-icon page-icon-whatsapp">🏪</div>
          <div>
            <h1>سوق العمل (Marketplace)</h1>
            <p>حجز العمال الميدانيين والتواصل المباشر معهم</p>
          </div>
        </div>
      </div>

      <div className="glass-card section-card">
        <span className="section-title">📊 بيانات الطلب الحالية</span>
        <div className="two-col" style={{ gap: '20px' }}>
          <div className="form-group">
            <label className="input-label">اسم الزبون الكامل</label>
            <input className="input-field" placeholder="محمد أمين..." value={custName} onChange={e => setCustName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="input-label">توقيت الخدمة (اختياري)</label>
            <input type="datetime-local" className="input-field" value={apptDate} onChange={e => setApptDate(e.target.value)} />
          </div>
        </div>
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button className="btn btn-gps btn-sm" onClick={handleGetLocation}>📍 رصد موقعي الجغرافي</button>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{locStatus}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '30px' }}>
        {PROVIDERS.map(p => (
          <div key={p.id} className="glass-card section-card" style={{ textAlign: 'center', transition: 'transform 0.2s' }}>
            <div style={{ width: '60px', height: '60px', background: 'var(--port-wa-bg)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '24px', fontWeight: 'bold' }}>
              {p.avatar}
            </div>
            <h3 style={{ fontSize: '17px', marginBottom: '4px' }}>{p.name}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>{p.job}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn btn-whatsapp" onClick={() => handleWhatsApp(p.id)} disabled={loadingId === p.id}>
                {loadingId === p.id ? 'جاري الاتصال...' : 'تواصل عبر واتساب 💬'}
              </button>
              <button className="btn btn-ghost" onClick={() => handleInvoice(p.id)} disabled={loadingId === p.id + '-inv'}>
                {loadingId === p.id + '-inv' ? 'جاري التوليد...' : '🧾 فاتورة PDF'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
