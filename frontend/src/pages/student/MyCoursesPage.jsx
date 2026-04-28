import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { enrollmentApi } from '../../api'
import { Spinner, Badge, ProgressBar, Button, EmptyState, Modal } from '../../components/ui'
import { BookOpen, TrendingUp, Trash2, Play } from 'lucide-react'
import toast from 'react-hot-toast'

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [progressModal, setProgressModal] = useState(null)
  const [progressValue, setProgressValue] = useState(0)
  const [updating, setUpdating] = useState(false)
  const [filter, setFilter] = useState('ALL')

  const fetchEnrollments = () => {
    enrollmentApi.getMyEnrollments().then(r => setEnrollments(r.data)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetchEnrollments() }, [])

  const handleUnenroll = async (enrollmentId, title) => {
    if (!confirm(`Unenroll from "${title}"?`)) return
    try {
      await enrollmentApi.unenroll(enrollmentId)
      toast.success('Unenrolled successfully')
      setEnrollments(prev => prev.filter(e => e.id !== enrollmentId))
    } catch {
      toast.error('Failed to unenroll')
    }
  }

  const openProgressModal = (enrollment) => {
    setProgressModal(enrollment)
    setProgressValue(enrollment.progress)
  }

  const handleUpdateProgress = async () => {
    setUpdating(true)
    try {
      await enrollmentApi.updateProgress(progressModal.id, { progress: progressValue })
      toast.success('Progress updated!')
      setProgressModal(null)
      fetchEnrollments()
    } catch {
      toast.error('Failed to update progress')
    } finally {
      setUpdating(false)
    }
  }

  const filtered = filter === 'ALL' ? enrollments : enrollments.filter(e => e.status === filter)

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"><Spinner /></div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-500 mt-1">{enrollments.length} enrolled course{enrollments.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/student/explore" className="btn-primary flex items-center gap-2 self-start">
          <BookOpen className="w-4 h-4" /> Find More Courses
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['ALL', 'ACTIVE', 'COMPLETED'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses here"
          description={filter === 'ALL' ? "You haven't enrolled in any courses yet" : `No ${filter.toLowerCase()} courses`}
          action={filter === 'ALL' && <Link to="/student/explore" className="btn-primary inline-flex items-center gap-2"><BookOpen className="w-4 h-4" />Browse Courses</Link>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(enrollment => (
            <div key={enrollment.id} className="card overflow-hidden flex flex-col">
              <div className="relative h-40 bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden">
                {enrollment.course.thumbnailUrl ? (
                  <img src={enrollment.course.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-white/60" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge variant={enrollment.status === 'COMPLETED' ? 'green' : 'blue'}>{enrollment.status}</Badge>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{enrollment.course.title}</h3>
                <p className="text-xs text-gray-500 mb-3">by {enrollment.course.instructor?.name}</p>

                <div className="mt-auto space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span className="font-medium">{enrollment.progress}%</span>
                    </div>
                    <ProgressBar value={enrollment.progress} />
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => openProgressModal(enrollment)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 px-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                      <TrendingUp className="w-3.5 h-3.5" /> Update Progress
                    </button>
                    <button onClick={() => handleUnenroll(enrollment.id, enrollment.course.title)}
                      className="flex items-center justify-center p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progress Modal */}
      <Modal isOpen={!!progressModal} onClose={() => setProgressModal(null)} title="Update Progress" size="sm">
        {progressModal && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">{progressModal.course.title}</p>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-bold text-blue-600">{progressValue}%</span>
              </div>
              <input type="range" min="0" max="100" value={progressValue}
                onChange={e => setProgressValue(parseInt(e.target.value))}
                className="w-full accent-blue-600" />
              <ProgressBar value={progressValue} className="mt-2" />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleUpdateProgress} loading={updating} className="flex-1">Save Progress</Button>
              <Button variant="secondary" onClick={() => setProgressModal(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
