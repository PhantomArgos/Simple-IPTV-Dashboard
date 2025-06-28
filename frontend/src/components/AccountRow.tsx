import { Eye, EyeOff, Copy, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function AccountRow({ account, onDelete }: any) {
  const [show, setShow] = useState(false)
  const domainUrl = `http://${account.provider?.domain}:${account.provider?.port}`

  return (
    <tr className="block md:table-row border-b md:border-none mb-4 md:mb-0">
      <td className="block md:table-cell px-4 py-2">
        <span className="font-semibold md:hidden">Beschreibung: </span>
        {account.userDescription}
      </td>
      <td className="block md:table-cell px-4 py-2">
        <span className="font-semibold md:hidden">Provider: </span>
        {account.provider?.name}
      </td>
      <td className="block md:table-cell px-4 py-2">
        <span className="font-semibold md:hidden">Domain: </span>
        <span className="truncate">{domainUrl}</span>
        <button onClick={() => navigator.clipboard.writeText(domainUrl)}>
          <Copy className="inline w-4 h-4 ml-1" />
        </button>
      </td>
      <td className="block md:table-cell px-4 py-2">
        <span className="font-semibold md:hidden">User: </span>
        {account.user}
        <button onClick={() => navigator.clipboard.writeText(account.user)}>
          <Copy className="inline w-4 h-4 ml-1" />
        </button>
      </td>
      <td className="block md:table-cell px-4 py-2">
        <span className="font-semibold md:hidden">Passwort: </span>
        {show ? account.password : '••••••'}
        <button onClick={() => setShow(v => !v)} className="ml-1">
          {show ? <Eye className="inline w-4 h-4" /> : <EyeOff className="inline w-4 h-4" />}
        </button>
        {show && (
          <button onClick={() => navigator.clipboard.writeText(account.password)}>
            <Copy className="inline w-4 h-4 ml-1" />
          </button>
        )}
      </td>
      <td className="block md:table-cell px-4 py-2">
        <span className="font-semibold md:hidden">Status: </span>
        {account.status}
      </td>
      <td className="block md:table-cell px-4 py-2">
        <span className="font-semibold md:hidden">Ablauf: </span>
        {new Date(account.expirationDate).toLocaleDateString()}
      </td>
      <td className="block md:table-cell px-4 py-2">
        <span className="font-semibold md:hidden">Aktiv: </span>
        {account.activeConnections}
      </td>
      <td className="block md:table-cell px-4 py-2">
        <span className="font-semibold md:hidden">Max: </span>
        {account.maxConnections}
      </td>
      <td className="block md:table-cell px-4 py-2 flex gap-2">
        <Link to={`/accounts/edit/${account.id}`}>
          <Pencil className="w-4 h-4" />
        </Link>
        <button onClick={() => onDelete(account.id)}>
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </td>
    </tr>
  )
}
