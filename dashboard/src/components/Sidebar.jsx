import React from 'react'

const MENU_ITEMS = [
  { id: 'dashboard', label: 'سوق العمل', icon: '🏪' },
  { id: 'reminders',  label: 'التذكيرات', icon: '🔔' },
  { id: 'divider',   type: 'divider' },
  { id: 'admin-wa',  label: 'بوابة الواتساب', icon: '🔐' },
  { id: 'admin-pdf', label: 'محرك الفواتير', icon: '📄' },
  { id: 'admin-gps', label: 'نظام المواقع', icon: '📍' },
]

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="premium-sidebar">
      <div className="brand-section">
        <div className="brand-logo" />
        <h1 className="brand-name">منصة خدمتي</h1>
      </div>

      <nav className="nav-group">
        {MENU_ITEMS.map((item) => (
          item.type === 'divider' ? (
            <div key={item.id} style={{ height: '1px', background: 'var(--glass-border)', margin: '16px 8px' }} />
          ) : (
            <a
              key={item.id}
              href="#"
              className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                setActiveTab(item.id)
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          )
        ))}
      </nav>

      <div style={{ marginTop: 'auto', padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
          مشروع التخرج — 2026<br/>
          Software Engineering
        </p>
      </div>
    </aside>
  )
}
