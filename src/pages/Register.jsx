import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../components/ui/button'
import { auth } from '../services/api'
import { AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Spinner from '../components/ui/spinner'
import PasswordInput from '../components/ui/password-input'
import LoadingSquares from '../components/ui/LoadingSquares'
import { useAuth } from '../context/AuthContext'

const registerSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  password1: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  password2: z.string(),
  bio: z.string().optional(),
  location: z.string().optional(),
  dob: z.string().min(1, 'Date of birth is required')
}).refine((data) => data.password1 === data.password2, {
  message: "Passwords don't match",
  path: ["password2"],
}).superRefine((data, ctx) => {
  // Calculate age
  const birthDate = new Date(data.dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  if (age < 13) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "You must be at least 13 years old to register",
      path: ["dob"]
    })
  }
})

const Register = () => {
  const navigate = useNavigate()
  const { login, setUser } = useAuth()
  const [error, setError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data) => {
    try {
      setIsRegistering(true)
      setError('')
      
      console.log('Registration data being sent:', data)
      
      const delay = new Promise(resolve => setTimeout(resolve, 3000))
      
      const [response] = await Promise.all([
        auth.register({
          username: data.username,
          email: data.email,
          password1: data.password1,
          password2: data.password2,
          bio: data.bio || '',
          location: data.location || '',
          dob: data.dob
        }),
        delay
      ])

      console.log('Registration response:', response)

      if (response.data.access) {
        await login({
          username: data.username,
          password: data.password1
        })
        
        setUser(response.profile)
        
        toast.success('Welcome to Code Blox!')
        navigate('/')
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.response?.data?.detail || 'Registration failed')
      toast.error('Registration failed')
    } finally {
      setIsRegistering(false)
    }
  }

  if (isRegistering) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSquares />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-md flex items-center gap-2 text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Username
            </label>
            <input
              {...register('username')}
              type="text"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && (
              <span className="text-sm text-red-500 mt-1">
                {errors.username.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <span className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <PasswordInput
              register={register}
              name="password1"
              label="Password"
              error={errors.password1?.message}
              showRequirements={true}
            />
          </div>

          <div>
            <PasswordInput
              register={register}
              name="password2"
              label="Confirm Password"
              error={errors.password2?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Bio (optional)
            </label>
            <textarea
              {...register('bio')}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Location (optional)
            </label>
            <input
              {...register('location')}
              type="text"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Date of Birth <span className="text-red-400">*</span>
            </label>
            <input
              {...register('dob')}
              type="date"
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.dob && (
              <span className="text-sm text-red-500 mt-1">
                {errors.dob.message}
              </span>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-cyan-500 hover:bg-cyan-400 text-white font-medium px-4"
          >
            Create Account
          </Button>
        </form>

        <p className="text-slate-400 text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register 