import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// allowedRoles is optional — leave it off (as every route currently does) to
// only require login, no role restriction yet. Once the team locks the real
// permission matrix, individual routes in App.jsx can pass e.g.
// allowedRoles={['Fleet Manager']} and this will redirect anyone else to
// /dashboard instead of letting them see the page.
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isLoggedIn, role } = useAuth()

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
