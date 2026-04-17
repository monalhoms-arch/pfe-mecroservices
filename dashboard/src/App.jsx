import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ProviderCard from './components/ProviderCard'
import ArchitectureMonitor from './components/ArchitectureMonitor'

// Admin & Test Tools
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
  
  // Service Pulse State
  const [onlineCount, setOnlineCount] = useState(0)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showToast('⚠️ المتصفح لا يدعم بروتوكول الموقع')
      return
    }
    setLocStatus('📡 جاري رصد الإحداثيات...')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocStatus(`📍 تم التحديد: ${pos.coords.latitude.toFixed(4)}`)
        showToast('✅ تم بنجاح رصد موقعك الجغرافي')
      },
      () => {
        setLocStatus('❌ فشل الوصول للموقع')
        showToast('يرجى تفعيل الصلاحيات في المتصفح')
      }
    )
  }

  useEffect(() => {
    const checkServices = async () => {
      let count = 0
      for (let port of [8000, 8001, 8002]) {
        try { await fetch(`http://127.0.0.1:${port}/health`, { mode: 'no-cors' }); count++ } catch {}
      }
      setOnlineCount(count)
    }
    checkServices()
    const interval = setInterval(checkServices, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="app-wrapper">
      {/* Global Persistence: Health Header */}
      <header className="global-health-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="status-chip">
            <div className={`pulse ${onlineCount > 0 ? 'pulse-green' : ''}`} />
            <span>الحالة التشغيلية: {onlineCount}/3 خدمات متصلة</span>
          </div>
        </div>
        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-secondary)' }}>
          KHIDMATI GATEWAY v2.0
        </div>
      </header>

      <div style={{ display: 'flex' }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="main-viewport showcase-container">
          
          <div key={activeTab} className="page-transition">
            {/* ── Marketplace View ── */}
            {activeTab === 'dashboard' && (
              <>
                <header style={{ marginBottom: '40px' }}>
                  <h1 className="headline" style={{ fontSize: '42px', textAlign: 'center' }}>منصة خدمتي</h1>
                  <p className="subheadline">النظام البيئي الذكي لإدارة خدمات الصيانة الميدانية</p>
                </header>

                <section className="glass-pane" style={{ marginBottom: '60px' }}>
                  <label className="label">تجهيز طلب حجز عامل</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    <div className="form-group">
                      <input className="input-field" placeholder="اسم العميل الكامل..." value={custName} onChange={e => setCustName(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <input type="datetime-local" className="input-field" value={apptDate} onChange={e => setApptDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <button className={`btn-premium ${location.lat ? 'btn-primary' : 'btn-outline'}`} onClick={handleGetLocation}>
                        {location.lat ? '📍 الموقع الجغرافي مؤمن' : '📍 رصد الموقع الحالي'}
                      </button>
                    </div>
                  </div>
                </section>

                <div className="grid-layout">
                  {PROVIDERS.map(p => (
                    <ProviderCard key={p.id} provider={p} customerName={custName} apptDate={apptDate} location={location} showToast={showToast} />
                  ))}
                </div>

                <ArchitectureMonitor />
              </>
            )}

            {/* ── Admin Tools ── */}
            {activeTab === 'admin-wa' && <AdminWhatsApp showToast={showToast} />}
            {activeTab === 'admin-pdf' && <AdminPDF showToast={showToast} />}
            {activeTab === 'admin-gps' && <AdminGPS showToast={showToast} />}
          </div>

          {/* Academic Footer */}
          <footer style={{ marginTop: '120px', borderTop: '1px solid var(--glass-border)', paddingTop: '60px', opacity: 0.8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
              <div>
                <h5 style={{ color: 'var(--primary)', marginBottom: '12px' }}>المنهجية البرمجية</h5>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>تعتمد المنصة على بنية Microservices منفصلة لضمان استمرارية العمل حتى في حال توقف أحد الأجزاء.</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <h5 style={{ color: 'var(--secondary)', marginBottom: '12px' }}>التقنيات المستخدمة</h5>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>React 18 / Vite / FastAPI / Redis / SQL / Evolution API</p>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h5 style={{ color: 'var(--accent)', marginBottom: '12px' }}>الغرض من المشروع</h5>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>مشروع تخرج لنيل شهادة مهندس دولة في الإعلام الآلي - جامعة 2026</p>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {toast && <div className="toast fade-in">{toast}</div>}
    </div>
  )
}

export default App
