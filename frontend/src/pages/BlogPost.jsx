import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../utils/api'
import { BASE_URL } from '../utils/constants'

function BlogPost() {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${slug}`)
        setBlog(res.data)
      } catch (err) {
        console.error('Failed to fetch blog post', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [slug])

  if (loading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-6 py-16">
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </Layout>
    )
  }

  if (!blog) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-6 py-16">
          <p className="text-sm text-gray-400">Post not found.</p>
          <Link to="/blog" className="text-sm text-indigo-500 hover:text-indigo-600 mt-2 block">
            Back to blog
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-8"
        >
          ← Back to blog
        </Link>

        {/* Cover image */}
        {blog.coverImage && (
          <div className="rounded-3xl overflow-hidden mb-8 aspect-video">
            <img
              src={`${BASE_URL}/uploads/${blog.coverImage}`}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-medium text-gray-900 dark:text-gray-100 mb-4 leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>
              {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <span>{blog.views} views</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 mb-8" />

        {/* Content */}
        <div className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line text-base space-y-4">
          {blog.content}
        </div>

      </div>
    </Layout>
  )
}

export default BlogPost