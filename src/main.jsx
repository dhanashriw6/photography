import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { CursorProvider } from './Components/CustomCursor'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CursorProvider>
        <App />
      </CursorProvider>
    </BrowserRouter>
  </StrictMode>
)
