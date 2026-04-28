import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { courseApi } from '../../api'
import CourseCard from '../../components/CourseCard'
import { Button, EmptyState, Spinner, Badge } from '../../components/ui'
import { Plus, BookOpen, Edit, Trash2, Users, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EducatorCoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const navigate = useNavigate()

  const fetchCourses = () => {
    setLoading(true)
    courseApi.getMyCourses().then(r => setCourses(r.data)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetchCourses() }, [])

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await courseApi.delete(id)
      toast.success('Course deleted')
      setCourses(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"><Spinner /></div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-500 mt-1">{courses.length} course{courses.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/educator/courses/new" className="btn-primary flex items-center gap-2 self-start">
          <Plus className="w-4 h-4" /> New Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses yet"
          description="Create your first course and start teaching students worldwide"
          action={<Link to="/educator/courses/new" className="btn-primary inline-flex items-center gap-2"><Plus className="w-4 h-4" />Create Course</Link>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard key={course.id} course={course}
              actions={
                <div className="flex gap-2">
                  <Link to={`/educator/courses/${course.id}/lessons`}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 px-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
                    <BookOpen className="w-3.5 h-3.5" /> Lessons
                  </Link>
                  <Link to={`/educator/courses/${course.id}/students`}
                    className="flex items-center justify-center gap-1.5 text-xs py-1.5 px-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
                    <Users className="w-3.5 h-3.5" />
                  </Link>
                  <Link to={`/educator/courses/${course.id}/edit`}
                    className="flex items-center justify-center gap-1.5 text-xs py-1.5 px-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-blue-600">
                    <Edit className="w-3.5 h-3.5" />
                  </Link>
                  <button onClick={() => handleDelete(course.id, course.title)} disabled={deleting === course.id}
                    className="flex items-center justify-center gap-1.5 text-xs py-1.5 px-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600 disabled:opacity-50">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
