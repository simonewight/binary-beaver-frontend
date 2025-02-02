import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import PasswordRequirements from './password-requirements'

const PasswordInput = ({ 
  register, 
  name, 
  label, 
  error, 
  showRequirements = false,
  value = '',
  placeholder = ''
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          {...register(name)}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
      {error && (
        <span className="text-sm text-red-500 mt-1">{error}</span>
      )}
      {showRequirements && (
        <PasswordRequirements password={value} />
      )}
    </div>
  )
}

export default PasswordInput 