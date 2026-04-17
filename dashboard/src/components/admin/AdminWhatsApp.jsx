import React, { useState, useEffect } from 'react'

const BASE = 'http://localhost:8000'
const DEFAULT_KEY = 'my_super_secret_key_123'

export default function AdminWhatsApp({ showToast }) {
  const [apiKey, setApiKey] = useState(DEFAULT_KEY)
  const [phone, setPhone] = useState('')
  const [accountType, setAccountType] = useState('customer')
  const [name, setName] = useState('')
  const [isBusiness, setIsBusiness] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpTimer, setOtpTimer] = useState(0)
  const [message, setMessage] = useState('')
  const [directMode, setDirectMode] = useState(false)
  const [loading, setLoading] = useState(false)

  const apiFetch = async (endpoint, options = {}) => {
    const url = `${BASE}/api/v1${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
      ...options.headers
    }
    
    try {
      const res = await fetch(url, { ...options, headers })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'خطأ في الربط مع السيرفر')
      return data
    } catch (err) {
      showToast(err.message)
      throw err
    }
  }

  const registerAccount = async () => {
    if (!phone) return showToast('يرجى تحديد رقم الهاتف')
    try {
      await apiFetch('/accounts/', {
        method: 'POST',
        body: JSON.stringify({ phone_number: phone, account_type: accountType, name, is_business_whatsapp: isBusiness })
      })
      showToast('✅ تم تسجيل الحساب في النظام')
    } catch {}
  }

  const sendOtp = async () => {
    if (!phone) return showToast('أدخل رقم الهاتف أولاً')
    setLoading(true)
    try {
      await apiFetch('/otp/send', {
        method: 'POST',
        body: JSON.stringify({ phone_number: phone, account_type: accountType })
      })
      showToast('🚀 تم إرسال رمز OTP عبر واتساب')
      setOtpTimer(60)
    } catch {} finally { setLoading(false) }
  }

  const verifyOtp = async () => {
    if (!phone || !otpCode) return showToast('أدخل الهاتف والرمز للمتابعة')
    try {
      const data = await apiFetch('/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ phone_number: phone, code: otpCode })
      })
      if (data.status === 'success') showToast('✅ تم التحقق من الرمز بنجاح')
    } catch {}
  }

  const sendNotification = async () => {
    if (!phone || !message) return showToast('أدخل البيانات المطلوبة للإرسال')
    setLoading(true)
    try {
      const endpoint = directMode ? '/notifications/direct' : '/notifications/send'
      const body = directMode 
        ? { phone_number: phone, message, is_business: isBusiness }
        : { phone_number: phone, message, account_type: accountType }

      await apiFetch(endpoint, { method: 'POST', body: JSON.stringify(body) })
      showToast('📨 تمت عملية الإرسال بنجاح')
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => {
    let interval
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(t => t - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [otpTimer])

  return (
    <div className="fade-in-up">
      <header className="view-header" style={{ marginBottom: '40px' }}>
        <h2 className="headline" style={{ fontSize: '28px', textAlign: 'right' }}>إدارة بوابة واتساب (Admin)</h2>
        <p style={{ color: 'var(--text-secondary)' }}>التحكم الكامل في نظام التوثيق والإشعارات</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* API Config */}
        <div className="glass-pane" style={{ gridColumn: 'span 2' }}>
           <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>🛡️ مفتاح الأمان (API Authentication)</h3>
           <input 
              className="input-field" 
              type="password" 
              value={apiKey} 
              onChange={e => setApiKey(e.target.value)}
              placeholder="X-API-KEY"
            />
        </div>

        {/* User Stats */}
        <div className="glass-pane">
          <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>👤 تسجيل بيانات المستخدم</h3>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="label">رقم الهاتف المختبر</label>
            <input className="input-field" placeholder="213XXXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="label">الصلاحيات</label>
            <select className="input-field" value={accountType} onChange={e => setAccountType(e.target.value)}>
              <option value="customer">زبون</option>
              <option value="provider">مزود خدمة</option>
              <option value="admin">مدير نظام</option>
            </select>
          </div>
          <button className="btn-premium btn-outline" onClick={registerAccount} style={{ width: '100%' }}>
            تحديث قاعدة البيانات 🔄
          </button>
        </div>

        {/* OTP System */}
        <div className="glass-pane">
          <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>🔐 اختبار نظام التحقق (OTP)</h3>
          <button 
            className="btn-premium btn-primary" 
            onClick={sendOtp} 
            disabled={loading || otpTimer > 0}
            style={{ marginBottom: '20px' }}
          >
            {otpTimer > 0 ? `أعد المحاولة بعد ${otpTimer}` : 'إرسال رمز التحقق 💬'}
          </button>
          
          <div className="form-group">
            <label className="label">إدخال الرمز الوارد</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input className="input-field" maxLength={6} value={otpCode} onChange={e => setOtpCode(e.target.value)} style={{ textAlign: 'center', letterSpacing: '4px' }} />
              <button className="btn-premium btn-primary" onClick={verifyOtp} style={{ width: '100px' }}>OK</button>
            </div>
          </div>
        </div>

        {/* Messaging */}
        <div className="glass-pane" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px' }}>🚀 محرك الإشعارات والمراسلة</h3>
            <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={directMode} onChange={e => setDirectMode(e.target.checked)} />
              وضع الإرسال المباشر (Bypass)
            </label>
          </div>
          <textarea 
            className="input-field" 
            rows={3} 
            placeholder="اكتب نص الرسالة هنا..." 
            value={message}
            onChange={e => setMessage(e.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <button className="btn-premium btn-primary" onClick={sendNotification} disabled={loading} style={{ width: '100%' }}>
            {loading ? 'جاري الإرسال...' : 'بدء عملية البث الفوري'}
          </button>
        </div>
      </div>
    </div>
  )
}
