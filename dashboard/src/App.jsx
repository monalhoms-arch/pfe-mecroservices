import React, { useState, useEffect } from 'react'
import ProviderCard from './components/ProviderCard'

const PROVIDERS = [
  { id: 1, name: 'أحمد محمد', job: 'فني كهرباء', avatar: 'أم' },
  { id: 2, name: 'سليم بن عيسى', job: 'سباك صحي', avatar: 'سب' },
  { id: 3, name: 'ياسين حامد', job: 'مصلح أجهزة', avatar: 'يح' }
]

function App() {
  const [custName, setCustName] = useState('')
  const [apptDate, setApptDate] = useState('')
  const [location, setLocation] = useState({ lat: null, lng: null })
  const [locStatus, setLocStatus] = useState('لم يتم تحديد الموقع بعد')
  const [reminders, setReminders] = useState([])
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showToast('المتصفح لا يدعم تحديد الموقع')
      return
    }
    setLocStatus('⏳ جاري تحديد موقعك...')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocStatus(`✅ تم تحديد موقعك (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`)
        showToast('تم تحديد الموقع بنجاح')
      },
      () => {
        setLocStatus('❌ تعذّر تحديد الموقع')
        showToast('يرجى السماح بالوصول إلى الموقع')
      }
    )
  }

  const loadReminders = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/reminders')
      const data = await res.json()
      setReminders(data.scheduled_jobs || [])
    } catch {
      // API not available yet
    }
  }

  useEffect(() => {
    loadReminders()
    const interval = setInterval(loadReminders, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container fade-in">
      <header>
        <h1>🛠️ منصة خدمتي</h1>
        <p className="subtitle">تواصل مع مزود الخدمة مباشرة عبر واتساب</p>
      </header>

      {/* Customer Input Section */}
      <section className="premium-card">
        <h3 className="card-title">بيانات الطلب</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="label">اسمك كزبون</label>
            <input 
              type="text" 
              className="input" 
              placeholder="مثال: محمد أمين" 
              value={custName}
              onChange={(e) => setCustName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="label">📅 موعد الخدمة (اختياري)</label>
            <input 
              type="datetime-local" 
              className="input"
              value={apptDate}
              onChange={(e) => setApptDate(e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <button className={`btn ${location.lat ? 'btn-primary' : 'btn-ghost'}`} onClick={handleGetLocation}>
            📍 مشاركة موقعي الجغرافي
          </button>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>{locStatus}</p>
        </div>
      </section>

      {/* Marketplace Grid */}
      <div className="marketplace-grid">
        {PROVIDERS.map(provider => (
          <ProviderCard 
            key={provider.id}
            provider={provider}
            customerName={custName}
            apptDate={apptDate}
            location={location}
            showToast={showToast}
          />
        ))}
      </div>

      {/* Reminders Section */}
      {reminders.length > 0 && (
        <section className="premium-card" style={{ marginTop: '32px' }}>
          <h3 className="card-title">🔔 التذكيرات المجدولة</h3>
          <div className="reminders-list">
            {reminders.map((job, i) => (
              <div key={i} className="reminder-item">
                <span style={{ fontSize: '18px' }}>🔔</span>
                <div>
                  <strong>موعد مجدول</strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>وقت التنفيذ: {job.next_run}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Toast Notification */}
      {toast && <div className="toast">{toast}</div>}
      
      <footer style={{ marginTop: '48px', textAlign: 'center', opacity: 0.5, fontSize: '12px' }}>
        <p>منصة خدمتي — إدارة عمال الصيانة عبر الواتساب</p>
        <p>Software Engineering Graduation Project 2026</p>
      </footer>
    </div>
  )
}

export default App
