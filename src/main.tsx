import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ExampleButton } from './components/ExampleButton'
import { IPhoneVideoCard } from './components/iPhoneVideoCard'
import { IPhoneVideoGallery } from './components/IPhoneVideoGallery'

function ComponentPage({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {children}
    </div>
  )
}

function Router() {
  const [route, setRoute] = useState(window.location.hash || '#/')

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/')
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (route === '#/example-button') {
    return <ComponentPage><ExampleButton label="Click me" /></ComponentPage>
  }

  if (route === '#/iphone-video-card') {
    return <ComponentPage><IPhoneVideoCard /></ComponentPage>
  }

  if (route === '#/iphone-video-gallery') {
    return <ComponentPage><IPhoneVideoGallery /></ComponentPage>
  }

  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
