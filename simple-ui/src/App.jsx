import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Hammer, MapPin, Send, FileText, CheckCircle, Smartphone, LayoutGrid, MessageCircle } from 'lucide-react'

const WHATSAPP_API = 'http://localhost:8000/api/v1'
const PDF_API = 'http://localhost:8002/api/v1'
const GPS_API = 'http://localhost:8001/api/v1'

export default function App() {
  const [portal, setPortal] = useState('customer') // 'customer', 'worker'
  
  // App State Data
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch Providers on Load
  useEffect(() => {
    const loadProviders = async () => {
      try {
        const res = await axios.get(`${WHATSAPP_API}/marketplace/providers`)
        setProviders(res.data)
      } catch (err) {
        console.error("Make sure WhatsApp Service is running")
      }
    }
    loadProviders()
  }, [])

  return (
    <div className="app-container">
      <header className="header" style={{ marginBottom: '2rem' }}>
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          منصة خدمتي
        </motion.h1>
        <p style={{ color: 'var(--text-muted)' }}>أدوات الخدمات الموحدة</p>
      </header>

      <div className="portal-selector mb-4">
        <button 
          className={`portal-btn ${portal === 'customer' ? 'active' : ''}`}
          onClick={() => setPortal('customer')}
        >
          <User size={18} style={{ marginBottom: 4 }} />
          <div>بوابة الزبون</div>
        </button>
        <button 
          className={`portal-btn ${portal === 'worker' ? 'active' : ''}`}
          onClick={() => setPortal('worker')}
        >
          <Hammer size={18} style={{ marginBottom: 4 }} />
          <div>بوابة العامل</div>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {portal === 'customer' ? (
          <CustomerPortal key="customer" providers={providers} />
        ) : (
          <WorkerPortal key="worker" providers={providers} />
        )}
      </AnimatePresence>
    </div>
  )
}

