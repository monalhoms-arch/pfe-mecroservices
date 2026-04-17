import React, { useState } from 'react'
import './index.css'
import './App.css'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import WhatsAppTab from './components/WhatsAppTab'
import PdfTab from './components/PdfTab'
import GpsTab from './components/GpsTab'
import Toast from './components/Toast'

export const ToastContext = React.createContext(null)

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  return (
    <ToastContext.Provider value={showToast}>
      <div className="app-layout">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="main-content">
          <div className="tab-content fade-in-up" key={activeTab}>
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'whatsapp'  && <WhatsAppTab />}
            {activeTab === 'pdf'       && <PdfTab />}
            {activeTab === 'gps'       && <GpsTab />}
          </div>
        </main>
        {toast && <Toast msg={toast.msg} type={toast.type} />}
      </div>
    </ToastContext.Provider>
  )
}

export default App
