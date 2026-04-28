import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { courseApi } from '../api'
import CourseCard from '../components/CourseCard'
import { Spinner } from '../components/ui'
import { BookOpen, Users, Award, TrendingUp, ArrowRight, Star } from 'lucide-react'

const stats = [
  { icon: BookOpen, label: 'Courses', value: '500+' },
  { icon: Users, label: 'Students', value: '10K+' },
  { icon: Award, label: 'Instructors', value: '200+' },
  { icon: TrendingUp, label: 'Completion Rate', value: '94%' },
]

export default function HomePage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    courseApi.getPublic({}).then(r => setCourses((Array.isArray(r.data) ? r.data : []).slice(0, 6))).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-700/50 border border-blue-500/30 rounded-full px-4 py-1.5 text-sm mb-6">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>Trusted by 10,000+ learners worldwide</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Learn Without <span className="text-blue-300">Limits</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-xl">
              Access world-class courses from expert educators. Build skills that matter and advance your career.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/courses" className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
                Explore Courses <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 bg-blue-600 border border-blue-400 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-500 transition-colors">
                Start Teaching
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Courses</h2>
            <p className="text-gray-500 mt-1">Handpicked courses to get you started</p>
          </div>
          <Link to="/courses" className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? <Spinner /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} linkTo={`/courses/${course.id}`} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Teaching?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">Share your knowledge with thousands of students. Create your first course today.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
            Become an Educator <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            EduFlow
          </div>
          <p className="text-sm">© 2024 EduFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
