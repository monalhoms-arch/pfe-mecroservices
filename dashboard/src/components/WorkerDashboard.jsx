import React from 'react'

export default function WorkerDashboard() {
  return (
    <div className="fade-in">
      <header className="view-header">
        <h2 className="view-title">نظرة عامة على النظام</h2>
        <p className="view-subtitle">إدارة عمال الصيانة والخدمات المنزلية عبر الواتساب</p>
      </header>

      {/* Metrics */}
      <div className="metrics-grid">
        <div className="glass-card metric-card">
          <p className="metric-label">إجمالي العمال المسجلين</p>
          <div className="metric-value">142</div>
          <div className="metric-trend trend-up">↑ 8 عمال جدد هذا الشهر</div>
        </div>
        <div className="glass-card metric-card">
          <p className="metric-label">طلبات الاستئجار النشطة</p>
          <div className="metric-value">24</div>
          <div className="metric-trend" style={{ color: 'var(--secondary)' }}>12 قيد المتابعة</div>
        </div>
        <div className="glass-card metric-card">
          <p className="metric-label">رسائل الواتساب (اليوم)</p>
          <div className="metric-value">312</div>
          <div className="metric-trend trend-up">↑ 15% زيادة في التفاعل</div>
        </div>
        <div className="glass-card metric-card">
          <p className="metric-label">نسبة رضا العملاء</p>
          <div className="metric-value">98%</div>
          <div className="metric-trend trend-up">★ تقييم ممتاز</div>
        </div>
      </div>

      <div className="content-layout">
        <main>
          <section className="glass-card" style={{ marginBottom: '24px' }}>
            <div className="section-head">
              <h3 className="section-title">آخر عمليات الاستئجار</h3>
              <button style={{ background: 'none', border: 'none', color: var(--primary), cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}>عرض الكل ←</button>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>العامل</th>
                  <th style={{ padding: '12px' }}>المهنة</th>
                  <th style={{ padding: '12px' }}>المستأجر</th>
                  <th style={{ padding: '12px' }}>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'محمد أمين', job: 'سباك', client: 'علي ورشفاني', status: 'نشط', color: 'var(--primary)' },
                  { name: 'ياسين كداد', job: 'كهربائي', client: 'مراد بوعزة', status: 'مكتمل', color: 'var(--secondary)' },
                  { name: 'حمزة بن عيسى', job: 'نجار', client: 'عبد الرؤوف', status: 'قيد الحجز', color: 'var(--accent)' },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', fontSize: '14px' }}>
                    <td style={{ padding: '16px' }}>{row.name}</td>
                    <td style={{ padding: '16px', color: 'var(--text-dim)' }}>{row.job}</td>
                    <td style={{ padding: '16px' }}>{row.client}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        fontSize: '11px', 
                        background: `${row.color}15`, 
                        color: row.color,
                        border: `1px solid ${row.color}30`
                      }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="glass-card">
            <h3 className="section-title" style={{ marginBottom: '20px' }}>مؤشر التوفر المباشر</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['سباكة', 'كهرباء', 'نجارة', 'تكييف', 'تنظيف'].map((cat) => (
                <div key={cat} style={{ flex: 1, padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>{cat}</p>
                  <p style={{ fontSize: '18px', fontWeight: '800' }}>{Math.floor(Math.random() * 10) + 2}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside>
          <div className="glass-card" style={{ marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', background: 'var(--primary)', filter: 'blur(60px)', opacity: 0.1 }} />
            <h3 className="section-title" style={{ marginBottom: '16px' }}>نشاط الواتساب</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { time: '10:42', text: 'تم استلام طلب جديد لخدمة سباكة' },
                { time: '10:15', text: 'إرسال موقع العامل لمصطفى بن مراد' },
                { time: '09:50', text: 'توليد فاتورة PDF لعملية مكتملة' },
              ].map((activity, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', height: 'fit-content' }}>💬</div>
                  <div>
                    <p style={{ fontSize: '13px', lineHeight: '1.4' }}>{activity.text}</p>
                    <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ background: 'linear-gradient(135deg, var(--bg-slate), #1e293b)' }}>
            <h3 className="section-title" style={{ marginBottom: '8px' }}>تنبيهات النظام</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '16px' }}>هناك 3 عمال تنتهي عقودهم اليوم.</p>
            <button style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: 'var(--radius-sm)', 
              background: 'var(--primary)', 
              color: 'white', 
              border: 'none', 
              fontWeight: '700',
              fontFamily: 'var(--font-ar)'
            }}>مراجعة العقود</button>
          </div>
        </aside>
      </div>
    </div>
  )
}
