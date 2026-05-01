import { useState, useEffect, useRef } from 'react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../utils/api'

function AdminSite() {
  const [form, setForm] = useState({
    name: '',
    tagline: '',
    bio: '',
    github: '',
    linkedin: '',
    email: '',
    title: '',
    skills: '',
    status: '',
  })
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [cvFile, setCvFile] = useState(null)
  const [currentCv, setCurrentCv] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const photoInputRef = useRef(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings')
        const s = res.data
        setForm({
          name: s.name || '',
          tagline: s.tagline || '',
          bio: s.bio || '',
          github: s.github || '',
          linkedin: s.linkedin || '',
          email: s.email || '',
          title: s.title || '',
          skills: s.skills ? s.skills.join(', ') : '',
          status: s.status || '',
        })
        if (s.photo) setPhotoPreview(s.photo)
        if (s.cvFile) setCurrentCv(s.cvFile)
      } catch (err) {
        console.error('Failed to fetch settings', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('tagline', form.tagline)
      formData.append('bio', form.bio)
      formData.append('github', form.github)
      formData.append('linkedin', form.linkedin)
      formData.append('email', form.email)
      formData.append('title', form.title)
      formData.append('skills', form.skills)
      formData.append('status', form.status)
      if (photoFile) formData.append('photo', photoFile)
      if (cvFile) formData.append('cvFile', cvFile)

      await api.put('/settings', formData)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Failed to save settings', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-sm text-gray-400">Loading...</p>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-1">
          Site Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Update your portfolio content without touching code.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Profile header card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-5">
            Identity
          </p>

          <div className="flex flex-col sm:flex-row gap-6 items-start">

            {/* Photo */}
            <div className="shrink-0">
              <div
                onClick={() => photoInputRef.current.click()}
                className="relative w-28 h-38 rounded-2xl overflow-hidden cursor-pointer group border border-gray-200 dark:border-gray-700"
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-3xl font-medium text-indigo-600 dark:text-indigo-400">
                    {form.name ? form.name.charAt(0) : 'Y'}
                  </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-xs font-medium text-center px-2">
                    Click to change
                  </p>
                </div>
              </div>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              {/* <p className="text-xs text-gray-400 mt-2 text-center">
                Profile photo
              </p> */}
            </div>

            {/* Name, title, status */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Software Developer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Status Badge
                </label>
                <input
                  type="text"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="available for freelance"
                />
                {/* <p className="text-xs text-gray-400 mt-1">
                  Shown as a small badge on your homepage hero card
                </p> */}
              </div>
            </div>

          </div>
        </div>

        {/* Bio and tagline */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-5">
            About
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Tagline
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="I build tools that automate the boring stuff"
              />
              {/* <p className="text-xs text-gray-400 mt-1">
                The large heading on your homepage hero card
              </p> */}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Bio
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={5}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Write a short bio about yourself..."
              />
              {/* <p className="text-xs text-gray-400 mt-1">
                Shown on your homepage and About page
              </p> */}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Skills
              </label>
              <input
                type="text"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Python, MERN, Automation"
              />
              <p className="text-xs text-gray-400 mt-1">
                Separate with commas.
              </p>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-5">
            Links
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                GitHub
              </label>
              <input
                type="url"
                value={form.github}
                onChange={(e) => setForm({ ...form, github: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                LinkedIn
              </label>
              <input
                type="url"
                value={form.linkedin}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="your@email.com"
              />
            </div>
          </div>
        </div>

        {/* Files */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-5">
            Files
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              CV / Resume
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setCvFile(e.target.files[0])}
              className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
            />
            {currentCv && (
              <p className="text-xs text-gray-400 mt-2">
                Current file: {currentCv}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              PDF only. Appears as a download button on your About page.
            </p>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>

      </form>
    </AdminLayout>
  )
}

export default AdminSite