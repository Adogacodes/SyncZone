import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ToastProvider } from './components/ui/Toast'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AppProvider>
  </BrowserRouter>
)