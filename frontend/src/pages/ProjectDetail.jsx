import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../utils/api'
import { BASE_URL } from '../utils/constants'

function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloaded, setDownloaded] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${slug}`)
        setProject(res.data)
      } catch (err) {
        console.error('Failed to fetch project', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [slug])

  const handleDownload = async () => {
    try {
      await api.patch(`/projects/${project._id}/download`)
      setProject(prev => ({ ...prev, downloadCount: prev.downloadCount + 1 }))
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 3000)
    } catch (err) {
      console.error('Failed to update download count', err)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </Layout>
    )
  }

  if (!project) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-sm text-gray-400">Project not found.</p>
          <Link to="/projects" className="text-sm text-indigo-500 hover:text-indigo-600 mt-2 block">
            Back to projects
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* Back link */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-8"
        >
          ← Back to projects
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Main content */}
          <div className="md:col-span-2 space-y-8">

            {/* Title */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl font-medium text-gray-900 dark:text-gray-100 mb-3">
                {project.title}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {project.description}
              </p>
            </div>

            {/* Screenshots */}
            {project.screenshots && project.screenshots.length > 0 && (
              <div className="space-y-3">
                {project.screenshots.map((screenshot, index) => (
                  <div
                    key={index}
                    className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
                  >
                    <img
                      src={screenshot}
                      alt={`${project.title} screenshot ${index + 1}`}
                      className="w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Long description */}
            {project.longDescription && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  About this project
                </h2>
                <div className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                  {project.longDescription}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Download card */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">
                Download
              </p>
              {project.downloadFile ? (
                <>
                  
                  <a  href={project.downloadFile}
                    onClick={handleDownload}
                    download
                    className="block w-full text-center px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    {downloaded ? 'Downloading...' : 'Download'}
                  </a>
                  <p className="text-xs text-gray-400 text-center mt-3">
                    {project.downloadCount} downloads
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-400">No file available yet.</p>
              )}
            </div>

            {/* Project info card */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">
                Details
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Tech Stack</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {project.techStack.join(', ')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Published</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {new Date(project.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ProjectDetail