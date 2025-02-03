import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ui/toast'
import { AnimatePresence } from 'framer-motion'
import './styles/global.css'
import './styles/prism-custom.css'
import ErrorBoundary from './components/ErrorBoundary'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'
import StarField from './components/ui/StarField'

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
import CollectionDetail from './pages/CollectionDetail'
import NewSnippet from './pages/NewSnippet'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="relative">
          <StarField />
          <div className="relative z-20">
            <Toaster />
            <Router>
              <ToastProvider />
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
                        <Route path="/snippets/new" element={<NewSnippet />} />
                        <Route path="/snippet/:id" element={<SnippetDetail />} />
                        <Route path="/collection/:id" element={<CollectionDetail />} />
                      </Route>
                    </Route>
                  </Routes>
                </div>
              </AnimatePresence>
            </Router>
          </div>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App 