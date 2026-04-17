import React, { useState, useEffect } from 'react'

export default function ArchitectureMonitor() {
  const [statuses, setStatuses] = useState({
    8000: 'scanning',
    8001: 'scanning',
    8002: 'scanning'
  })

  const checkStatus = async (port) => {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/health`, { mode: 'no-cors' })
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
          <h3 className="headline" style={{ fontSize: '24px', textAlign: 'right' }}>هيكلية الخدمات المصغرة (Microservices)</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>نظام موزع يضمن الكفاءة العالية وفصل المهام</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {[8000, 8001, 8002].map(port => (
            <div key={port} className="status-chip">
              <div className={`pulse ${statuses[port] === 'online' ? 'pulse-green' : ''}`} 
                   style={{ background: statuses[port] === 'online' ? 'var(--primary)' : '#ef4444' }} />
              <span>Port {port}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="architecture-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', position: 'relative' }}>
        {/* Core - WhatsApp */}
        <div style={{ textAlign: 'center', z-index: 2 }}>
          <div style={{ padding: '20px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--primary)' }}>
            <span style={{ fontSize: '32px' }}>💬</span>
            <h4 style={{ fontSize: '16px', marginTop: '10px' }}>WhatsApp Hub</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Port 8000</p>
          </div>
          <p style={{ fontSize: '12px', marginTop: '12px', color: 'var(--text-secondary)' }}>تنسيق الحجوزات والرسائل</p>
        </div>

        {/* Satellite 1 - GPS */}
        <div style={{ textAlign: 'center', z-index: 2 }}>
          <div style={{ padding: '20px', borderRadius: '20px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--secondary)' }}>
            <span style={{ fontSize: '32px' }}>📍</span>
            <h4 style={{ fontSize: '16px', marginTop: '10px' }}>GPS Analytics</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Port 8001</p>
          </div>
          <p style={{ fontSize: '12px', marginTop: '12px', color: 'var(--text-secondary)' }}>تتبع المواقع الجغرافية</p>
        </div>

        {/* Satellite 2 - PDF */}
        <div style={{ textAlign: 'center', z-index: 2 }}>
          <div style={{ padding: '20px', borderRadius: '20px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--accent)' }}>
            <span style={{ fontSize: '32px' }}>📄</span>
            <h4 style={{ fontSize: '16px', marginTop: '10px' }}>Invoice Engine</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Port 8002</p>
          </div>
          <p style={{ fontSize: '12px', marginTop: '12px', color: 'var(--text-secondary)' }}>توليد الفواتير التلقائية</p>
        </div>

        {/* Connecting Lines (Simulated with CSS) */}
        <div style={{ position: 'absolute', top: '50%', left: '15%', right: '15%', height: '1px', background: 'linear-gradient(to right, transparent, var(--glass-border), transparent)', zIndex: 1 }}></div>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          ✅ جميع الخدمات تتواصل عبر بروتوكول HTTP RESTful وتعتمد على قواعد بيانات مستقلة لضمان استقرار المنصة.
        </p>
      </div>
    </div>
  )
}
