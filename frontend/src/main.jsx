
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import ChatPage from './pages/chat/ChatPage'
import RPGConfig from './pages/chat/RPGConfig'
import HistoryPages from './pages/historias/HistoryPages'  /* 👈 NOVO */
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} /> 
        <Route path="/historias" element={<HistoryPages />} /> {/* 👈 NOVO */} {/*alterei a tela inicial para apontar para a tela de histórias salvas e criar nova história*/}
        <Route path="/config" element={<RPGConfig />} /> {/* 👈 NOVO */}
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)


