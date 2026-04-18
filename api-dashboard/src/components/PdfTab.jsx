import { useState, useContext } from 'react'
import { ToastContext } from '../App'

const BASE = 'http://localhost:8002'

const emptyItem = () => ({ description: '', price: '', quantity: 1 })

export default function PdfTab() {
  const showToast = useContext(ToastContext)

  const [form, setForm] = useState({
    invoice_title: 'INVOICE',
    customer_name: '',
    customer_phone: '', // رقم الهاتف الجديد
    customer_details: '',
    provider_name: '',
    provider_details: '',
    currency: 'DZD',
    notes: '',
  })
  const [items, setItems]     = useState([emptyItem()])
  const [autoSend, setAutoSend] = useState(false) // خيار الإرسال التلقائي
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [serverOnline, setServerOnline] = useState(null)

  const sendToWhatsApp = async (phone, url, invoiceId) => {
    const key = localStorage.getItem('khidmati_api_key')
    if (!key) {
      showToast('يرجى إدخال مفتاح الـ API في قسم الواتساب أولاً', 'error')
      return
    }

    try {
      const msg = `مرحباً ${form.customer_name}، إليك فاتورتك رقم #${invoiceId} من ${form.provider_name}.\nيمكنك تحميلها من الرابط التالي:\n${url}`
      const res = await fetch('http://localhost:8000/api/v1/notifications/direct', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-KEY': key
        },
        body: JSON.stringify({
          phone_number: phone,
          message: msg,
          is_business: false
        })
      })
      if (res.ok) showToast('تم إرسال الفاتورة عبر واتساب بنجاح ✅', 'success')
      else showToast('فشل إرسال الفاتورة عبر واتساب، تأكد من إعدادات الخدمة', 'error')
    } catch {
      showToast('لا يمكن الاتصال بخدمة الواتساب لإرسال الفاتورة', 'error')
    }
  }

  const checkServer = async () => {
    setServerOnline('checking')
    try {
      await fetch(`${BASE}/docs`, { signal: AbortSignal.timeout(3000) })
      setServerOnline(true)
      showToast('سيرفر PDF يعمل على المنفذ 8002', 'success')
    } catch {
      setServerOnline(false)
      showToast('سيرفر PDF غير متاح على 8002', 'error')
    }
  }

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const setItem = (idx, key, val) =>
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [key]: val } : it))

  const addItem    = () => setItems(prev => [...prev, emptyItem()])
  const removeItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx))

  const grandTotal = items.reduce((sum, it) => {
    const p = parseFloat(it.price) || 0
    const q = parseInt(it.quantity) || 0
    return sum + p * q
  }, 0)

  const generatePdf = async () => {
    if (!form.customer_name.trim()) { showToast('أدخل اسم الزبون', 'error'); return }
    if (!form.provider_name.trim()) { showToast('أدخل اسم المزود', 'error'); return }
    const validItems = items.filter(it => it.description.trim() && parseFloat(it.price) > 0)
    if (validItems.length === 0) { showToast('أضف بنداً واحداً على الأقل', 'error'); return }

    setLoading(true)
    setResponse(null)
    try {
      const body = {
        ...form,
        items: validItems.map(it => ({
          description: it.description,
          price: parseFloat(it.price),
          quantity: parseInt(it.quantity) || 1,
        })),
      }
      const res = await fetch(`${BASE}/api/v1/generate-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      setResponse(data)
      if (data.status === 'success') {
        showToast(`✅ تم إنشاء الفاتورة ${data.invoice_id}`, 'success')
        
        // إرسال تلقائي إذا كان مفعل
        if (autoSend && form.customer_phone) {
          const downloadUrl = data.download_url
          sendToWhatsApp(form.customer_phone, downloadUrl, data.invoice_id)
        }
      } else {
        showToast('حدث خطأ أثناء الإنشاء', 'error')
      }
    } catch {
      showToast('تأكد من تشغيل سيرفر PDF على المنفذ 8002', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getDownloadUrl = () => {
    if (!response || !response.download_url) return null
    if (typeof response.download_url === 'string') return response.download_url
    if (typeof response.download_url === 'object' && response.download_url._url) return response.download_url._url
    return String(response.download_url)
  }

  const downloadPdf = async () => {
    const url = getDownloadUrl()
    if (!url) return

    try {
      const res = await fetch(url)
      if (!res.ok) {
        showToast('فشل تحميل الفاتورة، حاول مرة أخرى', 'error')
        return
      }
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `${response.invoice_id}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)
    } catch {
      showToast('فشل تحميل الفاتورة من السيرفر', 'error')
    }
  }

  const statusDot =
    serverOnline === null ? '' :
    serverOnline === 'checking' ? 'checking' :
    serverOnline ? 'online' : 'offline'

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-top">
          <div className="page-icon page-icon-pdf">📄</div>
          <div>
            <h1>PDF Invoice Generator</h1>
            <p>إنشاء فواتير PDF احترافية متعددة البنود</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
          <div className="server-status">
            <div className={`status-dot ${statusDot}`} />
            <span>
              {serverOnline === null      && 'غير محدد'}
              {serverOnline === 'checking'&& 'يتم الفحص...'}
              {serverOnline === true      && 'السيرفر يعمل'}
              {serverOnline === false     && 'السيرفر متوقف'}
            </span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={checkServer}>فحص الاتصال 🔍</button>
        </div>
      </div>

      {/* Header info */}
      <div className="glass-card section-card">
        <div className="section-card-header">
          <span className="section-title">🏢 معلومات الفاتورة</span>
        </div>

        <div className="two-col">
          <div className="form-group">
            <label className="input-label">عنوان الفاتورة</label>
            <input className="input-field" value={form.invoice_title}
              onChange={e => setField('invoice_title', e.target.value)} placeholder="INVOICE" />
          </div>
          <div className="form-group">
            <label className="input-label">العملة</label>
            <select className="input-field" value={form.currency}
              onChange={e => setField('currency', e.target.value)}
              style={{ cursor: 'pointer' }}>
              <option value="DZD">DZD — دينار جزائري</option>
              <option value="USD">USD — دولار</option>
              <option value="EUR">EUR — يورو</option>
              <option value="SAR">SAR — ريال سعودي</option>
            </select>
          </div>
        </div>

        <div className="two-col">
          <div>
            <div className="form-group">
              <label className="input-label">👤 اسم الزبون *</label>
              <input className="input-field" value={form.customer_name}
                onChange={e => setField('customer_name', e.target.value)} placeholder="محمد أمين" />
            </div>
            <div className="form-group">
              <label className="input-label">📱 رقم هاتف الزبون (للإرسال)</label>
              <input className="input-field" value={form.customer_phone}
                onChange={e => setField('customer_phone', e.target.value)} placeholder="2137XXXXXXXX" />
            </div>
            <div className="form-group">
              <label className="input-label">تفاصيل الزبون</label>
              <textarea className="input-field" value={form.customer_details}
                onChange={e => setField('customer_details', e.target.value)}
                placeholder="العنوان، رقم آخر..." rows={2} />
            </div>
          </div>
          <div>
            <div className="form-group">
              <label className="input-label">🏪 اسم المزود *</label>
              <input className="input-field" value={form.provider_name}
                onChange={e => setField('provider_name', e.target.value)} placeholder="شركة خدمتي" />
            </div>
            <div className="form-group">
              <label className="input-label">تفاصيل المزود</label>
              <textarea className="input-field" value={form.provider_details}
                onChange={e => setField('provider_details', e.target.value)}
                placeholder="العنوان، الهاتف..." rows={2} />
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="glass-card section-card">
        <div className="section-card-header">
          <span className="section-title">📦 بنود الفاتورة</span>
          <button className="btn btn-ghost btn-sm" onClick={addItem}>+ إضافة بند</button>
        </div>

        <div className="invoice-items-header">
          <span>الوصف</span>
          <span>الكمية</span>
          <span>سعر الوحدة</span>
          <span></span>
        </div>

        {items.map((it, idx) => (
          <div className="invoice-item-row" key={idx}>
            <input
              className="input-field"
              placeholder={`بند ${idx + 1} — مثال: خدمة الكهرباء`}
              value={it.description}
              onChange={e => setItem(idx, 'description', e.target.value)}
            />
            <input
              className="input-field"
              type="number" min="1"
              value={it.quantity}
              onChange={e => setItem(idx, 'quantity', e.target.value)}
            />
            <input
              className="input-field"
              type="number" min="0" step="0.01"
              placeholder="0.00"
              value={it.price}
              onChange={e => setItem(idx, 'price', e.target.value)}
            />
            <button
              className="remove-btn"
              onClick={() => removeItem(idx)}
              disabled={items.length === 1}
            >✕</button>
          </div>
        ))}

        {/* Total */}
        <div style={{
          marginTop: 16,
          padding: '14px 18px',
          background: 'rgba(249,115,22,0.08)',
          border: '1px solid rgba(249,115,22,0.25)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>
            المجموع الكلي
          </span>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#f97316' }}>
            {grandTotal.toLocaleString('ar-DZ', { minimumFractionDigits: 2 })} {form.currency}
          </span>
        </div>

        {/* Notes */}
        <div className="form-group" style={{ marginTop: 16, marginBottom: 0 }}>
          <label className="input-label">ملاحظات (اختياري)</label>
          <textarea className="input-field" value={form.notes} rows={2}
            onChange={e => setField('notes', e.target.value)}
            placeholder="أي معلومات إضافية للزبون..." />
        </div>
      </div>

      {/* Generate */}
      <div className="glass-card section-card">
        <div className="section-card-header">
          <span className="section-title">⚡ توليد الفاتورة</span>
        </div>
        <div className="endpoint-badge">
          <span className="endpoint-method method-post">POST</span>
          {BASE}/api/v1/generate-pdf
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '15px 0' }}>
          <input 
            type="checkbox" 
            checked={autoSend} 
            onChange={e => setAutoSend(e.target.checked)}
            id="autoSendCheck"
            style={{ width: 18, height: 18, cursor: 'pointer' }}
          />
          <label htmlFor="autoSendCheck" style={{ fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
            🚀 إرسال الفاتورة آلياً للزبون عبر واتساب فور توليدها
          </label>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
          في حال تفعيل الخيار وإدخال رقم الهاتف، سيتم إرسال رابط الفاتورة تلقائياً بعد الإنشاء.
        </p>

        <button className="btn btn-pdf" onClick={generatePdf} disabled={loading} style={{ marginTop: 12 }}>
          {loading ? <><span className="spinner" /> جاري التوليد...</> : autoSend ? '📄 توليد وإرسال عبر واتساب' : '📄 توليد فاتورة PDF'}
        </button>

        {response && (
          <div style={{ marginTop: 16 }}>
            <div className="response-block">{JSON.stringify(response, null, 2)}</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {getDownloadUrl() && (
                <button
                  type="button"
                  onClick={downloadPdf}
                  className="btn btn-pdf btn-sm"
                  style={{ marginTop: 12, display: 'inline-flex' }}
                >
                  ⬇️ تحميل الفاتورة ({response.invoice_id})
                </button>
              )}
              {getDownloadUrl() && form.customer_phone && (
                <button
                  type="button"
                  onClick={() => sendToWhatsApp(form.customer_phone, getDownloadUrl(), response.invoice_id)}
                  className="btn btn-whatsapp btn-sm"
                  style={{ marginTop: 12, display: 'inline-flex' }}
                >
                  💬 إرسال عبر واتساب
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
