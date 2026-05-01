import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../utils/api'
import { BASE_URL } from '../utils/constants'
import { useSettings } from '../context/SettingsContext'

function Home() {
  const [projects, setProjects] = useState([])
  const [blogs, setBlogs] = useState([])
  const [totalDownloads, setTotalDownloads] = useState(0)

  const { settings } = useSettings()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, blogsRes] = await Promise.all([
          api.get('/projects'),
          api.get('/blogs'),
        ])

        const projectsData = Array.isArray(projectsRes.data) ? projectsRes.data : []
        const blogsData = Array.isArray(blogsRes.data) ? blogsRes.data : []

        setProjects(projectsData.slice(0, 3))
        setBlogs(blogsData.slice(0, 3))
        const downloads = projectsData.reduce((sum, p) => sum + p.downloadCount, 0)
        setTotalDownloads(downloads)
      } catch (err) {
        console.error('Failed to fetch data', err)
      }
    }
    fetchData()
  }, [])

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Hero card */}
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 flex flex-col justify-between min-h-64">
            <div>
              {settings.status && (
                <span className="inline-block text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-full mb-4">
                  {settings.status}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-gray-100 leading-tight mb-3">
                {settings.tagline || 'I build tools that automate the boring stuff.'}
              </h1>
              {settings.bio && (
                <div className="relative">
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-4">
                    {settings.bio}
                  </p>
                  <div className="absolute bottom-6 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />
                  <Link
                    to="/about"
                    className="text-xs text-indigo-500 hover:text-indigo-600 transition-colors mt-1 block"
                  >
                    Read more →
                  </Link>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <Link
                to="/projects"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                View Projects
              </Link>
              <Link
                to="/blog"
                className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Read Blog
              </Link>
            </div>
          </div>

          {/* Avatar card */}
          {/* <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-2xl font-medium text-indigo-600 dark:text-indigo-400 overflow-hidden">
              {settings.photo ? (
                <img
                  src={`${BASE_URL}/uploads/${settings.photo}`}
                  alt={settings.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                settings.name ? settings.name.charAt(0) : 'Y'
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{settings.name || 'Your Name'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Software Developer</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Python', 'MERN', 'Automation'].map(tag => (
                <span key={tag} className="text-xs px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div> */}

          {/* Avatar card */}
          <div className="relative bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden min-h-64">

            {/* Full cover photo */}
            {settings.photo ? (
              <img
                src={`${BASE_URL}/uploads/${settings.photo}`}
                alt={settings.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-4xl font-medium text-indigo-600 dark:text-indigo-400">
                {settings.name ? settings.name.charAt(0) : 'Y'}
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* Name and skills at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-sm font-medium text-white mb-1">
                {settings.name || 'Your Name'}
              </p>
              <p className="text-xs text-white/70 mb-3">
                {settings.title || 'Software Developer'}
              </p>
              <div className="flex flex-wrap gap-2">
                {(settings.skills && settings.skills.length > 0
                  ? settings.skills
                  : ['Python', 'MERN', 'Automation']
                ).map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 bg-white/20 text-white border border-white/20 rounded-full backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Projects card */}
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">
              Featured Projects
            </p>
            {projects.length === 0 ? (
              <p className="text-sm text-gray-400">No projects yet.</p>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <Link
                    key={project._id}
                    to={`/projects/${project.slug}`}
                    className="flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-500 transition-colors">
                        {project.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {project.downloadCount} downloads
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 rounded-lg">
                      {project.techStack[0]}
                    </span>
                  </Link>
                ))}
              </div>
            )}
            <Link
              to="/projects"
              className="block text-xs text-indigo-500 hover:text-indigo-600 mt-4 transition-colors"
            >
              All projects →
            </Link>
          </div>

          {/* Blog card */}
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">
              Latest Posts
            </p>
            {blogs.length === 0 ? (
              <p className="text-sm text-gray-400">No posts yet.</p>
            ) : (
              <div className="space-y-3">
                {blogs.map((blog) => (
                  <Link
                    key={blog._id}
                    to={`/blog/${blog.slug}`}
                    className="block group"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-500 transition-colors leading-snug">
                      {blog.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </Link>
                ))}
              </div>
            )}
            <Link
              to="/blog"
              className="block text-xs text-indigo-500 hover:text-indigo-600 mt-4 transition-colors"
            >
              All posts →
            </Link>
          </div>

          {/* Downloads stat card */}
          <div className="bg-indigo-600 rounded-3xl p-6 flex flex-col justify-between">
            <p className="text-xs text-indigo-300 uppercase tracking-wider">
              Total Downloads
            </p>
            <div>
              <p className="text-5xl font-medium text-white mt-2">
                {totalDownloads}
              </p>
              <p className="text-sm text-indigo-300 mt-1">
                across all projects
              </p>
            </div>
          </div>

          {/* CTA card */}
          <div className="md:col-span-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Have a project in mind? Let's talk.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                I'm available for freelance work and collaboration.
              </p>
            </div>
            <Link
              to="/contact"
              className="shrink-0 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Get in touch
            </Link>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default Home