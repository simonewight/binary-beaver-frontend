import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import PasswordRequirements from './password-requirements'
import zxcvbn from 'zxcvbn'

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
  const [strength, setStrength] = useState(0)

  const handleChange = (e) => {
    const password = e.target.value
    if (password) {
      const result = zxcvbn(password)
      setStrength(result.score)
    } else {
      setStrength(0)
    }
  }

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
          onChange={(e) => {
            register(name).onChange(e)
            handleChange(e)
          }}
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
        <div className="mt-2">
          <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                strength === 0 ? 'w-0' :
                strength === 1 ? 'w-1/4 bg-red-500' :
                strength === 2 ? 'w-2/4 bg-yellow-500' :
                strength === 3 ? 'w-3/4 bg-green-400' :
                'w-full bg-green-500'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default PasswordInput 