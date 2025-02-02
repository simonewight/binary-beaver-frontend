import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../components/ui/button'
import { AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Spinner from '../components/ui/spinner'
import { auth } from '../services/api'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import PasswordRequirements from '../components/ui/password-requirements'
import PasswordInput from '../components/ui/password-input'

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const uid = searchParams.get('uid')

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(resetPasswordSchema)
  })

  const password = watch('password', '')

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      setError('')
      
      await auth.resetPassword({
        token,
        uid,
        password: data.password
      })

      toast.success('Password reset successful!')
      navigate('/login')
    } catch (err) {
      console.error('Password reset error:', err)
      setError(err.response?.data?.detail || 'Failed to reset password')
      toast.error('Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token || !uid) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Invalid Reset Link</h2>
          <p className="text-slate-300 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link 
            to="/forgot-password"
            className="text-blue-400 hover:text-blue-300"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">Reset Your Password</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-md flex items-center gap-2 text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <PasswordInput
            register={register}
            name="password"
            label="New Password"
            error={errors.password?.message}
            showRequirements={true}
            value={password}
          />

          <PasswordInput
            register={register}
            name="confirmPassword"
            label="Confirm Password"
            error={errors.confirmPassword?.message}
          />
          
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
        </form>
      </div>
    </div>
  )
}

export default ResetPassword 