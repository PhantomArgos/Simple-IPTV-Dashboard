import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import logoLight from '../assets/logo_light.png'
import logoDark from '../assets/logo_dark.png'
import { LayoutDashboard, Globe, UserPlus, Server, Languages, LogOut } from 'lucide-react'
import { DarkModeToggle } from './DarkModeToggle'

export default function Navbar() {
  const { i18n, t } = useTranslation()
  const [darkMode, setDarkMode] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true })
    setDarkMode(document.documentElement.classList.contains('dark'))
    return () => observer.disconnect()
  }, [])

  const handleLogout = async () => {
    await fetch('http://localhost:3001/logout', {
      method: 'POST',
      credentials: 'include',
    })
    navigate('/login')
  }

  return (
    <nav className="py-2 px-4 bg-gray-100 dark:bg-gray-900 text-black dark:text-white flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 w-full border-b border-gray-300 dark:border-gray-700">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src={darkMode ? logoDark : logoLight}
          alt="Logo"
          className="h-10 md:h-14 w-auto object-contain"
        />
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-4 items-center justify-center text-sm md:text-base">
        <Link to="/accounts" className="flex items-center gap-1 hover:underline">
          <LayoutDashboard className="w-4 h-4" /> {t('accounts.title')}
        </Link>
        <Link to="/accounts/new" className="flex items-center gap-1 hover:underline">
          <UserPlus className="w-4 h-4" /> {t('accounts.add')}
        </Link>
        <Link to="/providers" className="flex items-center gap-1 hover:underline">
          <Server className="w-4 h-4" /> {t('providers.title')}
        </Link>
        <Link to="/providers/new" className="flex items-center gap-1 hover:underline">
          <UserPlus className="w-4 h-4" /> {t('providers.add')}
        </Link>

        {/* Dark Mode */}
        <DarkModeToggle />

        {/* Language */}
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4" />
          <select
            value={i18n.language}
            onChange={e => i18n.changeLanguage(e.target.value)}
            className="bg-transparent border rounded px-1 py-0.5 dark:border-gray-600"
          >
            <option value="en">🇬🇧 English</option>
            <option value="de">🇩🇪 Deutsch</option>
          </select>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-red-600 hover:underline"
        >
          <LogOut className="w-4 h-4" /> {t('logout.label', 'Logout')}
        </button>
      </div>
    </nav>
  )
}
