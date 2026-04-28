import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../context/AuthContext'
import { Input, Button, ErrorAlert } from '../../components/ui'
import { BookOpen, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

const demoAccounts = [
  { label: 'Educator', email: 'educator@demo.com', password: 'edu123' },
  { label: 'Student', email: 'student@demo.com', password: 'stu123' },
  { label: 'Admin', email: 'admin@demo.com', password: 'admin123' },
]

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    setError('')
    try {
      const user = await login(data)
      toast.success(`Welcome back, ${user.name}!`)
      if (user.role === 'EDUCATOR') navigate('/educator/dashboard')
      else if (user.role === 'STUDENT') navigate('/student/dashboard')
      else navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    }
  }

  const fillDemo = (account) => {
    setValue('email', account.email)
    setValue('password', account.password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 font-bold text-2xl text-blue-600 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            EduFlow
          </div>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        <div className="card p-8">
          {/* Demo accounts */}
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-500 mb-2">Quick demo login:</p>
            <div className="flex gap-2">
              {demoAccounts.map(acc => (
                <button key={acc.label} type="button" onClick={() => fillDemo(acc)}
                  className="flex-1 text-xs py-1.5 px-2 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors">
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <ErrorAlert message={error} />

            <Input label="Email address" type="email" placeholder="you@example.com"
              error={errors.email?.message} {...register('email')} />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('password')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" loading={isSubmitting}>Sign In</Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
