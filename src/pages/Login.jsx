import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../components/ui/button'
import { useAuth } from '../context/AuthContext'
import { AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Spinner from '../components/ui/spinner'
import PasswordInput from '../components/ui/password-input'
import { auth } from '../services/api'

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

const resetSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
})

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showResetForm, setShowResetForm] = useState(false)

  const loginForm = useForm({
    resolver: zodResolver(loginSchema)
  })

  const resetForm = useForm({
    resolver: zodResolver(resetSchema)
  })

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      setError('')
      
      const response = await login({
        username: data.username,
        password: data.password
      })
      
      if (response.data.access) {
        toast.success('Login successful!')
        navigate('/')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.detail || 'Login failed')
      toast.error('Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (data) => {
    try {
      setIsLoading(true)
      setError('')
      
      await auth.resetPassword({
        username: data.username,
        new_password: data.password
      })
      
      toast.success('Password reset successful! Please log in.')
      setShowResetForm(false)
      resetForm.reset()
    } catch (err) {
      console.error('Reset error:', err)
      setError(err.response?.data?.detail || 'Failed to reset password')
      toast.error('Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">
          {showResetForm ? 'Reset Password' : 'Sign In'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-md flex items-center gap-2 text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {showResetForm ? (
          <form onSubmit={resetForm.handleSubmit(handlePasswordReset)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Username
              </label>
              <input
                {...resetForm.register('username')}
                type="text"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {resetForm.formState.errors.username && (
                <span className="text-sm text-red-500 mt-1">
                  {resetForm.formState.errors.username.message}
                </span>
              )}
            </div>
            <div>
              <PasswordInput
                register={resetForm.register}
                name="password"
                label="New Password"
                error={resetForm.formState.errors.password?.message}
                showRequirements={true}
                value={resetForm.watch('password', '')}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner />
                  <span>Resetting Password...</span>
                </div>
              ) : (
                'Reset Password'
              )}
            </Button>
            <button
              type="button"
              onClick={() => setShowResetForm(false)}
              className="w-full text-sm text-slate-400 hover:text-slate-300 mt-2"
            >
              Back to Login
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Username
                </label>
                <input
                  {...loginForm.register('username')}
                  type="text"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {loginForm.formState.errors.username && (
                  <span className="text-sm text-red-500 mt-1">
                    {loginForm.formState.errors.username.message}
                  </span>
                )}
              </div>
              <div>
                <PasswordInput
                  register={loginForm.register}
                  name="password"
                  label="Password"
                  error={loginForm.formState.errors.password?.message}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
            <div className="mt-4 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => setShowResetForm(true)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Forgot Password?
              </button>
              <p className="text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-400 hover:text-blue-300">
                  Create one
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Login 