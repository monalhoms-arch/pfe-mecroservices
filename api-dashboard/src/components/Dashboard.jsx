import { useState, useEffect } from 'react'

const SERVICES = [
  { id: 'whatsapp', port: 8000, name: 'WhatsApp Service', icon: '💬', color: 'var(--accent-whatsapp)' },
  { id: 'pdf',      port: 8002, name: 'PDF Generator',   icon: '📄', color: 'var(--accent-pdf)' },
  { id: 'gps',      port: 8001, name: 'GPS & Location',  icon: '📍', color: 'var(--accent-gps)' },
]

export default function Dashboard() {
  const [statuses, setStatuses] = useState({ 8000: 'checking', 8001: 'checking', 8002: 'checking' })
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    checkAllServices()
    return () => clearInterval(timer)
  }, [])

  const checkAllServices = async () => {
    SERVICES.forEach(async (s) => {
      try {
        // Simple health check (using any public endpoint or root)
        const controller = new AbortController()
        const id = setTimeout(() => controller.abort(), 2000)
        
        // We use various endpoints known to exist from research
        const url = s.port === 8000 ? 'http://localhost:8000/' : 
                    s.port === 8001 ? 'http://localhost:8001/api/v1/maps-url?lat=0&lng=0' :
                    'http://localhost:8002/docs'

        await fetch(url, { signal: controller.signal })
        setStatuses(prev => ({ ...prev, [s.port]: 'online' }))
        clearTimeout(id)
      } catch {
        setStatuses(prev => ({ ...prev, [s.port]: 'offline' }))
      }
    })
  }

  const hour = currentTime.getHours()
  const greeting = hour < 12 ? 'صباح الخير' : hour < 18 ? 'طاب يومك' : 'مساء الخير'

  return (
    <div className="dashboard-container">
      {/* Welcome Header */}
      <header className="dashboard-header">
        <div className="fade-in-up">
          <p className="dashboard-pretitle">{greeting}، أدمن النظام 👋</p>
          <h1 className="dashboard-title">نظرة عامة على المنصة</h1>
        </div>
        <div className="dashboard-header-right">
          <div className="dashboard-clock">
            {currentTime.toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="dashboard-date">
            {currentTime.toLocaleDateString('ar-DZ', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="stats-row">
        <div className="glass-card stat-card fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="stat-card-label">إجمالي الحسابات</div>
          <div className="stat-card-value">1,284</div>
          <div className="stat-card-sub">↑ 12% من الأسبوع الماضي</div>
        </div>
        <div className="glass-card stat-card fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="stat-card-label">رسائل الواتساب اليوم</div>
          <div className="stat-card-value">342</div>
          <div className="stat-card-sub">بمعدل 42 رسالة/ساعة</div>
        </div>
        <div className="glass-card stat-card fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="stat-card-label">فواتير PDF المنشأة</div>
          <div className="stat-card-value">86</div>
          <div className="stat-card-sub">حجم الملفات: 12.4 MB</div>
        </div>
      </div>

      <div className="two-col">
        {/* Service Monitor */}
        <section className="glass-card section-card fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="section-card-header">
            <span className="section-title">📡 حالة الخدمات الحالية</span>
            <button className="btn btn-ghost btn-sm" onClick={checkAllServices}>تحديث الحالة 🔄</button>
          </div>
          <div className="service-status-list">
            {SERVICES.map(s => (
              <div key={s.id} className="service-status-item">
                <div className="service-icon" style={{ background: `${s.color}20`, border: `1px solid ${s.color}40` }}>
                  {s.icon}
                </div>
                <div className="service-info">
                  <div className="service-name">{s.name}</div>
                  <div className="service-port">المنفذ: {s.port}</div>
                </div>
                <div className={`status-indicator ${statuses[s.port]}`}>
                  <div className="status-dot" />
                  <span>{statuses[s.port] === 'online' ? 'يعمل' : statuses[s.port] === 'offline' ? 'متوقف' : 'يتم الفحص'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="glass-card section-card fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="section-card-header">
            <span className="section-title">🕒 آخر النشاطات</span>
          </div>
          <div className="activity-stream">
            <div className="activity-item">
              <div className="activity-dot dot-whatsapp" />
              <div className="activity-content">
                <p>إرسال رمز <strong>OTP</strong> بنجاح للرقم 0770xxxxxx</p>
                <small>منذ 5 دقائق</small>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot dot-pdf" />
              <div className="activity-content">
                <p>توليد فاتورة رقم <strong>#INV-2025-001</strong></p>
                <small>منذ 18 دقيقة</small>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot dot-gps" />
              <div className="activity-content">
                <p>مشاركة موقع جغرافي (Location) عبر GPS</p>
                <small>منذ ساعة</small>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot dot-whatsapp" />
              <div className="activity-content">
                <p>حجز موعد جديد لمزود الخدمة: <strong>أحمد</strong></p>
                <small>منذ ساعتين</small>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Quick Access */}
      <section className="quick-access-section fade-in-up" style={{ animationDelay: '0.6s' }}>
        <h3 style={{ marginBottom: 16, fontSize: 14, color: 'var(--text-secondary)' }}>اختصارات سريعة</h3>
        <div className="three-col">
          <div className="glass-card shortcut-card">
            <span className="shortcut-icon">🔑</span>
            <div className="shortcut-text">التحقق من OTP</div>
          </div>
          <div className="glass-card shortcut-card">
            <span className="shortcut-icon">🧾</span>
            <div className="shortcut-text">إنشاء فاتورة سريعة</div>
          </div>
          <div className="glass-card shortcut-card">
            <span className="shortcut-icon">🗺️</span>
            <div className="shortcut-text">مشاركة موقع الخريطة</div>
          </div>
        </div>
      </section>
    </div>
  )
}
