import { Link } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

function Footer() {
  const { settings } = useSettings()

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">

        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} {settings.name || 'yourname.dev'} — Built with MERN stack
          </p>
          <p className="text-xs text-gray-400">
            Icon by <a href="https://www.flaticon.com/free-icons/api" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Tanah Basah - Flaticon</a>
          </p>
        </div>

        <div className="flex items-center gap-5">
          {settings.github && (
            
            <a  href={settings.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <FaGithub size={20} />
            </a>
          )}
          {settings.linkedin && (
            
            <a  href={settings.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <FaLinkedin size={20} />
            </a>
          )}
          <Link
            to="/contact"
            className="text-sm text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            Contact
          </Link>
        </div>

      </div>
    </footer>
  )
}

export default Footer