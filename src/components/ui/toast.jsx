import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: 'bg-slate-800 text-white',
        duration: 4000,
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid #334155',
        },
      }}
    />
  )
} 