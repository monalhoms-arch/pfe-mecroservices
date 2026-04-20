import React, { useState, useEffect, useContext } from 'react'
import { ToastContext } from '../App'

export default function AutomationTab() {
  const showToast = useContext(ToastContext)
  const [instances, setInstances] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [qrCode, setQrCode] = useState(null)
  const [newInstanceName, setNewInstanceName] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  // Test Message State
  const [testPhone, setTestPhone] = useState('')
  const [testMessage, setTestMessage] = useState('')
  const [testInstance, setTestInstance] = useState('')

  const API_KEY = 'my_super_secret_key_123'
  const BASE_URL = 'http://127.0.0.1:8000/api/v1/automation'

  useEffect(() => {
    fetchInstances()
  }, [])

  const fetchInstances = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/instances`, {
        headers: { 'X-API-KEY': API_KEY }
      })
      if (res.ok) {
        const data = await res.json()
        setInstances(Array.isArray(data) ? data : (data.instances || []))
      } else {
        const errData = await res.json().catch(() => ({}))
        showToast(`خطأ جلب النسخ: ${errData.detail || 'Evolution API غير متصل'}`, 'error')
        setInstances([])
      }
    } catch (err) {
      showToast('خطأ من سيرفر WhatsApp الأساسي', 'error')
      setInstances([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInstance = async () => {
    if (!newInstanceName) return showToast('يرجى إدخال اسم النسخة', 'error')
    setActionLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/instances?name=${newInstanceName}`, {
        method: 'POST',
        headers: { 'X-API-KEY': API_KEY }
      })
      if (res.ok) {
        showToast('✅ تم إنشاء النسخة بنجاح')
        setNewInstanceName('')
        setShowCreateModal(false)
        fetchInstances()
      } else {
        const errData = await res.json().catch(() => ({}))
        let msg = errData.detail || 'الرجاء التأكد من تشغيل حاوية Evolution API'
        if (msg.includes('ConnectionError') || msg.includes('Failed to establish a new connection')) {
            msg = 'السيرفر لا يستجيب، هل قمت بتشغيل docker compose؟'
        }
        showToast(`❌ فشل: ${msg}`, 'error')
      }
    } catch (err) {
      showToast('خطأ في الاتصال بالسيرفر', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleConnect = async (id) => {
    setActionLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/instances/${id}/connect`, {
        headers: { 'X-API-KEY': API_KEY }
      })
      const data = await res.json()
      if (data.code || data.base64) {
        setQrCode(data.base64 || data.code)
        setShowModal(true)
      } else {
        showToast('⚠️ النسخة متصلة بالفعل أو السيرفر غير مستجيب', 'warning')
      }
    } catch (err) {
      showToast('خطأ في طلب رمز QR', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleLogout = async (id) => {
    if (!window.confirm('هل أنت متأكد من قطع الاتصال؟')) return
    setActionLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/instances/${id}/logout`, {
        method: 'POST',
        headers: { 'X-API-KEY': API_KEY }
      })
      if (res.ok) {
        showToast('تم قطع الاتصال بنجاح')
        fetchInstances()
      }
    } catch (err) {
      showToast('خطأ في قطع الاتصال', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(`⚠️ سيتم حذف النسخة "${id}" نهائياً. هل أنت متأكد؟`)) return
    setActionLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/instances/${id}`, {
        method: 'DELETE',
        headers: { 'X-API-KEY': API_KEY }
      })
      if (res.ok) {
        showToast('🗑️ تم حذف النسخة بنجاح')
        fetchInstances()
      }
    } catch (err) {
      showToast('خطأ في الحذف', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleTestSend = async () => {
    if (!testPhone || !testMessage) return showToast('أدخل الهاتف والرسالة للاختبار', 'error')
    setActionLoading(true)
    try {
      const url = `${BASE_URL}/test-message?phone=${testPhone}&message=${encodeURIComponent(testMessage)}${testInstance ? `&instance_id=${testInstance}` : ''}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'X-API-KEY': API_KEY }
      })
      if (res.ok) {
        showToast('✅ تم إرسال رسالة الاختبار بنجاح')
      } else {
        showToast('❌ فشل الإرسال من هذه النسخة', 'error')
      }
    } catch (err) {
      showToast('خطأ في الإرسال', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="automation-container fade-in-up">
      <header className="page-header">
        <div className="page-header-top">
          <div className="page-icon" style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}>⚡</div>
          <div>
            <h1>مركز الأتمتة المتقدم</h1>
            <p>إدارة النسخ المتعددة لـ Evolution API والتحكم في حالات الاتصال</p>
          </div>
        </div>
        <div className="header-actions">
           <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
             <span>+ إنشاء نسخة جديدة</span>
           </button>
           <button className="btn btn-ghost" onClick={fetchInstances} disabled={loading}>
             {loading ? 'جاري التحديث...' : 'تحديث الكل 🔄'}
           </button>
        </div>
      </header>

      <div className="main-content">
        {/* Instance List Section */}
        <section className="instance-section">
          <h2 className="section-title">📡 النسخ المسجلة ({instances.length})</h2>
          
          {loading && !instances.length ? (
            <div className="loading-state">جاري تحميل النسخ...</div>
          ) : (
            <div className="instance-grid">
              {instances.map((inst) => (
                <div key={inst.instanceId || inst.name} className={`instance-card glass-card ${inst.status === 'open' || inst.connectionStatus === 'open' ? 'connected' : 'disconnected'}`}>
                  <div className="card-badge">
                    {inst.status === 'open' || inst.connectionStatus === 'open' ? 'توصيل نشط' : 'غير متصل'}
                  </div>
                  <div className="card-header">
                    <h3>{inst.instanceName || inst.name}</h3>
                    <code className="id-sub">{inst.instanceId || inst.id}</code>
                  </div>
                  
                  <div className="card-body">
                     <div className="info-row">
                        <span>الحالة:</span>
                        <span className="val">{inst.connectionStatus || inst.status || 'unknown'}</span>
                     </div>
                     {inst.ownerJid && (
                       <div className="info-row">
                          <span>الرقم المرتبط:</span>
                          <span className="val">{inst.ownerJid.split('@')[0]}</span>
                       </div>
                     )}
                  </div>

                  <div className="card-actions">
                    {inst.status !== 'open' && inst.connectionStatus !== 'open' ? (
                      <button className="btn-sm btn-whatsapp" onClick={() => handleConnect(inst.instanceName || inst.name)}>ربط QR</button>
                    ) : (
                      <button className="btn-sm btn-ghost" onClick={() => handleLogout(inst.instanceName || inst.name)}>قطع الاتصال</button>
                    )}
                    <button className="btn-sm btn-test" onClick={() => {
                        setTestInstance(inst.instanceName || inst.name)
                        document.querySelector('.test-section').scrollIntoView({ behavior: 'smooth' })
                    }}>اختبار إرسال</button>
                    <button className="btn-sm btn-danger-icon" title="حذف" onClick={() => handleDelete(inst.instanceName || inst.name)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Test Section */}
        <section className="test-section glass-card section-card" style={{ marginTop: '30px' }}>
             <h2 className="section-title">🚀 اختبار الإرسال الآلي</h2>
             <div className="test-flex">
                <div className="form-group">
                   <label>النسخة المستخدمة</label>
                   <select className="input-field" value={testInstance} onChange={e => setTestInstance(e.target.value)}>
                      <option value="">-- النسخة الافتراضية --</option>
                      {instances.map(i => (
                        <option key={i.id} value={i.instanceName || i.name}>{i.instanceName || i.name}</option>
                      ))}
                   </select>
                </div>
                <div className="form-group">
                   <label>رقم الهاتف</label>
                   <input className="input-field" placeholder="213XXXXXXXXX" value={testPhone} onChange={e => setTestPhone(e.target.value)} />
                </div>
             </div>
             <div className="form-group">
                <label>نص الرسالة</label>
                <textarea className="input-field" rows={2} value={testMessage} onChange={e => setTestMessage(e.target.value)} />
             </div>
             <button className="btn btn-whatsapp" onClick={handleTestSend} disabled={actionLoading} style={{ width: '100%' }}>
                {actionLoading ? 'جاري الإرسال...' : 'إرسال اختبار فوري'}
             </button>
        </section>
      </div>

      {/* QR Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
           <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
              <h2>اربط هاتفك بالواتساب</h2>
              <p>قم بمسح الكود التالي باستخدام واتساب ويب من هاتفك</p>
              <div className="qr-container">
                 {qrCode?.startsWith('data:image') ? (
                   <img src={qrCode} alt="QR Code" />
                 ) : (
                   <div className="qr-fallback">{qrCode}</div>
                 )}
              </div>
              <button className="btn btn-primary" onClick={() => setShowModal(false)}>أغلـق</button>
           </div>
        </div>
      )}

      {/* Create Instance Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
           <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
              <h2>إنشاء نسخة جديدة</h2>
              <div className="form-group" style={{ margin: '20px 0' }}>
                 <label>اسم النسخة (Instance Name)</label>
                 <input className="input-field" placeholder="مثلاً: factory_dispatch" value={newInstanceName} onChange={e => setNewInstanceName(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-primary" onClick={handleCreateInstance} disabled={actionLoading}>
                   {actionLoading ? 'جاري الإنشاء...' : 'تأكيد الإنشاء'}
                </button>
                <button className="btn btn-ghost" onClick={() => setShowCreateModal(false)}>إلغاء</button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .instance-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-top: 15px; }
        .instance-card { position: relative; padding: 20px; border-left: 4px solid #ccc; transition: all 0.3s; }
        .instance-card.connected { border-left-color: #25d366; }
        .instance-card.disconnected { border-left-color: #ff6b6b; opacity: 0.8; }
        .card-badge { position: absolute; top: 10px; left: 10px; font-size: 10px; background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 20px; }
        .card-header h3 { margin: 10px 0 0 0; font-size: 18px; color: var(--text-main); }
        .id-sub { font-size: 11px; color: var(--text-dim); }
        .info-row { display: flex; justify-content: space-between; font-size: 13px; margin: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px; }
        .val { color: var(--accent-whatsapp); font-weight: 500; }
        .card-actions { display: flex; gap: 8px; margin-top: 20px; }
        .btn-test { background: rgba(255,215,0,0.1); color: #ffd700; border: 1px solid rgba(255,215,0,0.2); cursor: pointer; border-radius: 4px; padding: 4px 8px; }
        .btn-danger-icon { background: none; border: none; cursor: pointer; font-size: 16px; opacity: 0.6; transition: 0.3s; }
        .btn-danger-icon:hover { opacity: 1; transform: scale(1.1); }
        
        .test-flex { display: flex; gap: 20px; margin-bottom: 15px; }
        .test-flex .form-group { flex: 1; }

        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(5px); }
        .modal-content { max-width: 450px; width: 90%; padding: 30px; text-align: center; border: 1px solid rgba(255,255,255,0.2); }
        .qr-container { background: white; padding: 15px; border-radius: 12px; margin: 20px auto; width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; }
        .qr-container img { width: 100%; height: 100%; object-fit: contain; }
        .qr-fallback { color: #333; word-break: break-all; font-family: monospace; font-size: 10px; }
      `}</style>
    </div>
  )
}
