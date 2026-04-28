import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { enrollmentApi } from '../../api'
import { useAuth } from '../../context/AuthContext'
import { Spinner, ProgressBar, Badge } from '../../components/ui'
import { BookOpen, TrendingUp, Award, Clock, ArrowRight } from 'lucide-react'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    enrollmentApi.getMyEnrollments().then(r => setEnrollments(Array.isArray(r.data) ? r.data : [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const active = enrollments.filter(e => e.status === 'ACTIVE').length
  const completed = enrollments.filter(e => e.status === 'COMPLETED').length
  const avgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
    : 0

  const stats = [
    { label: 'Enrolled', value: enrollments.length, icon: BookOpen, color: 'blue' },
    { label: 'In Progress', value: active, icon: TrendingUp, color: 'yellow' },
    { label: 'Completed', value: completed, icon: Award, color: 'green' },
    { label: 'Avg Progress', value: `${avgProgress}%`, icon: Clock, color: 'purple' },
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
          <p className="text-gray-500 mt-1">Continue your learning journey</p>
        </div>
        <Link to="/student/explore" className="btn-primary flex items-center gap-2 self-start">
          <BookOpen className="w-4 h-4" /> Explore Courses
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[color]}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Enrollments */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Continue Learning</h2>
          <Link to="/student/my-courses" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {enrollments.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet</p>
            <Link to="/student/explore" className="btn-primary inline-flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Browse Courses
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {enrollments.slice(0, 5).map(enrollment => (
              <div key={enrollment.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex-shrink-0 overflow-hidden">
                  {enrollment.course.thumbnailUrl ? (
                    <img src={enrollment.course.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white/70" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{enrollment.course.title}</p>
                  <p className="text-xs text-gray-500 mb-1.5">by {enrollment.course.instructor?.name}</p>
                  <div className="flex items-center gap-2">
                    <ProgressBar value={enrollment.progress} className="flex-1 max-w-32" />
                    <span className="text-xs text-gray-500">{enrollment.progress}%</span>
                  </div>
                </div>
                <Badge variant={enrollment.status === 'COMPLETED' ? 'green' : 'blue'}>
                  {enrollment.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
