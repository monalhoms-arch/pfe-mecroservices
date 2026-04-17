import React, { useState, useContext, useEffect } from 'react'
import { ToastContext } from '../App'

export default function MarketplaceTab() {
  const showToast = useContext(ToastContext)
  const [providers, setProviders] = useState([])
  const [custName, setCustName] = useState('')
  const [apptDate, setApptDate] = useState('')
  const [location, setLocation] = useState({ lat: null, lng: null })
  const [locStatus, setLocStatus] = useState('لم يتم تحديد الموقع')
  const [loadingId, setLoadingId] = useState(null)
  const [fetching, setFetching] = useState(true)

  // جلب البيانات من الميكروسيرفس (Port 8000)
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const url = `http://127.0.0.1:8000/api/v1/marketplace/providers?t=${new Date().getTime()}`;
        console.log("DEBUG FRONTEND: Fetching from", url);
        const res = await fetch(url);
        console.log("DEBUG FRONTEND: Response Status", res.status);
        const data = await res.json();
        console.log("DEBUG FRONTEND: Data length", data.length, data);
        setProviders(data);
      } catch (err) {
        console.error("DEBUG FRONTEND ERROR:", err);
        showToast('فشل جلب قائمة العمال من قاعدة البيانات', 'error')
      } finally {
        setFetching(false)
      }
    }
    fetchProviders()
  }, [])

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
      const res = await fetch('http://127.0.0.1:8000/api/v1/marketplace/send-to-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (data.status === 'processing') {
        window.open(data.redirect, '_blank')
        showToast('جاري فتح واتساب...', 'success')
      } else {
        showToast('حدث خطأ في الخادم', 'error')
      }
    } catch {
      showToast('خطأ في الاتصال بسيرفر الواتساب', 'error')
    } finally { setLoadingId(null) }
  }

  const handleInvoice = async (p) => {
    if (!custName.trim()) return showToast('يرجى كتابة اسم الزبون أولاً', 'error')
    const price = prompt(`أدخل سعر الخدمة لـ ${p.full_name} (DZD):`)
    if (!price || isNaN(price)) return showToast('سعر غير صحيح', 'error')

    setLoadingId(p.id + '-inv')
    try {
      const res = await fetch('http://127.0.0.1:8002/api/v1/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_id: p.id,
          provider_name: p.full_name,
          provider_details: p.job,
          customer_name: custName,
          items: [{ description: p.job || 'صيانة عامة', price: parseFloat(price), quantity: 1 }],
          currency: 'DZD'
        })
      })
      const data = await res.json()
      if (data.status === 'success') {
        showToast('تم إنشاء الفاتورة بنجاح', 'success')
        window.open(data.download_url, '_blank')
      }
    } catch (err) {
      showToast('خطأ في الاتصال بسيرفر الفواتير', 'error')
    } finally { setLoadingId(null) }
  }

  return (
    <div className="marketplace-container">
      <div className="page-header">
        <div className="page-header-top">
          <div className="page-icon page-icon-whatsapp">🏪</div>
          <div>
            <h1>سوق العمل الذكي (Real Database)</h1>
            <p>يتم جلب بيانات العمال مباشرة من قاعدة البيانات abc عبر الـ Microservices</p>
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

      {fetching ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <span className="spinner" style={{ borderTopColor: 'var(--accent-whatsapp)' }} />
          <p style={{ marginTop: '10px' }}>جاري التحميل من قاعدة البيانات...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '30px' }}>
          {providers.length > 0 ? (
            providers.map(p => (
              <div key={p.id} className="glass-card section-card" style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--accent-whatsapp)', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '24px', fontWeight: 'bold' }}>
                  {p.full_name[0]}
                </div>
                <h3 style={{ fontSize: '17px', marginBottom: '4px' }}>{p.full_name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>{p.job}</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button className="btn btn-whatsapp" onClick={() => handleWhatsApp(p.id)} disabled={loadingId === p.id}>
                    {loadingId === p.id ? 'جاري الاتصال...' : 'تواصل عبر واتساب 💬'}
                  </button>
                  <button className="btn btn-ghost" onClick={() => handleInvoice(p)} disabled={loadingId === p.id + '-inv'}>
                    {loadingId === p.id + '-inv' ? 'جاري التوليد...' : '🧾 فاتورة PDF'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>لا يوجد عمال مسجلين في قاعدة البيانات حالياً.</p>
          )}
        </div>
      )}
    </div>
  )
}
