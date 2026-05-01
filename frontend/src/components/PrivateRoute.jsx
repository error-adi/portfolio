import { Navigate, Outlet } from 'react-router-dom'

export default function PrivateRoute() {
  const token = localStorage.getItem('adminToken')
  return token ? <Outlet /> : <Navigate to="/admin/login" />
}