import { useEffect, useState } from 'react'

export const DarkModeToggle = () => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  return (
    <button
      className="px-2 py-1 border rounded text-black dark:text-white text-sm"
      onClick={() => setDark(!dark)}
    >
      {dark ? '☀️ Hell' : '🌙 Dunkel'}
    </button>
  )
}
