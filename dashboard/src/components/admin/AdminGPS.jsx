import React, { useState } from 'react'

const BASE = 'http://localhost:8001'

export default function AdminGPS({ showToast }) {
  const [lat, setLat] = useState('36.7525')
  const [lng, setLng] = useState('3.0420')
  const [loading, setLoading] = useState(false)
  const [mapUrl, setMapUrl] = useState('')

  const getMap = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BASE}/map-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: parseFloat(lat), longitude: parseFloat(lng) })
      })
      const data = await res.json()
      if (data.google_maps_url) {
        setMapUrl(data.google_maps_url)
        showToast('📍 تم تحليل الإحداثيات وإنشاء رابط الخرائط')
      }
    } catch {
      showToast('⚠️ خطأ: سيرفر المواقع (Port 8001) غير متصل')
    } finally { setLoading(false) }
  }

  return (
    <div className="fade-in-up">
      <header className="view-header">
        <h2 className="headline" style={{ fontSize: '28px', textAlign: 'right' }}>نظام التوقيع الجغرافي (GPS Admin)</h2>
        <p style={{ color: 'var(--text-secondary)' }}>محاكاة الرصد المكاني واختبار الربط مع Google Maps</p>
      </header>

      <div className="glass-pane">
        <h3 style={{ fontSize: '16px', marginBottom: '24px' }}>📡 إحداثيات الاختبار (Manual Coordinates)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <div className="form-group">
            <label className="label">Latitude (خط العرض)</label>
            <input className="input-field" type="number" step="0.0001" value={lat} onChange={e => setLat(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">Longitude (خط الطول)</label>
            <input className="input-field" type="number" step="0.0001" value={lng} onChange={e => setLng(e.target.value)} />
          </div>
        </div>

        <button className="btn-premium btn-primary" onClick={getMap} disabled={loading} style={{ marginTop: '30px', width: '100%' }}>
          {loading ? 'جاري التحليل...' : '📍 إنشاء رابط الخريطة التجريبي'}
        </button>
      </div>

      {mapUrl && (
        <div className="glass-pane" style={{ marginTop: '30px', textAlign: 'center' }}>
          <h4 style={{ fontSize: '15px', marginBottom: '16px' }}>✅ رابط الخريطة جاهز للإرسال</h4>
          <div style={{ padding: '15px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '10px', wordBreak: 'break-all', fontSize: '12px', color: 'var(--secondary)', marginBottom: '20px' }}>
            {mapUrl}
          </div>
          <button className="btn-premium btn-outline" style={{ maxWidth: '200px', margin: '0 auto' }} onClick={() => window.open(mapUrl, '_blank')}>
            فتح في خرائط جوجل 🗺️
          </button>
        </div>
      )}
    </div>
  )
}
