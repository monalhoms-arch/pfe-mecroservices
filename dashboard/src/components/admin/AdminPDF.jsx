import React, { useState } from 'react'

const BASE = 'http://localhost:8002'

export default function AdminPDF({ showToast }) {
  const [providerId, setProviderId] = useState('1')
  const [custName, setCustName] = useState('')
  const [price, setPrice] = useState('0')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastInvoice, setLastInvoice] = useState(null)

  const generateInvoice = async () => {
    if (!custName) return showToast('يرجى إدخال اسم العميل')
    setLoading(true)
    try {
      const res = await fetch(`${BASE}/generate-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_id: parseInt(providerId),
          customer_name: custName,
          service_price: parseFloat(price),
          service_date: date || new Date().toISOString()
        })
      })
      const data = await res.json()
      if (data.status === 'success') {
        setLastInvoice(data)
        showToast('✅ تم توليد الفاتورة واختبار السيرفر بنجاح')
      }
    } catch {
      showToast('⚠️ خطأ: سيرفر الفواتير (Port 8002) غير متصل')
    } finally { setLoading(false) }
  }

  return (
    <div className="fade-in-up">
      <header className="view-header">
        <h2 className="headline" style={{ fontSize: '28px', textAlign: 'right' }}>اختبار محرك الفواتير (PDF Engine)</h2>
        <p style={{ color: 'var(--text-secondary)' }}>توليد الفواتير يدوياً وفحص تكامل البيانات</p>
      </header>

      <div className="glass-pane">
        <h3 style={{ fontSize: '16px', marginBottom: '24px' }}>📊 مدخلات الفاتورة الاختبارية</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <div className="form-group">
            <label className="label">رقم المزود (Provider ID)</label>
            <input className="input-field" type="number" value={providerId} onChange={e => setProviderId(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">اسم الزبون</label>
            <input className="input-field" value={custName} onChange={e => setCustName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">المبلغ (DZD)</label>
            <input className="input-field" type="number" value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">تاريخ الخدمة</label>
            <input className="input-field" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>

        <button className="btn-premium btn-primary" onClick={generateInvoice} disabled={loading} style={{ marginTop: '30px', width: '100%' }}>
          {loading ? 'جاري التوليد...' : '📄 توليد فاتورة تجريبية'}
        </button>
      </div>

      {lastInvoice && (
        <div className="glass-pane" style={{ marginTop: '30px', borderRight: '4px solid var(--accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '15px' }}>✅ فاتورة مكتملة: {lastInvoice.invoice_id}</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>المسار: {lastInvoice.file_path}</p>
            </div>
            <button className="btn-premium btn-outline" style={{ width: '150px' }} onClick={() => window.open(`http://localhost:8002${lastInvoice.url}`, '_blank')}>
              فتح الملف 👁️
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
