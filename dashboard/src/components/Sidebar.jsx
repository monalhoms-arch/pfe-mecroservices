import React from 'react'

const MENU_ITEMS = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: '📊' },
  { id: 'workers',   label: 'إدارة العمال', icon: '👷' },
  { id: 'rentals',   label: 'طلبات الاستئجار', icon: '📝' },
  { id: 'clients',   label: 'قاعدة العملاء', icon: '👥' },
  { id: 'tools',     label: 'أدوات مكملة', icon: '🛠️' },
  { id: 'settings',  label: 'الإعدادات', icon: '⚙️' },
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
