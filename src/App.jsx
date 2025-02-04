import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AnimatePresence } from 'framer-motion'
import './styles/global.css'
import './styles/prism-custom.css'
import ErrorBoundary from './components/ErrorBoundary'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'
import StarField from './components/ui/StarField'
import { TooltipProvider } from './components/ui/tooltip'

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
import EditSnippet from './pages/EditSnippet'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TooltipProvider>
          <div className="relative">
            <StarField />
            <div className="relative z-20">
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#1e293b',
                    color: '#fff',
                  },
                }}
              />
              <Router>
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
                          <Route path="/snippet/:id/edit" element={<EditSnippet />} />
                          <Route path="/collection/:id" element={<CollectionDetail />} />
                        </Route>
                      </Route>
                    </Routes>
                  </div>
                </AnimatePresence>
              </Router>
            </div>
          </div>
        </TooltipProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App 