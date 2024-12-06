import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LandingPage from './pages/landing.tsx'
import Login from './pages/login.tsx'
import Dashboard from './pages/dashboard.tsx'
import BuscaMedico from './pages/buscaMedico.tsx'
import BuscaPaciente from './pages/buscaPaciente.tsx'
import RegistraPesquisa from './pages/registraPesquisa.tsx'
import Chat from './pages/chat.tsx'
import './globals.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import StudyDetails from './pages/studydetails.tsx'
import { SearchProvider } from './contexts/searchContext.tsx'
import { Toaster } from './components/ui/toaster.tsx'
import { ChatProvider } from './contexts/chatContext.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/busca-paciente',
    element: <BuscaPaciente />,
  },
  {
    path: '/busca-medico',
    element: <BuscaMedico />,
  },
  {
    path : '/studydetails',
    element: <StudyDetails/>
  },
  {
    path: '/register-research',
    element: <RegistraPesquisa />,
  },
  {
    path: '/chat',
    element: <Chat />,
  },

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SearchProvider>
      <ChatProvider>
      <Toaster />
        <RouterProvider router={router} />
      </ChatProvider>
    </SearchProvider>
  </StrictMode>,
)
