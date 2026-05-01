import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../utils/api'

function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages')
      setMessages(res.data)
    } catch (err) {
      console.error('Failed to fetch messages', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/messages/${id}/read`)
      fetchMessages()
    } catch (err) {
      console.error('Failed to mark as read', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return
    try {
      await api.delete(`/messages/${id}`)
      fetchMessages()
    } catch (err) {
      console.error('Failed to delete message', err)
    }
  }

  const unread = messages.filter(m => !m.isRead)
  const read = messages.filter(m => m.isRead)

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-1">
          Messages
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Contact form submissions from your portfolio.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : messages.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No messages yet.
        </div>
      ) : (
        <div className="space-y-8">

          {/* Unread */}
          {unread.length > 0 && (
            <div>
              <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                Unread ({unread.length})
              </h2>
              <div className="space-y-3">
                {unread.map((msg) => (
                  <div
                    key={msg._id}
                    className="bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {msg.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {msg.email}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {msg.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(msg.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleMarkRead(msg._id)}
                          className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-950 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                        >
                          Mark read
                        </button>
                        <button
                          onClick={() => handleDelete(msg._id)}
                          className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-950 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Read */}
          {read.length > 0 && (
            <div>
              <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                Read ({read.length})
              </h2>
              <div className="space-y-3">
                {read.map((msg) => (
                  <div
                    key={msg._id}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 opacity-60"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {msg.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {msg.email}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {msg.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(msg.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-950 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors shrink-0"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </AdminLayout>
  )
}

export default AdminMessages