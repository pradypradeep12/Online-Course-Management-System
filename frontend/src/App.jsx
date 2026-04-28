import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'

// Pages
import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'
import CourseDetailPage from './pages/CourseDetailPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import EducatorDashboard from './pages/educator/EducatorDashboard'
import EducatorCoursesPage from './pages/educator/EducatorCoursesPage'
import CourseFormPage from './pages/educator/CourseFormPage'
import LessonManagementPage from './pages/educator/LessonManagementPage'
import CourseStudentsPage from './pages/educator/CourseStudentsPage'
import StudentDashboard from './pages/student/StudentDashboard'
import MyCoursesPage from './pages/student/MyCoursesPage'
import ExplorePage from './pages/student/ExplorePage'
import AdminDashboard from './pages/admin/AdminDashboard'

function ProtectedRoute({ children, roles }) {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />
  return children
}

function GuestRoute({ children }) {
  const { isAuthenticated, user } = useAuth()
  if (isAuthenticated) {
    if (user?.role === 'EDUCATOR') return <Navigate to="/educator/dashboard" replace />
    if (user?.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />
    return <Navigate to="/admin/dashboard" replace />
  }
  return children
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/courses" element={<Layout><CoursesPage /></Layout>} />
      <Route path="/courses/:id" element={<Layout><CourseDetailPage /></Layout>} />

      {/* Auth */}
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* Educator */}
      <Route path="/educator/dashboard" element={
        <ProtectedRoute roles={['EDUCATOR', 'ADMIN']}>
          <Layout><EducatorDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/educator/courses" element={
        <ProtectedRoute roles={['EDUCATOR', 'ADMIN']}>
          <Layout><EducatorCoursesPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/educator/courses/new" element={
        <ProtectedRoute roles={['EDUCATOR', 'ADMIN']}>
          <Layout><CourseFormPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/educator/courses/:id/edit" element={
        <ProtectedRoute roles={['EDUCATOR', 'ADMIN']}>
          <Layout><CourseFormPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/educator/courses/:courseId/lessons" element={
        <ProtectedRoute roles={['EDUCATOR', 'ADMIN']}>
          <Layout><LessonManagementPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/educator/courses/:courseId/students" element={
        <ProtectedRoute roles={['EDUCATOR', 'ADMIN']}>
          <Layout><CourseStudentsPage /></Layout>
        </ProtectedRoute>
      } />

      {/* Student */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute roles={['STUDENT']}>
          <Layout><StudentDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/explore" element={
        <ProtectedRoute roles={['STUDENT']}>
          <Layout><ExplorePage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/my-courses" element={
        <ProtectedRoute roles={['STUDENT']}>
          <Layout><MyCoursesPage /></Layout>
        </ProtectedRoute>
      } />

      {/* Admin */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute roles={['ADMIN']}>
          <Layout><AdminDashboard /></Layout>
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{
          duration: 3000,
          style: { borderRadius: '10px', fontSize: '14px' },
        }} />
      </AuthProvider>
    </BrowserRouter>
  )
}
