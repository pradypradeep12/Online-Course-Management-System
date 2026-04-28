import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

// Courses
export const courseApi = {
  getPublic: (params) => api.get('/courses/public', { params }),
  getPublicById: (id) => api.get(`/courses/public/${id}`),
  getMyCourses: () => api.get('/courses/my'),
  getAll: () => api.get('/courses'),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
}

// Lessons
export const lessonApi = {
  getByCoure: (courseId) => api.get(`/courses/${courseId}/lessons`),
  create: (courseId, data) => api.post(`/courses/${courseId}/lessons`, data),
  update: (courseId, lessonId, data) => api.put(`/courses/${courseId}/lessons/${lessonId}`, data),
  delete: (courseId, lessonId) => api.delete(`/courses/${courseId}/lessons/${lessonId}`),
}

// Enrollments
export const enrollmentApi = {
  getMyEnrollments: () => api.get('/enrollments/my'),
  getCourseEnrollments: (courseId) => api.get(`/enrollments/course/${courseId}`),
  enroll: (courseId) => api.post(`/enrollments/course/${courseId}`),
  updateProgress: (enrollmentId, data) => api.patch(`/enrollments/${enrollmentId}/progress`, data),
  unenroll: (enrollmentId) => api.delete(`/enrollments/${enrollmentId}`),
}

// Users
export const userApi = {
  getMe: () => api.get('/users/me'),
  getAll: () => api.get('/users'),
}

export default api
