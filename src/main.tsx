import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import {DreamsProvider} from './DreamsContext.tsx'
import {Route, HashRouter, Routes} from 'react-router-dom'
import {HomePage} from './pages/HomePage/HomePage.tsx'
import {DreamsGalleryPage} from './pages/DreamsGalleryPage/DreamsGalleryPage.tsx'
import {AboutUsPage} from './pages/AboutUsPage/AboutUsPage.tsx'
import {NotFoundPage} from './pages/NotFoundPage/NotFoundPage.tsx'
import {DreamPage} from './pages/DreamPage/DreamPage.tsx'
import {ThemeProvider} from '@mui/material'
import {theme} from './utils/theme.ts'


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DreamsProvider>
      <ThemeProvider theme={theme}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<HomePage />} />
              <Route path="dreams">
                <Route index element={<DreamsGalleryPage />} />
                <Route path=":id?" element={<DreamPage />} />
              </Route>
              <Route path="aboutus" element={<AboutUsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </DreamsProvider>
  </StrictMode>
);
