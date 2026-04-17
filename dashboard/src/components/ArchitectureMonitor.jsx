import React, { useState, useEffect } from 'react'

export default function ArchitectureMonitor() {
  const [statuses, setStatuses] = useState({
    8000: 'scanning',
    8001: 'scanning',
    8002: 'scanning'
  })

  const checkStatus = async (port) => {
    try {
      await fetch(`http://127.0.0.1:${port}/health`, { mode: 'no-cors' })
      return 'online'
    } catch {
      return 'offline'
    }
  }

  useEffect(() => {
    const updateAll = async () => {
      const s8000 = await checkStatus(8000)
      const s8001 = await checkStatus(8001)
      const s8002 = await checkStatus(8002)
      setStatuses({ 8000: s8000, 8001: s8001, 8002: s8002 })
    }
    updateAll()
    const interval = setInterval(updateAll, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="glass-pane" style={{ marginTop: '60px', padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h3 className="headline" style={{ fontSize: '24px', textAlign: 'right' }}>هيكلية الخدمات المصغرة (Advanced Microservices)</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>بنية تحتية موزعة تعتمد على استقلالية الخدمات</p>
        </div>
      </div>

      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', padding: '20px 0' }}>
        
        {/* Animated Lines Behind Nodes */}
        <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '2px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden', zIndex: 0 }}>
          <div className="flow-line"></div>
        </div>

        {/* WhatsApp Hub */}
        <div className="service-node" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ padding: '24px', borderRadius: '24px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid var(--primary)', boxShadw: '0 0 20px rgba(16, 185, 129, 0.1)' }}>
            <span style={{ fontSize: '32px' }}>💬</span>
            <h4 style={{ fontSize: '16px', marginTop: '12px' }}>WhatsApp Hub</h4>
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '8px' }}>
              {['FastAPI', 'Redis'].map(t => (
                <span key={t} style={{ fontSize: '9px', background: 'var(--primary)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>{t}</span>
              ))}
            </div>
          </div>
          <p style={{ fontSize: '12px', marginTop: '14px', color: statuses[8000] === 'online' ? 'var(--primary)' : 'var(--text-muted)' }}>
            {statuses[8000] === 'online' ? '● Active' : '○ Standby'}
          </p>
        </div>

        {/* GPS Satellite */}
        <div className="service-node" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ padding: '24px', borderRadius: '24px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid var(--secondary)', boxShadw: '0 0 20px rgba(59, 130, 246, 0.1)' }}>
            <span style={{ fontSize: '32px' }}>📍</span>
            <h4 style={{ fontSize: '16px', marginTop: '12px' }}>GPS Satellite</h4>
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '8px' }}>
              {['GeoTools', 'Maps'].map(t => (
                <span key={t} style={{ fontSize: '9px', background: 'var(--secondary)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>{t}</span>
              ))}
            </div>
          </div>
          <p style={{ fontSize: '12px', marginTop: '14px', color: statuses[8001] === 'online' ? 'var(--secondary)' : 'var(--text-muted)' }}>
            {statuses[8001] === 'online' ? '● Active' : '○ Standby'}
          </p>
        </div>

        {/* PDF Engine */}
        <div className="service-node" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ padding: '24px', borderRadius: '24px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid var(--accent)', boxShadw: '0 0 20px rgba(245, 158, 11, 0.1)' }}>
            <span style={{ fontSize: '32px' }}>📄</span>
            <h4 style={{ fontSize: '16px', marginTop: '12px' }}>Invoice Engine</h4>
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '8px' }}>
              {['ReportLab', 'FPDF'].map(t => (
                <span key={t} style={{ fontSize: '9px', background: 'var(--accent)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>{t}</span>
              ))}
            </div>
          </div>
          <p style={{ fontSize: '12px', marginTop: '14px', color: statuses[8002] === 'online' ? 'var(--accent)' : 'var(--text-muted)' }}>
            {statuses[8002] === 'online' ? '● Active' : '○ Standby'}
          </p>
        </div>

      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
          💡 يتميز هذا النظام بالقدرة على التوسع (Scalability) حيث يمكن إضافة خدمات جديدة دون التأثير على النظام القائم.
        </p>
      </div>
    </div>
  )
}
