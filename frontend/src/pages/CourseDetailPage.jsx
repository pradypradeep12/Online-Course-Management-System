import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { courseApi, lessonApi, enrollmentApi } from '../api'
import { useAuth } from '../context/AuthContext'
import { Spinner, Badge, Button, ErrorAlert } from '../components/ui'
import { Clock, Users, BookOpen, ChevronRight, Play, Lock, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const levelColors = { Beginner: 'green', Intermediate: 'blue', Advanced: 'purple' }

export default function CourseDetailPage() {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [error, setError] = useState('')
  const [isEnrolled, setIsEnrolled] = useState(false)

  useEffect(() => {
    Promise.all([
      courseApi.getPublicById(id),
      lessonApi.getByCoure(id),
    ]).then(([courseRes, lessonsRes]) => {
      setCourse(courseRes.data)
      setLessons(lessonsRes.data)
    }).catch(() => navigate('/courses'))
    .finally(() => setLoading(false))

    if (isAuthenticated && user?.role === 'STUDENT') {
      enrollmentApi.getMyEnrollments().then(r => {
        setIsEnrolled(r.data.some(e => e.course.id === parseInt(id)))
      }).catch(() => {})
    }
  }, [id])

  const handleEnroll = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    setEnrolling(true)
    setError('')
    try {
      await enrollmentApi.enroll(id)
      setIsEnrolled(true)
      toast.success('Successfully enrolled!')
      navigate('/student/my-courses')
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed')
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"><Spinner /></div>
  if (!course) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/courses" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to courses
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            {course.category && <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">{course.category}</span>}
            <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-3">{course.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {course.level && <Badge variant={levelColors[course.level] || 'default'}>{course.level}</Badge>}
              <span className="text-sm text-gray-500 flex items-center gap-1"><Users className="w-4 h-4" />{course.enrollmentCount} students</span>
              <span className="text-sm text-gray-500 flex items-center gap-1"><BookOpen className="w-4 h-4" />{course.lessonCount} lessons</span>
              {course.duration && <span className="text-sm text-gray-500 flex items-center gap-1"><Clock className="w-4 h-4" />{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>}
            </div>
            <p className="text-gray-600 leading-relaxed">{course.description}</p>
          </div>

          {/* Instructor */}
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Instructor</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{course.instructor?.name[0]}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{course.instructor?.name}</p>
                <p className="text-sm text-gray-500">Educator</p>
              </div>
            </div>
          </div>

          {/* Lessons */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Course Content</h3>
              <p className="text-sm text-gray-500">{lessons.length} lessons</p>
            </div>
            <div className="divide-y divide-gray-100">
              {lessons.map((lesson, idx) => (
                <div key={lesson.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    {isEnrolled ? <Play className="w-4 h-4 text-blue-600" /> : <Lock className="w-4 h-4 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{lesson.title}</p>
                    {lesson.duration && <p className="text-xs text-gray-500">{lesson.duration} min</p>}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              ))}
              {lessons.length === 0 && (
                <div className="p-8 text-center text-sm text-gray-500">No lessons yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card overflow-hidden sticky top-24">
            {course.thumbnailUrl && (
              <img src={course.thumbnailUrl} alt={course.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-6 space-y-4">
              <div className="text-3xl font-bold text-gray-900">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </div>

              <ErrorAlert message={error} />

              {user?.role === 'STUDENT' && (
                isEnrolled ? (
                  <Button variant="success" className="w-full" onClick={() => navigate('/student/my-courses')}>
                    Go to My Courses
                  </Button>
                ) : (
                  <Button className="w-full" loading={enrolling} onClick={handleEnroll}>
                    Enroll Now
                  </Button>
                )
              )}
              {!isAuthenticated && (
                <Button className="w-full" onClick={() => navigate('/login')}>
                  Login to Enroll
                </Button>
              )}
              {user?.role === 'EDUCATOR' && (
                <p className="text-sm text-center text-gray-500">Educators cannot enroll in courses</p>
              )}

              <div className="space-y-2 pt-2 border-t border-gray-100">
                {[
                  ['Category', course.category],
                  ['Level', course.level],
                  ['Duration', course.duration ? `${Math.floor(course.duration / 60)}h ${course.duration % 60}m` : null],
                  ['Lessons', course.lessonCount],
                  ['Students', course.enrollmentCount],
                ].filter(([, v]) => v != null).map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
