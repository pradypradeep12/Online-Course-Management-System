import { Link } from 'react-router-dom'
import { Clock, Users, BookOpen, Star } from 'lucide-react'
import { Badge } from './ui'
import { clsx } from 'clsx'

const levelColors = { Beginner: 'green', Intermediate: 'blue', Advanced: 'purple' }
const statusColors = { PUBLISHED: 'green', DRAFT: 'yellow', ARCHIVED: 'default' }

export default function CourseCard({ course, actions, linkTo }) {
  const CardWrapper = linkTo ? Link : 'div'
  return (
    <CardWrapper to={linkTo} className={clsx('card overflow-hidden flex flex-col group', linkTo && 'hover:shadow-md transition-shadow duration-200')}>
      {/* Thumbnail */}
      <div className="relative h-44 bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden">
        {course.thumbnailUrl ? (
          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-white/60" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {course.status && <Badge variant={statusColors[course.status]}>{course.status}</Badge>}
          {course.level && <Badge variant={levelColors[course.level] || 'default'}>{course.level}</Badge>}
        </div>
        {course.price !== undefined && (
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
            <span className="text-sm font-bold text-gray-900">{course.price === 0 ? 'Free' : `$${course.price}`}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {course.category && (
          <span className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">{course.category}</span>
        )}
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 leading-snug">{course.title}</h3>
        {course.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">{course.description}</p>
        )}
        {course.instructor && (
          <p className="text-xs text-gray-500 mb-3">by <span className="font-medium text-gray-700">{course.instructor.name}</span></p>
        )}

        <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
          {course.lessonCount !== undefined && (
            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{course.lessonCount} lessons</span>
          )}
          {course.enrollmentCount !== undefined && (
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{course.enrollmentCount} students</span>
          )}
          {course.duration && (
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
          )}
        </div>

        {actions && <div className="mt-3 pt-3 border-t border-gray-100">{actions}</div>}
      </div>
    </CardWrapper>
  )
}
