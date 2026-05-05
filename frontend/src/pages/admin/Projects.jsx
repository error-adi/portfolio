import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../utils/api'

function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  const emptyForm = {
    title: '',
    slug: '',
    description: '',
    longDescription: '',
    techStack: '',
    downloadFile: '',
    isPublished: false,
  }

  const [form, setForm] = useState(emptyForm)
  // const [downloadFile, setDownloadFile] = useState(null)
  const [screenshots, setScreenshots] = useState([])
  const [saving, setSaving] = useState(false)

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects/all')
      setProjects(res.data)
    } catch (err) {
      console.error('Failed to fetch projects', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleEdit = (project) => {
    setEditingProject(project)
    setForm({
      title: project.title,
      slug: project.slug,
      description: project.description,
      longDescription: project.longDescription || '',
      techStack: project.techStack.join(','),
      downloadFile: project.downloadFile || '',
      isPublished: project.isPublished,
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return
    try {
      await api.delete(`/projects/${id}`)
      fetchProjects()
    } catch (err) {
      console.error('Failed to delete project', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('slug', form.slug)
      formData.append('description', form.description)
      formData.append('longDescription', form.longDescription)
      formData.append('techStack', form.techStack)
      formData.append('isPublished', form.isPublished)

      formData.append('downloadFile', form.downloadFile)
      if (screenshots.length > 0) {
        screenshots.forEach(f => formData.append('screenshots', f))
      }

      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, formData)
      } else {
        await api.post('/projects', formData)
      }

      setForm(emptyForm)
      // setDownloadFile(null)
      setScreenshots([])
      setEditingProject(null)
      setShowForm(false)
      fetchProjects()
    } catch (err) {
      console.error('Failed to save project', err)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setForm(emptyForm)
    setDownloadFile(null)
    setScreenshots([])
    setEditingProject(null)
    setShowForm(false)
  }

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-1">
            Projects
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your portfolio projects.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Add Project
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
            {editingProject ? 'Edit Project' : 'New Project'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => {
                    setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })
                  }}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Web Scraper v1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Slug
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="web-scraper-v1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Short Description
              </label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="A short description shown on the project card"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Full Description
              </label>
              <textarea
                value={form.longDescription}
                onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
                rows={5}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Full details shown on the project page..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Tech Stack
              </label>
              <input
                type="text"
                value={form.techStack}
                onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Python, BeautifulSoup, Selenium"
              />
              <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Download File
                </label>
                <input
                  type="file"
                  onChange={(e) => setDownloadFile(e.target.files[0])}
                  className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                />
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Download Link
                </label>
                <input
                  type="url"
                  value={form.downloadFile}
                  onChange={(e) => setForm({ ...form, downloadFile: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://drive.google.com/..."
                />
                <p className="text-xs text-gray-400 mt-1">Paste a Google Drive or any direct download link</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Screenshots
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setScreenshots(Array.from(e.target.files))}
                  className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="isPublished" className="text-sm text-gray-700 dark:text-gray-300">
                Publish immediately
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Projects list */}
      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No projects yet. Add your first one.
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {project.title}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    project.isPublished
                      ? 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}>
                    {project.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {project.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {project.downloadCount} downloads
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-950 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminProjects