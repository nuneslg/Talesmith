import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import ChatPage from './pages/chat/ChatPage'
import RPGConfig from './pages/chat/RPGConfig'
import LoginPage from './pages/login/LoginPage'
import RegisterPage from './pages/register/RegisterPage'

import '@mantine/core/styles.layer.css';
import { MantineProvider } from '@mantine/core'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="register" element={<RegisterPage/>}/>
          <Route path="login" element={<LoginPage />} />
          <Route path="/" element={<App />} />
          <Route path="/config" element={<RPGConfig />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
)


