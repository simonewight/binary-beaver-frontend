import { Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const [showResetForm, setShowResetForm] = useState(false)
  const [resetUsername, setResetUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      setError('')
      
      await auth.resetPassword({
        username: resetUsername,
        new_password: newPassword
      })
      
      toast.success('Password reset successful! Please log in.')
      setShowResetForm(false)
    } catch (err) {
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
        
        {showResetForm ? (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Username
              </label>
              <input
                type="text"
                value={resetUsername}
                onChange={(e) => setResetUsername(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                New Password
              </label>
              <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                showRequirements
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            </form>
            <button
              type="button"
              onClick={() => setShowResetForm(true)}
              className="w-full text-sm text-blue-400 hover:text-blue-300 mt-4"
            >
              Forgot Password?
            </button>
          </>
        )}
      </div>
    </div>
  )
} 