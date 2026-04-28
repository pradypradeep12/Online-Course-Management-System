import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { courseApi, enrollmentApi } from '../../api'
import { useAuth } from '../../context/AuthContext'
import { Spinner, Badge } from '../../components/ui'
import { BookOpen, Users, TrendingUp, Plus, ArrowRight, Eye } from 'lucide-react'

export default function EducatorDashboard() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalStudents, setTotalStudents] = useState(0)

  useEffect(() => {
    courseApi.getMyCourses().then(async r => {
      const data = Array.isArray(r.data) ? r.data : []
      setCourses(data)
      let total = 0
      for (const c of data) {
        try {
          const er = await enrollmentApi.getCourseEnrollments(c.id)
          total += er.data.length
        } catch {}
      }
      setTotalStudents(total)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const published = courses.filter(c => c.status === 'PUBLISHED').length
  const drafts = courses.filter(c => c.status === 'DRAFT').length

  const stats = [
    { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'blue' },
    { label: 'Published', value: published, icon: Eye, color: 'green' },
    { label: 'Drafts', value: drafts, icon: TrendingUp, color: 'yellow' },
    { label: 'Total Students', value: totalStudents, icon: Users, color: 'purple' },
  ]

  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"><Spinner /></div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
          <p className="text-gray-500 mt-1">Here's an overview of your teaching activity</p>
        </div>
        <Link to="/educator/courses/new" className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> New Course
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Courses */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Courses</h2>
          <Link to="/educator/courses" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {courses.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No courses yet. Create your first course!</p>
            <Link to="/educator/courses/new" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Course
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {courses.slice(0, 5).map(course => (
              <div key={course.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex-shrink-0 overflow-hidden">
                  {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white/70" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{course.title}</p>
                  <p className="text-sm text-gray-500">{course.lessonCount} lessons · {course.enrollmentCount} students</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={course.status === 'PUBLISHED' ? 'green' : course.status === 'DRAFT' ? 'yellow' : 'default'}>
                    {course.status}
                  </Badge>
                  <Link to={`/educator/courses/${course.id}/edit`} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
