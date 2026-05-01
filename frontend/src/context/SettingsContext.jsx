import { createContext, useState, useContext, useEffect } from 'react'
import api from '../utils/api'
import { BASE_URL } from '../utils/constants'

const SettingsContext = createContext()

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    name: '',
    tagline: '',
    bio: '',
    github: '',
    linkedin: '',
    email: '',
    cvFile: '',
    photo: '',
    title: '',
  skills: [],
  status: '',
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings')
        setSettings(res.data)
      } catch (err) {
        console.error('Failed to fetch settings', err)
      }
    }
    fetchSettings()
  }, [])

  return (
    <SettingsContext.Provider value={{ settings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}