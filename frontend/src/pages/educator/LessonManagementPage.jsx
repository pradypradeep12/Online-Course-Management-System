import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { courseApi, lessonApi } from '../../api'
import { Input, Textarea, Button, Modal, ErrorAlert, Spinner, EmptyState } from '../../components/ui'
import { Plus, Edit, Trash2, ArrowLeft, BookOpen, GripVertical } from 'lucide-react'
import toast from 'react-hot-toast'

const schema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  content: z.string().optional(),
  videoUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  orderIndex: z.coerce.number().min(1).optional(),
  duration: z.coerce.number().min(1).optional(),
})

export default function LessonManagementPage() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState(null)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  const fetchData = () => {
    Promise.all([courseApi.getPublicById(courseId), lessonApi.getByCoure(courseId)])
      .then(([cr, lr]) => { setCourse(cr.data); setLessons(lr.data) })
      .catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [courseId])

  const openCreate = () => {
    setEditingLesson(null)
    reset({ title: '', content: '', videoUrl: '', orderIndex: lessons.length + 1, duration: 15 })
    setError('')
    setModalOpen(true)
  }

  const openEdit = (lesson) => {
    setEditingLesson(lesson)
    reset({ title: lesson.title, content: lesson.content || '', videoUrl: lesson.videoUrl || '', orderIndex: lesson.orderIndex, duration: lesson.duration })
    setError('')
    setModalOpen(true)
  }

  const onSubmit = async (data) => {
    setError('')
    try {
      if (editingLesson) {
        await lessonApi.update(courseId, editingLesson.id, data)
        toast.success('Lesson updated!')
      } else {
        await lessonApi.create(courseId, data)
        toast.success('Lesson created!')
      }
      setModalOpen(false)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save lesson')
    }
  }

  const handleDelete = async (lessonId, title) => {
    if (!confirm(`Delete "${title}"?`)) return
    setDeleting(lessonId)
    try {
      await lessonApi.delete(courseId, lessonId)
      toast.success('Lesson deleted')
      setLessons(prev => prev.filter(l => l.id !== lessonId))
    } catch {
      toast.error('Failed to delete lesson')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><Spinner /></div>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/educator/courses" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to courses
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Lessons</h1>
          <p className="text-gray-500 mt-1">{course?.title}</p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2 self-start">
          <Plus className="w-4 h-4" /> Add Lesson
        </Button>
      </div>

      <div className="card overflow-hidden">
        {lessons.length === 0 ? (
          <EmptyState icon={BookOpen} title="No lessons yet"
            description="Add your first lesson to get started"
            action={<Button onClick={openCreate} className="flex items-center gap-2"><Plus className="w-4 h-4" />Add Lesson</Button>} />
        ) : (
          <div className="divide-y divide-gray-100">
            {lessons.map((lesson, idx) => (
              <div key={lesson.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group">
                <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold text-blue-600">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{lesson.title}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    {lesson.duration && <span>{lesson.duration} min</span>}
                    {lesson.videoUrl && <span className="text-blue-500">Has video</span>}
                    {lesson.content && <span>Has content</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(lesson)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(lesson.id, lesson.title)} disabled={deleting === lesson.id}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={editingLesson ? 'Edit Lesson' : 'Add New Lesson'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ErrorAlert message={error} />
          <Input label="Lesson Title *" placeholder="e.g. Introduction to React" error={errors.title?.message} {...register('title')} />
          <Textarea label="Content" placeholder="Lesson content or notes..." rows={4} error={errors.content?.message} {...register('content')} />
          <Input label="Video URL" type="url" placeholder="https://youtube.com/..." error={errors.videoUrl?.message} {...register('videoUrl')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Order" type="number" min="1" error={errors.orderIndex?.message} {...register('orderIndex')} />
            <Input label="Duration (min)" type="number" min="1" error={errors.duration?.message} {...register('duration')} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={isSubmitting} className="flex-1">
              {editingLesson ? 'Save Changes' : 'Add Lesson'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
