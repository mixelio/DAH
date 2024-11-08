import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import {DreamsProvider} from './DreamsContext.tsx'
import {Route, HashRouter, Routes} from 'react-router-dom'
import {HomePage} from './pages/HomePage/HomePage.tsx'
import {DreamsGalleryPage} from './pages/DreamsGalleryPage/DreamsGalleryPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DreamsProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<HomePage />} />
            <Route path='dreams' element={<DreamsGalleryPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </DreamsProvider>
  </StrictMode>,
)
