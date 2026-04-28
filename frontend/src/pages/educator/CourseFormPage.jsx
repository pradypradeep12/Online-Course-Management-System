import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { courseApi } from '../../api'
import { Input, Select, Textarea, Button, ErrorAlert } from '../../components/ui'
import { ArrowLeft, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  level: z.string().min(1, 'Please select a level'),
  price: z.coerce.number().min(0, 'Price must be 0 or more'),
  thumbnailUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 minute').optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
})

const categories = ['Web Development', 'Backend', 'Data Science', 'Design', 'Mobile', 'DevOps', 'Other']
const levels = ['Beginner', 'Intermediate', 'Advanced']

export default function CourseFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(isEdit)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: 'DRAFT', price: 0 },
  })

  useEffect(() => {
    if (isEdit) {
      courseApi.getPublicById(id).then(r => {
        const c = r.data
        reset({
          title: c.title, description: c.description, category: c.category,
          level: c.level, price: c.price, thumbnailUrl: c.thumbnailUrl || '',
          duration: c.duration, status: c.status,
        })
      }).catch(() => navigate('/educator/courses'))
      .finally(() => setLoading(false))
    }
  }, [id])

  const onSubmit = async (data) => {
    setError('')
    try {
      if (isEdit) {
        await courseApi.update(id, data)
        toast.success('Course updated!')
      } else {
        const res = await courseApi.create(data)
        toast.success('Course created!')
        navigate(`/educator/courses/${res.data.id}/lessons`)
        return
      }
      navigate('/educator/courses')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save course')
    }
  }

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-8 text-center text-gray-500">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/educator/courses" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to courses
      </Link>

      <div className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Course' : 'Create New Course'}</h1>
            <p className="text-sm text-gray-500">{isEdit ? 'Update your course details' : 'Fill in the details to create your course'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <ErrorAlert message={error} />

          <Input label="Course Title *" placeholder="e.g. Complete React Development" error={errors.title?.message} {...register('title')} />

          <Textarea label="Description *" placeholder="Describe what students will learn..." rows={4} error={errors.description?.message} {...register('description')} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Category *" error={errors.category?.message} {...register('category')}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select label="Level *" error={errors.level?.message} {...register('level')}>
              <option value="">Select level</option>
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Price ($)" type="number" step="0.01" min="0" placeholder="0.00" error={errors.price?.message} {...register('price')} />
            <Input label="Duration (minutes)" type="number" min="1" placeholder="e.g. 120" error={errors.duration?.message} {...register('duration')} />
          </div>

          <Input label="Thumbnail URL" type="url" placeholder="https://example.com/image.jpg" error={errors.thumbnailUrl?.message} {...register('thumbnailUrl')} />

          <Select label="Status" error={errors.status?.message} {...register('status')}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </Select>

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={isSubmitting} className="flex-1">
              {isEdit ? 'Save Changes' : 'Create Course'}
            </Button>
            <Link to="/educator/courses" className="btn-secondary flex items-center justify-center px-6">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
