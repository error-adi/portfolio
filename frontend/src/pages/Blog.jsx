import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../utils/api'
import { BASE_URL } from '../utils/constants'

function Blog() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs')
        setBlogs(res.data)
      } catch (err) {
        console.error('Failed to fetch blogs', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-medium text-gray-900 dark:text-gray-100 mb-3">
            Blog
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Thoughts, tutorials and things I've learned while building.
          </p>
        </div>

        {/* Blog list */}
        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : blogs.length === 0 ? (
          <p className="text-sm text-gray-400">No posts yet.</p>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blog/${blog.slug}`}
                className="block bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                  {/* Cover image */}
                  {blog.coverImage && (
                    <div className="md:w-32 md:h-20 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-500 transition-colors mb-1">
                      {blog.title}
                    </h2>

                    {blog.excerpt && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-xs text-gray-400">
                      {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {blog.views} views
                    </p>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </Layout>
  )
}

export default Blog