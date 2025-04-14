
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure worker is only imported and started in development mode
if (process.env.NODE_ENV === 'development') {
  const { worker } = await import('./mocks/browser')
  worker.start({ onUnhandledRequest: 'bypass' })
    .catch(e => console.error('Worker start failed:', e))
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
