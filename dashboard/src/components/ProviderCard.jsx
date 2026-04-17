import React, { useState } from 'react'

export default function ProviderCard({ 
  provider, 
  customerName, 
  apptDate, 
  location, 
  showToast 
}) {
  const [status, setStatus] = useState('')

  const handleWhatsApp = async () => {
    if (!customerName.trim()) {
      showToast('يرجى كتابة اسمك أولاً')
      return
    }

    setStatus('⏳ جاري المعالجة...')
    
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
        showToast('حدث خطأ غير متوقع')
        setStatus('')
      }
    } catch (error) {
      showToast('❌ تأكد من تشغيل السيرفر (Port 8000)')
      setStatus('')
    }
  }

  const handleInvoice = async () => {
    if (!customerName.trim()) {
      showToast('يرجى كتابة اسمك أولاً')
      return
    }

    const price = prompt('أدخل سعر الخدمة بالدينار الجزائري:')
    if (!price || isNaN(parseFloat(price))) {
      showToast('سعر غير صحيح')
      return
    }

    setStatus('⏳ جاري إنشاء الفاتورة...')

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
        setStatus(`✅ الفاتورة جاهزة: ${data.invoice_id}`)
        showToast('تم إنشاء الفاتورة بنجاح!')
        window.open(data.invoice_url, '_blank')
        
        // Optional re-redirect for whatsapp
        setTimeout(() => {
          if (window.confirm('هل تريد إرسال رابط الفاتورة للمزود عبر واتساب؟')) {
            window.location.href = data.whatsapp_redirect
          }
        }, 800)
      } else {
        showToast('فشل إنشاء الفاتورة')
        setStatus('')
      }
    } catch {
      showToast('❌ تعذر الاتصال بالسيرفر')
      setStatus('')
    }
  }

  return (
    <div className="premium-card worker-card">
      <div className="worker-avatar">{provider.avatar}</div>
      <h4 className="worker-name">{provider.name}</h4>
      <p className="worker-job">{provider.job}</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleWhatsApp}>
          تواصل عبر واتساب 💬
        </button>
        <button className="btn btn-ghost" style={{ width: '100%' }} onClick={handleInvoice}>
          🧾 إنشاء فاتورة PDF
        </button>
      </div>
      
      {status && (
        <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          {status}
        </div>
      )}
    </div>
  )
}