function CustomerPortal({ providers }) {
  const [formData, setFormData] = useState({
    customer_name: '', provider_id: '', appointment_datetime: '', useLocation: false
  })
  const [locData, setLocData] = useState(null)
  
  const handleBooking = async (e) => {
    e.preventDefault()
    
    let lat = null, lng = null
    if (formData.useLocation && locData) {
      lat = locData.lat; lng = locData.lng
    } else if (formData.useLocation && !locData) {
      return alert("يرجى الانتظار حتى يتم تحديد الموقع!")
    }

    try {
      const payload = {
        customer_name: formData.customer_name,
        provider_id: parseInt(formData.provider_id),
        appointment_datetime: formData.appointment_datetime,
        auto_send: true,
        latitude: lat,
        longitude: lng
      }
      const res = await axios.post(`${WHATSAPP_API}/marketplace/send-to-provider`, payload)
      if(res.data.status === 'sent') {
         alert('تم الطلب وإرسال رسالة واتساب بنجاح للعامل!')
      } else {
         window.open(res.data.redirect, '_blank')
      }
    } catch (err) {
      alert("خطأ في الاتصال بالخدمة")
    }
  }

  const handleLocationToggle = (e) => {
    const checked = e.target.checked
    setFormData({...formData, useLocation: checked})
    if (checked && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setLocData({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      }, () => alert("لم نتمكن من تحديد الموقع"))
    }
  }

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
      {/* WhatsApp Booking Tool */}
      <section className="glass-card mb-4">
        <h3 className="section-title"><MessageCircle size={18} color="#25D366" /> طلب خدمة من عامل (عبر واتساب)</h3>
        <form onSubmit={handleBooking}>
          <div className="input-group">
            <label>اختر العامل المناسب</label>
            <select 
               required
               value={formData.provider_id} 
               onChange={e => setFormData({...formData, provider_id: e.target.value})}
               style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', color: '#fff', border: '1px solid var(--border)' }}>
              <option value="">-- اختر من القائمة --</option>
              {providers.map(p => (
                <option key={p.id} value={p.id}>{p.full_name} ({p.job})</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>اسمك الكامل</label>
            <input required type="text" placeholder="مثال: يوسف محمود" value={formData.customer_name} onChange={e => setFormData({...formData, customer_name: e.target.value})} />
          </div>
          <div className="input-group">
            <label>وقت الموعد المقترح</label>
            <input required type="datetime-local" value={formData.appointment_datetime} onChange={e => setFormData({...formData, appointment_datetime: e.target.value})} />
          </div>
          
          <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" style={{ width: 'auto' }} checked={formData.useLocation} onChange={handleLocationToggle} id="gps-check" />
            <label htmlFor="gps-check" style={{ marginBottom: 0 }}>مشاركة موقعي الجغرافي (تفعيل خدمة GPS 📍)</label>
          </div>

          <button type="submit" className="premium-btn" style={{ width: '100%', background: '#25D366' }}>تأكيد وإرسال الطلب عبر الواتساب <Send size={16} /></button>
        </form>
      </section>
    </motion.div>
  )
}

function WorkerPortal({ providers }) {
  const [invoiceData, setInvoiceData] = useState({ provider_id: '', customer_name: '', price: '' })
  const [notificationData, setNotificationData] = useState({ phone: '', message: '' })

  const handleCreatePdf = async (e) => {
    e.preventDefault()
    try {
       const payload = {
        invoice_title: "فاتورة أتعاب رسمية",
        provider_id: parseInt(invoiceData.provider_id),
        provider_name: providers.find(p => p.id == invoiceData.provider_id)?.full_name || 'العامل',
        customer_name: invoiceData.customer_name,
        currency: "DZD",
        items: [{ description: 'خدمة مهنية عامة', price: parseFloat(invoiceData.price), quantity: 1 }]
      }
      const res = await axios.post(`${PDF_API}/generate-pdf`, payload)
      if (res.data.status === 'success') {
        alert('تم توليد الفاتورة بنجاح عبر خدمة الـ PDF!')
        window.open(res.data.download_url, '_blank')
      }
    } catch (err) {
      alert("خطأ أثناء إصدار الفاتورة")
    }
  }

  const handleSendNotification = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${WHATSAPP_API}/notifications/direct`, {
        phone_number: notificationData.phone,
        message: notificationData.message,
        is_business: false
      })
      alert("تم معالجة التنبيه بنجاح، سيقوم السيرفر بإرساله في الخلفية.")
      setNotificationData({ phone: '', message: '' })
    } catch (err) {
      alert("خطأ أثناء إرسال التنبيه")
    }
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      {/* PDF Tool */}
      <section className="glass-card mb-4" style={{ borderLeft: '4px solid #FF3D00' }}>
        <h3 className="section-title"><FileText size={18} color="#FF3D00" /> إدارة الفواتير (خدمة PDF)</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>إنشاء فاتورة رسمية تدعم QR Language وتوثيقها في قاعدة البيانات</p>
        <form onSubmit={handleCreatePdf}>
           <div className="input-group">
            <select required value={invoiceData.provider_id} onChange={e => setInvoiceData({...invoiceData, provider_id: e.target.value})}
               style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', color: '#fff', border: '1px solid var(--border)' }}>
              <option value="">-- رقم تعريفك (من أنت؟) --</option>
              {providers.map(p => (
                <option key={p.id} value={p.id}>{p.full_name}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <input required type="text" placeholder="اسم الزبون (للفاتورة)" value={invoiceData.customer_name} onChange={e => setInvoiceData({...invoiceData, customer_name: e.target.value})} />
          </div>
          <div className="input-group">
            <input required type="number" placeholder="المبلغ (د.ج)" value={invoiceData.price} onChange={e => setInvoiceData({...invoiceData, price: e.target.value})} />
          </div>
          <button type="submit" className="premium-btn" style={{ width: '100%', background: '#FF3D00', color: '#fff' }}>توليد الفاتورة بالـ QR <FileText size={16}/></button>
        </form>
      </section>

      {/* WhatsApp Tool */}
      <section className="glass-card" style={{ borderLeft: '4px solid #25D366' }}>
        <h3 className="section-title"><Smartphone size={18} color="#25D366" /> التنبيهات المباشرة (خدمة الواتساب)</h3>
         <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>إرسال رسائل أو تنبيهات للزبائن مباشرة من السيرفر</p>
        <form onSubmit={handleSendNotification}>
          <div className="input-group">
            <input required type="text" placeholder="رقم هاتف الزبون (مثال: 213555...)" value={notificationData.phone} onChange={e => setNotificationData({...notificationData, phone: e.target.value})} />
          </div>
          <div className="input-group">
            <input required type="text" placeholder="الرسالة (مثال: سأتأخر 10 دقائق)" value={notificationData.message} onChange={e => setNotificationData({...notificationData, message: e.target.value})} />
          </div>
           <button type="submit" className="premium-btn" style={{ width: '100%', background: '#25D366' }}>إرسال التنبيه <Send size={16}/></button>
        </form>
      </section>
    </motion.div>
  )
}
