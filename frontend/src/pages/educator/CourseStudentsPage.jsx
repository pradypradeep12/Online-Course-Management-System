import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { courseApi, enrollmentApi } from '../../api'
import { Spinner, Badge, ProgressBar } from '../../components/ui'
import { ArrowLeft, Users } from 'lucide-react'

export default function CourseStudentsPage() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([courseApi.getPublicById(courseId), enrollmentApi.getCourseEnrollments(courseId)])
      .then(([cr, er]) => { setCourse(cr.data); setEnrollments(er.data) })
      .catch(() => {}).finally(() => setLoading(false))
  }, [courseId])

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><Spinner /></div>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/educator/courses" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to courses
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Enrolled Students</h1>
        <p className="text-gray-500 mt-1">{course?.title} · {enrollments.length} student{enrollments.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="card overflow-hidden">
        {enrollments.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No students enrolled yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {enrollments.map(enrollment => (
              <div key={enrollment.id} className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{enrollment.student.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{enrollment.student.name}</p>
                  <p className="text-sm text-gray-500">{enrollment.student.email}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <ProgressBar value={enrollment.progress} className="w-32" />
                    <span className="text-xs text-gray-500">{enrollment.progress}%</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={enrollment.status === 'COMPLETED' ? 'green' : enrollment.status === 'ACTIVE' ? 'blue' : 'default'}>
                    {enrollment.status}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
