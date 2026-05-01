import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../utils/api'

function StatCard({ label, value }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-3xl font-medium text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  )
}

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    totalDownloads: 0,
    totalBlogs: 0,
    publishedBlogs: 0,
    totalMessages: 0,
    unreadMessages: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, blogsRes, messagesRes] = await Promise.all([
          api.get('/projects/all'),
          api.get('/blogs/all'),
          api.get('/messages'),
        ])

        const projects = projectsRes.data
        const blogs = blogsRes.data
        const messages = messagesRes.data

        setStats({
          totalProjects: projects.length,
          publishedProjects: projects.filter(p => p.isPublished).length,
          totalDownloads: projects.reduce((sum, p) => sum + p.downloadCount, 0),
          totalBlogs: blogs.length,
          publishedBlogs: blogs.filter(b => b.isPublished).length,
          totalMessages: messages.length,
          unreadMessages: messages.filter(m => !m.isRead).length,
        })
      } catch (err) {
        console.error('Failed to fetch stats', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-1">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Welcome back. Here's what's happening.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <div className="space-y-8">

          {/* Projects */}
          <div>
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
              Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="Total Projects" value={stats.totalProjects} />
              <StatCard label="Published" value={stats.publishedProjects} />
              <StatCard label="Total Downloads" value={stats.totalDownloads} />
            </div>
          </div>

          {/* Blog */}
          <div>
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
              Blog
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard label="Total Posts" value={stats.totalBlogs} />
              <StatCard label="Published" value={stats.publishedBlogs} />
            </div>
          </div>

          {/* Messages */}
          <div>
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
              Messages
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard label="Total Messages" value={stats.totalMessages} />
              <StatCard label="Unread" value={stats.unreadMessages} />
            </div>
          </div>

        </div>
      )}
    </AdminLayout>
  )
}

export default AdminDashboard