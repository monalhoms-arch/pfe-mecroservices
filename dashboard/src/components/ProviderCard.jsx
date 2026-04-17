import React, { useState } from 'react'

export default function ProviderCard({ 
  provider, 
  customerName, 
  apptDate, 
  location, 
  showToast 
}) {
  const [loading, setLoading] = useState(false)
  const [statusText, setStatusText] = useState('')

  const handleWhatsApp = async () => {
    if (!customerName.trim()) {
      showToast('يرجى كتابة اسمك أولاً لضمان وصول الطلب بشكل صحيح')
      return
    }

    setLoading(true)
    setStatusText('⏳ جاري تأمين الاتصال...')
    
    const body = {
      provider_id: provider.id,
      customer_name: customerName,
      appointment_datetime: apptDate || null,
      latitude: location.lat,
      longitude: location.lng
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/send-to-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      
      if (data.status === 'processing') {
        window.location.href = data.redirect
      } else {
        showToast('فشل في معالجة طلب الواتساب')
        setLoading(false)
        setStatusText('')
      }
    } catch (error) {
      showToast('⚠️ خطأ: تأكد من تشغيل خادم WhatsApp Hub (Port 8000)')
      setLoading(false)
      setStatusText('')
    }
  }

  const handleInvoice = async () => {
    if (!customerName.trim()) {
      showToast('يرجى كتابة اسمك أولاً لإنشاء الفاتورة')
      return
    }

    const price = prompt('أدخل سعر الخدمة المتفق عليه (بالدينار الجزائري):')
    if (!price || isNaN(parseFloat(price))) {
      showToast('يرجى إدخال مبلغ صحيح')
      return
    }

    setLoading(true)
    setStatusText('📄 جاري توليد فاتورة PDF...')

    const body = {
      provider_id: provider.id,
      customer_name: customerName,
      service_price: parseFloat(price),
      appointment_datetime: apptDate || null
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()

      if (data.status === 'success') {
        showToast('✅ تم إصدار الفاتورة بنجاح')
        setStatusText(`الفاتورة: ${data.invoice_id}`)
        setLoading(false)
        
        window.open(data.invoice_url, '_blank')
        
        setTimeout(() => {
          if (window.confirm('تم تجهيز الفاتورة. هل ترغب في إرسال الرابط للمزود؟')) {
            window.location.href = data.whatsapp_redirect
          }
        }, 500)
      } else {
        showToast('فشل في توليد ملف الفاتورة')
        setLoading(false)
        setStatusText('')
      }
    } catch {
      showToast('⚠️ خطأ: تأكد من تشغيل خادم PDF Engine (Port 8002)')
      setLoading(false)
      setStatusText('')
    }
  }

  return (
    <div className="glass-pane worker-card fade-in-up">
      <div className="avatar-circle">
        {provider.avatar}
      </div>
      
      <div className="worker-details">
        <h3>{provider.name}</h3>
        <span className="tag">
          {provider.id === 1 ? '⚡ ' : provider.id === 2 ? '💧 ' : '🛠️ '}
          {provider.job}
        </span>
      </div>

      <div style={{ padding: '0 8px' }}>
        <button 
          className="btn-premium btn-primary" 
          disabled={loading}
          onClick={handleWhatsApp}
        >
          {loading ? 'جاري التحويل...' : 'توصيل عبر واتساب 💬'}
        </button>
        
        <button 
          className="btn-premium btn-outline" 
          disabled={loading}
          onClick={handleInvoice}
        >
          🧾 تفويض فاتورة PDF
        </button>
      </div>

      {statusText && (
        <div style={{ 
          marginTop: '20px', 
          fontSize: '11px', 
          color: 'var(--primary)',
          background: 'rgba(16, 185, 129, 0.05)',
          padding: '8px',
          borderRadius: '8px'
        }}>
          {statusText}
        </div>
      )}
      
      <div style={{ marginTop: '16px', fontSize: '10px', color: 'var(--text-muted)' }}>
        ● متاح حالياً للحجز الفوري
      </div>
    </div>
  )
}
