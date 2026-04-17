import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import WorkerDashboard from './components/WorkerDashboard'
import IntegrationTools from './components/IntegrationTools'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="app-wrapper">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-viewport">
        {activeTab === 'dashboard' && <WorkerDashboard />}
        {activeTab === 'tools'     && <IntegrationTools />}
        
        {(activeTab !== 'dashboard' && activeTab !== 'tools') && (
          <div className="fade-in glass-card" style={{ padding: '60px', textAlign: 'center' }}>
            <h2 className="view-title">قيد التطوير 👷</h2>
            <p className="view-subtitle">هذا القسم ( {activeTab} ) يتم العمل عليه حالياً ضمن مراحل تطوير المنصة.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
