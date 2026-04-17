import React, { useState, useEffect, useContext } from 'react'
import { ToastContext } from '../App'

export default function AutomationTab() {
  const showToast = useContext(ToastContext)
  const [status, setStatus] = useState({ state: 'checking', details: {} })
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const API_KEY = 'my_super_secret_key_123'
  const BASE_URL = 'http://127.0.0.1:8000/api/v1/automation'

  useEffect(() => { checkStatus() }, [])

  const checkStatus = async () => {
    try {
      const res = await fetch(`${BASE_URL}/status`, {
        headers: { 'X-API-KEY': API_KEY }
      })
      const data = await res.json()
      setStatus({ state: data.status, details: data.details || {}, error: data.error })
    } catch (err) {
      setStatus({ state: 'offline', error: 'فشل الوصول للسيرفر' })
    }
  }

  const handleTestSend = async () => {
    if (!phone || !message) return showToast('أدخل الهاتف والرسالة للاختبار', 'error')
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/test-message?phone=${phone}&message=${encodeURIComponent(message)}`, {
        method: 'POST',
        headers: { 'X-API-KEY': API_KEY }
      })
      if (res.ok) {
        showToast('✅ تم إرسال رسالة الاختبار بنجاح')
      } else {
        showToast('❌ فشل الإرسال الآلي. تأكد من ربط الهاتف', 'error')
      }
    } catch (err) {
      showToast('خطأ في الاتصال بالسيرفر', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="automation-container fade-in-up">
      <header className="page-header">
        <div className="page-header-top">
          <div className="page-icon" style={{ background: '#FFD700' }}>⚡</div>
          <div>
            <h1>مركز الأتمتة والتحكم</h1>
            <p>مراقبة حالة الارتباط مع Evolution API وإدارة الإرسال الآلي</p>
          </div>
        </div>
      </header>

      <div className="two-col">
        {/* Status Monitoring */}
        <div className="glass-card section-card">
          <div className="section-card-header">
            <span className="section-title">📡 حالة الاتصال الحالية</span>
            <button className="btn btn-ghost btn-sm" onClick={checkStatus}>تحديث 🔄</button>
          </div>
          
          <div className="status-display" style={{ marginTop: '20px' }}>
            <div className={`status-indicator ${status.state}`} style={{ fontSize: '18px', padding: '15px' }}>
              <div className="status-dot" style={{ width: '12px', height: '12px' }} />
              <span>{status.state === 'online' ? 'متصل (Online)' : 'غير متصل (Offline)'}</span>
            </div>
            
            {status.state === 'online' ? (
              <div className="status-details" style={{ marginTop: '20px' }}>
                <p><strong>Instance:</strong> {status.details.instanceName || 'main_instance'}</p>
                <p><strong>Owner:</strong> {status.details.ownerJid || 'Connected'}</p>
                <p style={{ color: 'var(--accent-whatsapp)', fontSize: '12px', marginTop: '10px' }}>✅ السيرفر جاهز لاستقبال وتنفيذ مهام الأتمتة الخلفية.</p>
              </div>
            ) : (
              <div className="status-details" style={{ marginTop: '20px', color: '#ff6b6b' }}>
                <p><strong>الخطأ:</strong> {status.error || 'سيرفر Evolution API غير مستجيب'}</p>
                <p style={{ fontSize: '12px', marginTop: '10px' }}>⚠️ يرجى التأكد من تشغيل حاويات Docker ورابط هاتفك عبر QR Code.</p>
              </div>
            )}
          </div>
        </div>

        {/* Manual Test Dispatch */}
        <div className="glass-card section-card">
          <div className="section-card-header">
            <span className="section-title">🚀 اختبار الإرسال الآلي</span>
          </div>
          <div style={{ marginTop: '20px' }}>
            <div className="form-group">
                <label className="input-label">رقم الهاتف (للاختبار)</label>
                <input className="input-field" placeholder="213XXXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="form-group">
                <label className="input-label">نص الرسالة</label>
                <textarea className="input-field" rows={3} placeholder="اكتب رسالة تجريبية..." value={message} onChange={e => setMessage(e.target.value)} />
            </div>
            <button className="btn btn-whatsapp" onClick={handleTestSend} disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
              {loading ? 'جاري الإرسال...' : 'إرسال اختبار فوري'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .status-display { display: flex; flex-direction: column; }
        .status-indicator.online { background: rgba(37, 211, 102, 0.1); color: var(--accent-whatsapp); border: 1px solid rgba(37, 211, 102, 0.2); border-radius: 12px; }
        .status-indicator.offline { background: rgba(255, 107, 107, 0.1); color: #ff6b6b; border: 1px solid rgba(255, 107, 107, 0.2); border-radius: 12px; }
        .status-details p { margin: 5px 0; font-size: 14px; }
      `}</style>
    </div>
  )
}
