import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import {DreamsProvider} from './DreamsContext.tsx'
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
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
import {PasswordReset} from './pages/PasswordReset/PasswordReset.tsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "dreams",
        children: [
          { index: true, element: <DreamsGalleryPage /> },
          { path: ":id", element: <DreamPage /> },
          { path: ":id/edit", element: <CreateDreamPage /> },
        ],
      },
      { path: "aboutus", element: <AboutUsPage /> },
      { path: "contacts", element: <ContactsPage /> },
      {
        path: "profile/:id?",
        children: [
          { index: true, element: <ProfilePage /> },
          { path: "edit", element: <ProfileEdit /> },
          { path: "create", element: <CreateDreamPage /> },
          { path: "favorites", element: <FavoritePage /> },
        ],
      },
      { path: "pass-reset", element: <PasswordReset /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

const CLIENT_ID =
  "481622529798-iaribr4blec6nafim0hjamha8i04aupt.apps.googleusercontent.com";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <DreamsProvider>
        <ThemeProvider theme={theme}>
          <GoogleOAuthProvider clientId={CLIENT_ID}>
            {/* <HashRouter future={{ v7_startTransition: true }}>
              <Routes>
                <Route path="/" element={<App />}>
                  <Route index element={<HomePage />} />
                  <Route path="dreams">
                    <Route index element={<DreamsGalleryPage />} />
                    <Route path=":id?" element={<DreamPage />} />
                    <Route path=":id/edit" element={<CreateDreamPage />} />
                  </Route>
                  <Route path="aboutus" element={<AboutUsPage />} />
                  <Route path="contacts" element={<ContactsPage />} />
                  <Route path="profile/:id?">
                    <Route index element={<ProfilePage />} />
                    <Route path="edit" element={<ProfileEdit />} />
                    <Route path="create" element={<CreateDreamPage />} />
                    <Route path="favorites" element={<FavoritePage />} />
                  </Route>
                  <Route path="pass-reset" element={<PasswordReset />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </HashRouter> */}
            <RouterProvider
              router={router}
              future={{ v7_startTransition: true }}
            />
          </GoogleOAuthProvider>
        </ThemeProvider>
      </DreamsProvider>
    </Provider>
  </StrictMode>
);
