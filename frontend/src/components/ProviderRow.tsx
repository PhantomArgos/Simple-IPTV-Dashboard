import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

type Provider = {
  id: number;
  name: string;
  domain: string;
  port: number;
};

type Props = {
  provider: Provider;
  onDelete: (id: number) => void;
};

export default function ProviderRow({ provider, onDelete }: Props) {
  const { t } = useTranslation();

  return (
    <>
      {/* Desktop/Table view */}
      <tr className="hidden md:table-row">
        <td className="px-4 py-2 border">{provider.name}</td>
        <td className="px-4 py-2 border">{provider.domain}</td>
        <td className="px-4 py-2 border">{provider.port}</td>
        <td className="px-4 py-2 border space-x-2 flex items-center">
          <Link to={`/providers/edit/${provider.id}`} title={t("providers.edit")}>
            <Pencil className="w-4 h-4 text-blue-600 hover:text-blue-800" />
          </Link>
          <button onClick={() => onDelete(provider.id)} title={t("providers.delete")}>
            <Trash2 className="w-4 h-4 text-red-600 hover:text-red-800" />
          </button>
        </td>
      </tr>

      {/* Mobile/Card view */}
      <tr className="md:hidden">
        <td colSpan={4} className="p-4 border-b">
          <div className="bg-white dark:bg-gray-800 rounded shadow p-4 space-y-2 text-sm">
            <div><strong>{t("providers.name")}:</strong> {provider.name}</div>
            <div><strong>{t("providers.domain")}:</strong> {provider.domain}</div>
            <div><strong>{t("providers.port")}:</strong> {provider.port}</div>
            <div className="flex gap-4 pt-2">
              <Link to={`/providers/edit/${provider.id}`} className="text-blue-600">
                <Pencil />
              </Link>
              <button onClick={() => onDelete(provider.id)} className="text-red-600">
                <Trash2 />
              </button>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
