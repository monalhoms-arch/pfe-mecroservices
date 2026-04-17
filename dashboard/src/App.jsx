import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import WorkerDashboard from './components/WorkerDashboard' // Assuming this is the old one if needed, but we used App.jsx logic
import ProviderCard from './components/ProviderCard'
import ArchitectureMonitor from './components/ArchitectureMonitor'

// Admin Components
import AdminWhatsApp from './components/admin/AdminWhatsApp'
import AdminPDF from './components/admin/AdminPDF'
import AdminGPS from './components/admin/AdminGPS'

const PROVIDERS = [
  { id: 1, name: 'أحمد محمد', job: 'فني كهرباء (صيانة عامة)', avatar: 'أ' },
  { id: 2, name: 'سليم بن عيسى', job: 'سباك صحي (تمديدات)', avatar: 'س' },
  { id: 3, name: 'ياسين حامد', job: 'مصلح أجهزة (إلكترونيات)', avatar: 'ي' }
]

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [custName, setCustName] = useState('')
  const [apptDate, setApptDate] = useState('')
  const [location, setLocation] = useState({ lat: null, lng: null })
  const [locStatus, setLocStatus] = useState('لم يتم رصد الموقع')
  const [reminders, setReminders] = useState([])
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showToast('⚠️ المتصفح لا يدعم بروتوكول تحديد المواقع')
      return
    }
    setLocStatus('📡 جاري رصد الإحداثيات...')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocStatus(`📍 تم التحديد: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`)
        showToast('✅ تم بنجاح رصد موقعك الجغرافي')
      },
      () => {
        setLocStatus('❌ فشل الوصول للموقع')
        showToast('يرجى تفعيل صلاحيات الموقع في المتصفح')
      }
    )
  }

  const loadReminders = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/reminders')
      const data = await res.json()
      setReminders(data.scheduled_jobs || [])
    } catch { /* Silent */ }
  }

  useEffect(() => {
    if (activeTab === 'reminders') loadReminders()
  }, [activeTab])

  return (
    <div className="app-wrapper">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-viewport showcase-container" style={{ padding: '40px 24px' }}>
        
        {/* Marketplace View */}
        {activeTab === 'dashboard' && (
          <div className="fade-in-up">
            <header>
              <h1 className="headline">منصة خدمتي</h1>
              <p className="subheadline">النظام البيئي المتكامل لإدارة خدمات الصيانة عبر تقنيات الـ Microservices</p>
            </header>

            <section className="glass-pane" style={{ marginBottom: '60px' }}>
              <h3 className="headline" style={{ fontSize: '24px', textAlign: 'right', marginBottom: '24px' }}>تجهيز طلب الخدمة</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <div className="form-group">
                  <label className="label">إسم العميل</label>
                  <input className="input-field" placeholder="أدخل اسمك الكامل..." value={custName} onChange={e => setCustName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="label">توقيت الموعد المفضل</label>
                  <input type="datetime-local" className="input-field" value={apptDate} onChange={e => setApptDate(e.target.value)} />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <button className={`btn-premium ${location.lat ? 'btn-primary' : 'btn-outline'}`} onClick={handleGetLocation}>
                    {location.lat ? '📍 الموقع المسجل' : '📍 رصد الموقع الحالي'}
                  </button>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px', textAlign: 'center' }}>{locStatus}</p>
                </div>
              </div>
            </section>

            <div className="grid-layout">
              {PROVIDERS.map(p => (
                <ProviderCard key={p.id} provider={p} customerName={custName} apptDate={apptDate} location={location} showToast={showToast} />
              ))}
            </div>

            <ArchitectureMonitor />
          </div>
        )}

        {/* Reminders View */}
        {activeTab === 'reminders' && (
          <div className="fade-in-up">
            <h2 className="headline" style={{ textAlign: 'right' }}>🔔 التذكيرات النشطة</h2>
            <div className="glass-pane">
              {reminders.length > 0 ? (
                reminders.map((job, i) => (
                  <div key={i} className="reminder-item">
                    <span style={{ fontSize: '24px' }}>⏰</span>
                    <div>
                      <h4 style={{ fontSize: '15px' }}>موعد مجدول لنظام الواتساب</h4>
                      <p style={{ color: 'var(--text-dim)', fontSize: '12px' }}>وقت التنفيذ المخطط: {job.next_run}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>لا توجد تذكيرات مجدولة حالياً.</p>
              )}
            </div>
          </div>
        )}

        {/* Admin Views */}
        {activeTab === 'admin-wa' && <AdminWhatsApp showToast={showToast} />}
        {activeTab === 'admin-pdf' && <AdminPDF showToast={showToast} />}
        {activeTab === 'admin-gps' && <AdminGPS showToast={showToast} />}

        {/* Footer */}
        <footer style={{ marginTop: '100px', borderTop: '1px solid var(--glass-border)', paddingTop: '40px', textAlign: 'center', opacity: 0.5 }}>
          <p>منصة خدمتي — Khidmati Ecosystem 2026</p>
        </footer>
      </main>

      {/* Global Toast */}
      {toast && <div className="toast fade-in">{toast}</div>}
    </div>
  )
}

export default App
