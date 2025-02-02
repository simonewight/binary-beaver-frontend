import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ui/toast'
import { AnimatePresence } from 'framer-motion'
import './styles/global.css'
import ErrorBoundary from './components/ErrorBoundary'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'

// Import pages (we'll create these next)
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import SnippetDetail from './pages/SnippetDetail'
import Profile from './pages/Profile'
import Collections from './pages/Collections'
import Snippets from './pages/Snippets'
import PageTransition from './components/PageTransition'
import ResetPassword from './pages/ResetPassword'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ToastProvider />
          <Toaster position="top-right" />
          <AnimatePresence mode="wait">
            <div className="app min-h-screen bg-gray-50">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={
                  <PageTransition>
                    <Login />
                  </PageTransition>
                } />
                <Route path="/register" element={
                  <PageTransition>
                    <Register />
                  </PageTransition>
                } />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Protected routes */}
                <Route element={<Layout />}>
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={
                      <PageTransition>
                        <Home />
                      </PageTransition>
                    } />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/collections" element={<Collections />} />
                    <Route path="/snippets" element={<Snippets />} />
                    <Route path="/snippet/:id" element={<SnippetDetail />} />
                  </Route>
                </Route>
              </Routes>
            </div>
          </AnimatePresence>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App 