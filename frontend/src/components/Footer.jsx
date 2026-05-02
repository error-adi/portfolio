import { Link } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa'

function Footer() {
  const { settings } = useSettings()

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">

        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} {settings.name || 'Aditya Agarwal'} — Built with MERN stack
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
            <FaEnvelope size={20} />
          </Link>
        </div>

      </div>
    </footer>
  )
}

export default Footer