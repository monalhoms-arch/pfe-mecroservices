import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Hammer, Search, Calendar, CheckCircle, Clock, MapPin } from 'lucide-react'

const API_BASE = 'http://localhost:8000/api/v1/marketplace'

export default function App() {
  const [portal, setPortal] = useState('customer') // 'customer' or 'worker'
  const [query, setQuery] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchData = async () => {
    if (!query) return
    setLoading(true)
    setError('')
    try {
      const params = portal === 'customer' 
        ? { customer_name: query } 
        : { provider_id: query }
      
      const res = await axios.get(`${API_BASE}/appointments`, { params })
      setData(res.data)
      if (res.data.length === 0) setError('لا توجد طلبات خدمات حالياً')
    } catch (err) {
      setError('حدث خطأ في جلب البيانات. تأكد من تشغيل السيرفر.')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`${API_BASE}/appointments/${id}`, { status: newStatus })
      fetchData() // Refresh
    } catch (err) {
      alert('فشل تحديث الحالة')
    }
  }

  return (
    <div className="app-container">
      <header className="header">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          منصة خدمتي
        </motion.h1>
        <p style={{ color: 'var(--text-muted)' }}>بوابة طلبات الخدمات الموحدة</p>
      </header>

      <div className="portal-selector">
        <button 
          className={`portal-btn ${portal === 'customer' ? 'active' : ''}`}
          onClick={() => { setPortal('customer'); setData([]); setQuery(''); }}
        >
          <User size={18} style={{ marginBottom: 4 }} />
          <div>بوابة الزبون</div>
        </button>
        <button 
          className={`portal-btn ${portal === 'worker' ? 'active' : ''}`}
          onClick={() => { setPortal('worker'); setData([]); setQuery(''); }}
        >
          <Hammer size={18} style={{ marginBottom: 4 }} />
          <div>بوابة العامل</div>
        </button>
      </div>

      <main className="glass-card">
        <div className="input-group">
          <label>
            {portal === 'customer' ? 'أدخل اسمك بالكامل للبحث عن خدماتك المطلوبة' : 'أدخل رقم التعريف الخاص بك (ID)'}
          </label>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="مثلاً: محمد علي" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchData()}
            />
            <button 
              className="premium-btn" 
              style={{ position: 'absolute', left: 5, top: 5, bottom: 5, padding: '0 1rem' }}
              onClick={fetchData}
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '2rem' }}>يتم جلب البيانات... ⏳</div>}
        {error && <div style={{ color: '#ff4d4d', textAlign: 'center', padding: '1rem' }}>{error}</div>}

        <div className="missions-list">
          <AnimatePresence mode="popLayout">
            {data.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mission-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ marginBottom: 8 }}>{portal === 'customer' ? `خدمة مع: ${item.provider_name}` : `طلب من: ${item.customer_name}`}</h3>
                    <div style={{ display: 'flex', gap: 15, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={14} /> {new Date(item.appointment_datetime).toLocaleDateString('ar-DZ')}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={14} /> {new Date(item.appointment_datetime).toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <span className={`status-badge status-${item.status}`}>
                    {item.status === 'pending' ? 'قيد الانتظار' : item.status === 'confirmed' ? 'مؤكد' : 'مكتمل'}
                  </span>
                </div>

                {portal === 'worker' && item.status !== 'completed' && (
                  <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
                    {item.status === 'pending' && (
                      <button className="premium-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => updateStatus(item.id, 'confirmed')}>
                        تأكيد الموعد <CheckCircle size={14} />
                      </button>
                    )}
                    <button className="premium-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: '#2196f3' }} onClick={() => updateStatus(item.id, 'completed')}>
                      إكمال طلب الخدمة
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
