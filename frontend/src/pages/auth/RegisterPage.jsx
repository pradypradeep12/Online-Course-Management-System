import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../context/AuthContext'
import { Input, Button, ErrorAlert } from '../../components/ui'
import { BookOpen, GraduationCap, Eye, EyeOff } from 'lucide-react'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['EDUCATOR', 'STUDENT'], { required_error: 'Please select a role' }),
}).refine(d => d.password === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] })

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'STUDENT' },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data) => {
    setError('')
    try {
      const { confirmPassword, ...userData } = data
      const user = await registerUser(userData)
      toast.success('Account created successfully!')
      if (user.role === 'EDUCATOR') navigate('/educator/dashboard')
      else navigate('/student/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 font-bold text-2xl text-blue-600 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            EduFlow
          </div>
          <p className="text-gray-500 text-sm">Create your account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <ErrorAlert message={error} />

            {/* Role Selection */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'STUDENT', label: 'Learn', icon: GraduationCap, desc: 'Enroll in courses' },
                  { value: 'EDUCATOR', label: 'Teach', icon: BookOpen, desc: 'Create courses' },
                ].map(({ value, label, icon: Icon, desc }) => (
                  <button key={value} type="button" onClick={() => setValue('role', value)}
                    className={clsx('flex flex-col items-center gap-1 p-3 border-2 rounded-xl transition-all',
                      selectedRole === value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-600')}>
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-xs opacity-70">{desc}</span>
                  </button>
                ))}
              </div>
              {errors.role && <p className="text-xs text-red-600">{errors.role.message}</p>}
            </div>

            <Input label="Full Name" placeholder="John Doe" error={errors.name?.message} {...register('name')} />
            <Input label="Email address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters"
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('password')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <Input label="Confirm Password" type="password" placeholder="Repeat password"
              error={errors.confirmPassword?.message} {...register('confirmPassword')} />

            <Button type="submit" className="w-full" loading={isSubmitting}>Create Account</Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
