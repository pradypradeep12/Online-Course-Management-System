import { useEffect, useState } from 'react'
import { courseApi, userApi } from '../../api'
import { Spinner, Badge } from '../../components/ui'
import { Users, BookOpen, GraduationCap, Shield } from 'lucide-react'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([userApi.getAll(), courseApi.getAll()])
      .then(([ur, cr]) => { setUsers(Array.isArray(ur.data) ? ur.data : []); setCourses(Array.isArray(cr.data) ? cr.data : []) })
      .catch(() => {}).finally(() => setLoading(false))
  }, [])

  const educators = users.filter(u => u.role === 'EDUCATOR').length
  const students = users.filter(u => u.role === 'STUDENT').length
  const published = courses.filter(c => c.status === 'PUBLISHED').length

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'blue' },
    { label: 'Educators', value: educators, icon: Shield, color: 'purple' },
    { label: 'Students', value: students, icon: GraduationCap, color: 'green' },
    { label: 'Published Courses', value: published, icon: BookOpen, color: 'yellow' },
  ]

  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  const roleColors = { ADMIN: 'red', EDUCATOR: 'purple', STUDENT: 'blue' }

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"><Spinner /></div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and management</p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">All Users</h2>
          </div>
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {users.map(user => (
              <div key={user.id} className="flex items-center gap-3 p-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{user.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <Badge variant={roleColors[user.role] || 'default'}>{user.role}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">All Courses</h2>
          </div>
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {courses.map(course => (
              <div key={course.id} className="flex items-center gap-3 p-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex-shrink-0 overflow-hidden">
                  {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-white/70" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                  <p className="text-xs text-gray-500">{course.instructor?.name} · {course.enrollmentCount} students</p>
                </div>
                <Badge variant={course.status === 'PUBLISHED' ? 'green' : course.status === 'DRAFT' ? 'yellow' : 'default'}>
                  {course.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
