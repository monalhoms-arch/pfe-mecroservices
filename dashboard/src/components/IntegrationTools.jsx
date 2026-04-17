import React from 'react'

const TOOLS = [
  {
    title: 'نظام الفواتير الذكي (PDF)',
    desc: 'توليد فواتير احترافية لعمليات الاستئجار تلقائياً مع دعم العملات المتعددة.',
    icon: '📄',
    port: '8002',
    color: '#f97316'
  },
  {
    title: 'نظام التتبع الجغرافي (GPS)',
    desc: 'تحديد موقع العامل بدقة ومشاركة روابط الخرائط مع العملاء عبر الواتساب.',
    icon: '📍',
    port: '8001',
    color: '#8b5cf6'
  }
]

export default function IntegrationTools() {
  return (
    <div className="fade-in">
      <header className="view-header">
        <h2 className="view-title">الأدوات التقنية المكملة</h2>
        <p className="view-subtitle">تقنيات Microservices متطورة تدعم كفاءة نظام "خدمتي"</p>
      </header>

      <div className="metrics-grid">
        {TOOLS.map((tool) => (
          <div key={tool.port} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', borderTop: `4px solid ${tool.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '40px' }}>{tool.icon}</span>
              <span style={{ fontSize: '10px', fontWeight: '800', padding: '4px 8px', borderRadius: '4px', background: `${tool.color}20`, color: tool.color }}>PORT {tool.port}</span>
            </div>
            
            <div>
              <h3 className="section-title" style={{ marginBottom: '8px' }}>{tool.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: '1.6' }}>{tool.desc}</p>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
              <button style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', background: tool.color, color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer', fontFamily: 'var(--font-ar)' }}>
                فتح الأداة
              </button>
              <button style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', cursor: 'pointer' }}>
                ⚙️
              </button>
            </div>
          </div>
        ))}

        {/* System Health Summary */}
        <div className="glass-card" style={{ gridColumn: 'span 1', background: 'linear-gradient(135deg, #064e3b, #022c22)', border: 'none' }}>
          <h3 className="section-title" style={{ color: '#10b981', marginBottom: '16px' }}>حالة الربط التقني</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span>WhatsApp API (Main)</span>
              <span style={{ color: '#10b981' }}>متصل ●</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span>PDF Microservice</span>
              <span style={{ color: '#10b981' }}>متصل ●</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span>GPS Microservice</span>
              <span style={{ color: '#10b981' }}>متصل ●</span>
            </div>
          </div>
          <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)', fontSize: '11px', color: '#6ee7b7' }}>
            جميع الخدمات تعمل بكفاءة عالية وتدعم التبادل اللحظي للبيانات.
          </div>
        </div>
      </div>

      <section className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
        <h3 className="view-title" style={{ fontSize: '24px', marginBottom: '12px' }}>لماذا هذه الأدوات؟</h3>
        <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--text-dim)', lineHeight: '1.8' }}>
          تم تصميم نظام "خدمتي" ليكون متكاملاً. الإضافة النوعية لخدمات الـ PDF والـ GPS تضمن للعميل تجربة موثوقة؛ 
          حيث يتلقى فاتورة رسمية فورية، ويستطيع تتبع وصول العامل إليه في الوقت الفعلي، مما يرفع من القيمة الأكاديمية والعملية للمشروع.
        </p>
      </section>
    </div>
  )
}
