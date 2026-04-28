import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { courseApi } from '../api'
import CourseCard from '../components/CourseCard'
import { Spinner, EmptyState } from '../components/ui'
import { Search, Filter, BookOpen } from 'lucide-react'

const categories = ['All', 'Web Development', 'Backend', 'Data Science', 'Design', 'Mobile', 'DevOps']
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('All')
  const navigate = useNavigate()

  const fetchCourses = () => {
    setLoading(true)
    courseApi.getPublic({
      keyword: keyword || undefined,
      category: category !== 'All' ? category : undefined,
      level: level !== 'All' ? level : undefined,
    }).then(r => setCourses(Array.isArray(r.data) ? r.data : [])).catch(() => setCourses([])).finally(() => setLoading(false))
  }

  useEffect(() => { fetchCourses() }, [category, level])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchCourses()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Courses</h1>
        <p className="text-gray-500">Discover courses taught by expert educators</p>
      </div>

      {/* Search & Filters */}
      <div className="card p-4 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={keyword} onChange={e => setKeyword(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <button type="submit" className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <Search className="w-4 h-4" /> Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mt-4">
          <div className="flex items-center gap-1 text-xs text-gray-500 mr-2">
            <Filter className="w-3.5 h-3.5" /> Category:
          </div>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${category === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          <div className="flex items-center gap-1 text-xs text-gray-500 mr-2">
            <Filter className="w-3.5 h-3.5" /> Level:
          </div>
          {levels.map(l => (
            <button key={l} onClick={() => setLevel(l)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${level === l ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? <Spinner /> : courses.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses found" description="Try adjusting your search or filters" />
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{courses.length} course{courses.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} linkTo={`/courses/${course.id}`} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
