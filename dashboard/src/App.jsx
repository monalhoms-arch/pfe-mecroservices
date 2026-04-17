import React, { useState, useEffect } from 'react'
import ProviderCard from './components/ProviderCard'
import ArchitectureMonitor from './components/ArchitectureMonitor'

const PROVIDERS = [
  { id: 1, name: 'أحمد محمد', job: 'فني كهرباء (صيانة عامة)', avatar: 'أ' },
  { id: 2, name: 'سليم بن عيسى', job: 'سباك صحي (تمديدات)', avatar: 'س' },
  { id: 3, name: 'ياسين حامد', job: 'مصلح أجهزة (إلكترونيات)', avatar: 'ي' }
]

function App() {
  const [custName, setCustName] = useState('')
  const [apptDate, setApptDate] = useState('')
  const [location, setLocation] = useState({ lat: null, lng: null })
  const [locStatus, setLocStatus] = useState('لم يتم رصد الموقع')
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

  return (
    <div className="showcase-container">
      {/* Hero Section */}
      <header className="fade-in-up" style={{ animationDelay: '0.1s' }}>
        <h1 className="headline">منصة خدمتي</h1>
        <p className="subheadline">النظام البيئي المتكامل لإدارة خدمات الصيانة عبر تقنيات الـ Microservices</p>
      </header>

      {/* Main Request Form */}
      <section className="glass-pane fade-in-up" style={{ marginBottom: '60px', animationDelay: '0.2s' }}>
        <h3 className="headline" style={{ fontSize: '24px', textAlign: 'right', marginBottom: '24px' }}>تجهيز طلب الخدمة</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="form-group">
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)', marginBottom: '8px', display: 'block' }}>إسم العميل</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="أدخل اسمك الكامل هنا..." 
              value={custName}
              onChange={(e) => setCustName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)', marginBottom: '8px', display: 'block' }}>توقيت الموعد المفضل</label>
            <input 
              type="datetime-local" 
              className="input-field"
              value={apptDate}
              onChange={(e) => setApptDate(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <button 
              className={`btn-premium ${location.lat ? 'btn-primary' : 'btn-outline'}`} 
              onClick={handleGetLocation}
            >
              {location.lat ? '📍 الموقع المسجل' : '📍 رصد الموقع الحالي'}
            </button>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px', textAlign: 'center' }}>{locStatus}</p>
          </div>
        </div>
      </section>

      {/* Worker Grid */}
      <div className="grid-layout">
        {PROVIDERS.map((provider, i) => (
          <div key={provider.id} style={{ animationDelay: `${0.3 + i * 0.1}s` }} className="fade-in-up">
            <ProviderCard 
              provider={provider}
              customerName={custName}
              apptDate={apptDate}
              location={location}
              showToast={showToast}
            />
          </div>
        ))}
      </div>

      {/* Architecture Section */}
      <div style={{ animationDelay: '0.6s' }} className="fade-in-up">
        <ArchitectureMonitor />
      </div>

      {/* Footer / Meta Data */}
      <footer style={{ marginTop: '100px', borderTop: '1px solid var(--glass-border)', paddingTop: '40px', textAlign: 'center' }}>
        <div style={{ opacity: 0.6, fontSize: '14px' }}>
          <p>مشروع تخرج: منصة خدمتي لإدارة العمالة الذكية</p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '16px' }}>
            <span>Python / FastAPI</span>
            <span>React / Vite</span>
            <span>Microservices Architecture</span>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toast && (
        <div className="toast fade-in" style={{ direction: 'rtl' }}>
          {toast}
        </div>
      )}
    </div>
  )
}

export default App
