import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { BookOpen, Menu, X, LogOut, User, LayoutDashboard, GraduationCap, BookMarked } from 'lucide-react'
import { clsx } from 'clsx'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileOpen(false)
  }

  const educatorLinks = [
    { to: '/educator/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/educator/courses', label: 'My Courses', icon: BookMarked },
  ]
  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/explore', label: 'Explore', icon: BookOpen },
    { to: '/student/my-courses', label: 'My Courses', icon: GraduationCap },
  ]
  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ]

  const links = user?.role === 'EDUCATOR' ? educatorLinks : user?.role === 'STUDENT' ? studentLinks : adminLinks

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            EduFlow
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated && links.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}
                className={clsx('flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive(to) ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')}>
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            {!isAuthenticated && (
              <>
                <Link to="/courses" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2">Browse Courses</Link>
              </>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user.name[0].toUpperCase()}</span>
                  </div>
                  <div className="text-xs">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-gray-500 capitalize">{user.role.toLowerCase()}</p>
                  </div>
                </div>
                <button onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
          {isAuthenticated && links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)}
              className={clsx('flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium',
                isActive(to) ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100')}>
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          {!isAuthenticated && (
            <>
              <Link to="/courses" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Browse Courses</Link>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg">Get Started</Link>
            </>
          )}
          {isAuthenticated && (
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
