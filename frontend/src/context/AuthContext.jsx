import { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null)

  const login = (newToken) => {
    localStorage.setItem('adminToken', newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}