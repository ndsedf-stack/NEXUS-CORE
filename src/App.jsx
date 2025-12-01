import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BriefingPage from './pages/BriefingPage'
import SessionPage from './pages/SessionPage'
import StatsPage from './pages/StatsPage'
import DebriefPage from './pages/DebriefPage'

function App() {
  return (
    <BrowserRouter>
      {/* Background effects */}
      <div className="nebula cyan"></div>
      <div className="nebula purple"></div>
      <div className="grain-overlay"></div>

      {/* App content */}
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/briefing/:week/:day" element={<BriefingPage />} />
          <Route path="/session/:week/:day" element={<SessionPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/debrief/:sessionId" element={<DebriefPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
