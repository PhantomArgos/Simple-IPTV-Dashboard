import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchWithToast } from '../lib/fetchWithToast'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ProviderRow from '../components/ProviderRow'

export default function Providers() {
  const { t } = useTranslation()
  const [providers, setProviders] = useState([])

  useEffect(() => {
    fetch('http://localhost:3001/providers', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(setProviders)
  }, [])

  function handleDelete(id: number) {
    if (!confirm(t('providers.confirmDelete'))) return
    fetchWithToast(`http://localhost:3001/providers/${id}`, {
      method: 'DELETE',
      successMessage: t('providers.delete'),
      errorMessage: t('providers.delete'),
    }).then(res => {
      if (res !== null) {
        setProviders(prev => prev.filter(p => p.id !== id))
      }
    })
  }

  return (
    <div className="p-4 text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-4">{t('providers.title')}</h1>

      <table className="min-w-full bg-white dark:bg-gray-800 border">
        <thead className="hidden md:table-header-group">
          <tr>
            <th className="px-4 py-2 border">{t('providers.name')}</th>
            <th className="px-4 py-2 border">{t('providers.domain')}</th>
            <th className="px-4 py-2 border">{t('providers.port')}</th>
            <th className="px-4 py-2 border">{t('providers.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {providers.map(provider => (
            <ProviderRow key={provider.id} provider={provider} onDelete={handleDelete} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
