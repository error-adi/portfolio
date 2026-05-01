import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../utils/api'
import { BASE_URL } from '../utils/constants'

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects')
        setProjects(res.data)
      } catch (err) {
        console.error('Failed to fetch projects', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-medium text-gray-900 dark:text-gray-100 mb-3">
            Projects
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Tools and software I've built. Download and try them out.
          </p>
        </div>

        {/* Projects grid */}
        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : projects.length === 0 ? (
          <p className="text-sm text-gray-400">No projects yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 flex flex-col justify-between group hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
              >
                {/* Screenshot */}
                {project.screenshots && project.screenshots.length > 0 && (
                  <div className="mb-4 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 aspect-video">
                    <img
                      src={`${BASE_URL}/uploads/${project.screenshots[0]}`}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1">
                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {project.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <span className="text-xs text-gray-400">
                    {project.downloadCount} downloads
                  </span>
                  <div className="flex gap-2">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Details
                    </Link>
                    {project.downloadFile && (
                      
                      <a  href={`${BASE_URL}/uploads/${project.downloadFile}`}
                        onClick={async () => {
                          await api.patch(`/projects/${project._id}/download`)
                          setProjects(prev =>
                            prev.map(p =>
                              p._id === project._id
                                ? { ...p, downloadCount: p.downloadCount + 1 }
                                : p
                            )
                          )
                        }}
                        download
                        className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
                      >
                        Download
                      </a>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Projects