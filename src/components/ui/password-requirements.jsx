import React from 'react'
import { Check, X, Shield } from 'lucide-react'
import zxcvbn from 'zxcvbn'

const Requirement = ({ met, text }) => (
  <div className={`flex items-center gap-2 text-sm ${met ? 'text-green-400' : 'text-slate-400'}`}>
    {met ? (
      <Check className="h-4 w-4" />
    ) : (
      <X className="h-4 w-4" />
    )}
    <span>{text}</span>
  </div>
)

const getStrengthColor = (score) => {
  switch (score) {
    case 0: return 'bg-red-500'
    case 1: return 'bg-orange-500'
    case 2: return 'bg-yellow-500'
    case 3: return 'bg-green-500'
    case 4: return 'bg-emerald-500'
    default: return 'bg-slate-600'
  }
}

const getStrengthText = (score) => {
  switch (score) {
    case 0: return 'Very Weak'
    case 1: return 'Weak'
    case 2: return 'Fair'
    case 3: return 'Strong'
    case 4: return 'Very Strong'
    default: return 'Too Short'
  }
}

const PasswordRequirements = ({ password }) => {
  const requirements = [
    {
      met: password.length >= 8,
      text: 'At least 8 characters'
    },
    {
      met: /[A-Z]/.test(password),
      text: 'One uppercase letter'
    },
    {
      met: /[a-z]/.test(password),
      text: 'One lowercase letter'
    },
    {
      met: /[0-9]/.test(password),
      text: 'One number'
    }
  ]

  const allRequirementsMet = requirements.every(req => req.met)
  const result = allRequirementsMet ? zxcvbn(password) : { score: 0 }
  const strengthColor = getStrengthColor(result.score)
  const strengthText = getStrengthText(result.score)

  return (
    <div className="mt-2 space-y-2">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-slate-300">
            <Shield className="h-4 w-4" />
            <span>Password Strength:</span>
          </div>
          <span className={`font-medium ${result.score > 2 ? 'text-green-400' : 'text-slate-400'}`}>
            {strengthText}
          </span>
        </div>
        <div className="flex gap-1 h-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`h-full flex-1 rounded-full transition-colors ${
                i < result.score ? strengthColor : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="space-y-1">
        {requirements.map((requirement, index) => (
          <Requirement key={index} {...requirement} />
        ))}
      </div>
      {allRequirementsMet && result.feedback.suggestions.length > 0 && (
        <div className="text-sm text-slate-400 mt-2">
          <strong>Tip:</strong> {result.feedback.suggestions[0]}
        </div>
      )}
    </div>
  )
}

export default PasswordRequirements 