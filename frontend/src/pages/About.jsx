import Layout from '../components/Layout'
import { useSettings } from '../context/SettingsContext'
import { BASE_URL } from '../utils/constants'

function About() {
  const { settings } = useSettings()

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-16">

        <div className="mb-12">
          <h1 className="text-3xl font-medium text-gray-900 dark:text-gray-100 mb-3">
            About
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            A little bit about me and what I do.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="md:col-span-2 space-y-8">

            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-xl font-medium text-indigo-600 dark:text-indigo-400 shrink-0 overflow-hidden">
                  {settings.photo ? (
                    <img
                      src={settings.photo}
                      alt={settings.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    settings.name ? settings.name.charAt(0) : 'Y'
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {settings.name || 'Your Name'}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Software Developer · India
                  </p>
                </div>
              </div>
              <div className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm whitespace-pre-line">
                {settings.bio || 'Bio coming soon.'}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Skills
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { category: 'Languages', items: ['Python', 'JavaScript', 'HTML', 'CSS'] },
                  { category: 'Tools & Libraries', items: ['Selenium', 'Tkinter', 'React', 'Node.js', 'Express'] },
                  { category: 'Database', items: ['MongoDB'] },
                  { category: 'Other', items: ['Web Scraping', 'Automation', 'REST APIs', 'Git'] },
                ].map((group) => (
                  <div
                    key={group.category}
                    className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5"
                  >
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                      {group.category}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="text-xs px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="space-y-4">

            {settings.cvFile && (
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">
                  Resume
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Want to know more? Download my CV.
                </p>
                
                <a  href={settings.cvFile ? settings.cvFile.replace('/image/upload/', '/raw/upload/') : '#'}
                  download
                  className="block w-full text-center px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Download CV
                </a>
              </div>
            )}

            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">
                Find me on
              </p>
              <div className="space-y-3">
                {settings.github && (
                  
                  <a  href={settings.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition-colors"
                  >
                    <span>GitHub</span>
                    <span>→</span>
                  </a>
                )}
                {settings.linkedin && (
                  
                  <a  href={settings.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition-colors"
                  >
                    <span>LinkedIn</span>
                    <span>→</span>
                  </a>
                )}
                {settings.email && (
                  
                  <a  href={`mailto:${settings.email}`}
                    className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition-colors"
                  >
                    <span>Email</span>
                    <span>→</span>
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default About