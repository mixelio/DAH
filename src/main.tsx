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
import {ContactsPage} from './pages/ContactsPage/ContactsPage.tsx'
import {ProfilePage} from './pages/ProfilePage/ProfilePage.tsx'
import {Provider} from 'react-redux'
import {store} from './app/store.ts'
import {ProfileEdit} from './pages/ProfileEdit/ProfileEdit.tsx'
import {CreateDreamPage} from './pages/CreateDreamPage/CreateDreamPage.tsx'
import {FavoritePage} from './pages/FavoritePage/FavoritePage.tsx'


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
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
                <Route path="contacts" element={<ContactsPage />} />
                <Route path="profile/:id?">
                  <Route index element={<ProfilePage />} />
                  <Route path="edit" element={<ProfileEdit />} />
                  <Route path="create" element={<CreateDreamPage />} />
                  <Route path="favorites" element={<FavoritePage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </HashRouter>
        </ThemeProvider>
      </DreamsProvider>
    </Provider>
  </StrictMode>
);
