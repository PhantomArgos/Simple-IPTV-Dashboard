import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchWithToast } from "../lib/fetchWithToast";
import { Eye, EyeOff, Pencil, Trash2, ArrowDown, ArrowUp, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Accounts() {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visiblePasswords, setVisiblePasswords] = useState<{
    [key: number]: boolean;
  }>({});
  const [sortKey, setSortKey] = useState<string>("userDescription");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:3001/accounts", {
    credentials: "include",
  })
      .then((res) => res.json())
      .then((data) => {
        setAccounts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function handleDelete(id: number) {
    if (!confirm(t("accounts.confirmDelete"))) return;
    fetchWithToast(`http://localhost:3001/accounts/${id}`, {
      method: "DELETE",
      successMessage: t("accounts.delete"),
      errorMessage: t("accounts.delete"),
    }).then((res) => {
      if (res !== null) {
        setAccounts((prev) => prev.filter((acc) => acc.id !== id));
      }
    });
  }

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  }

  const sortedAccounts = [...accounts]
    .filter((acc) => {
      const domainUrl = `http://${acc.provider?.domain}:${acc.provider?.port}`.toLowerCase();
      const query = filter.toLowerCase();
      return (
        acc.userDescription.toLowerCase().includes(query) ||
        acc.user.toLowerCase().includes(query) ||
        acc.provider?.name?.toLowerCase().includes(query) ||
        acc.provider?.domain?.toLowerCase().includes(query) ||
        domainUrl.includes(query)
      );
    })
    .sort((a, b) => {
      const aVal = a[sortKey]?.toString().toLowerCase() || "";
      const bVal = b[sortKey]?.toString().toLowerCase() || "";
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  if (loading)
    return (
      <p className="p-4 text-black dark:text-white">{t("accounts.loading")}</p>
    );

  return (
    <motion.div
      className="p-4 text-black dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-2xl font-bold mb-4">{t("accounts.title")}</h1>

      <input
        type="text"
        placeholder={t("accounts.filterPlaceholder")}
        className="mb-4 p-2 border rounded w-full dark:bg-gray-700"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border">
          <thead className="hidden md:table-header-group">
            <tr>
              <th className="px-4 py-2 border">{t("accounts.description")}</th>
              <th className="px-4 py-2 border">{t("accounts.provider")}</th>
              <th className="px-4 py-2 border">Domain</th>
              <th className="px-4 py-2 border">{t("accounts.username")}</th>
              <th className="px-4 py-2 border">{t("accounts.password")}</th>
              <th className="px-4 py-2 border">{t("accounts.status")}</th>
              <th className="px-4 py-2 border">{t("accounts.expiration")}</th>
              <th className="px-4 py-2 border">{t("accounts.active")}</th>
              <th className="px-4 py-2 border">{t("accounts.max")}</th>
              <th className="px-4 py-2 border">{t("accounts.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {sortedAccounts.map((acc: any) => {
              const domainUrl = `http://${acc.provider?.domain}:${acc.provider?.port}`;
              return (
                <tr key={acc.id} className="hidden md:table-row">
                  <td className="px-4 py-2 border">{acc.userDescription}</td>
                  <td className="px-4 py-2 border">{acc.provider?.name}</td>
                  <td className="px-4 py-2 border">{domainUrl}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex items-center gap-2">
                      {acc.user}
                      <button onClick={() => navigator.clipboard.writeText(acc.user)}>
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="flex items-center gap-2">
                      {visiblePasswords[acc.id] ? acc.password : "••••••"}
                      <button onClick={() =>
                        setVisiblePasswords((prev) => ({ ...prev, [acc.id]: !prev[acc.id] }))
                      }>
                        {visiblePasswords[acc.id] ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      {visiblePasswords[acc.id] && (
                        <button onClick={() => navigator.clipboard.writeText(acc.password)}>
                          <Copy className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 border">{acc.status}</td>
                  <td className="px-4 py-2 border">{new Date(acc.expirationDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border">{acc.activeConnections}</td>
                  <td className="px-4 py-2 border">{acc.maxConnections}</td>
                  <td className="px-4 py-2 border flex gap-2">
                    <Link to={`/accounts/edit/${acc.id}`}><Pencil className="w-4 h-4" /></Link>
                    <button onClick={() => handleDelete(acc.id)}><Trash2 className="w-4 h-4 text-red-600" /></button>
                  </td>
                </tr>
              );
            })}

            {/* Mobile Cards */}
            {sortedAccounts.map((acc: any) => {
              const domainUrl = `http://${acc.provider?.domain}:${acc.provider?.port}`;
              return (
                <tr key={acc.id} className="md:hidden">
                  <td colSpan={10} className="p-4 border-b">
                    <div className="bg-white dark:bg-gray-800 rounded shadow p-4 space-y-2 text-sm">
                      <div><strong>{t("accounts.description")}:</strong> {acc.userDescription}</div>
                      <div><strong>{t("accounts.provider")}:</strong> {acc.provider?.name}</div>
                      <div className="flex items-center gap-2">
                        <strong>Domain:</strong>
                        <span className="truncate">{domainUrl}</span>
                        <button onClick={() => navigator.clipboard.writeText(domainUrl)}>
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <strong>{t("accounts.username")}:</strong>
                        <span>{acc.user}</span>
                        <button onClick={() => navigator.clipboard.writeText(acc.user)}>
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <strong>{t("accounts.password")}:</strong>
                        <span>{visiblePasswords[acc.id] ? acc.password : "••••••"}</span>
                        <button onClick={() =>
                          setVisiblePasswords((prev) => ({ ...prev, [acc.id]: !prev[acc.id] }))
                        }>
                          {visiblePasswords[acc.id] ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        {visiblePasswords[acc.id] && (
                          <button onClick={() => navigator.clipboard.writeText(acc.password)}>
                            <Copy className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div><strong>{t("accounts.status")}:</strong> {acc.status}</div>
                      <div><strong>{t("accounts.expiration")}:</strong> {new Date(acc.expirationDate).toLocaleDateString()}</div>
                      <div><strong>{t("accounts.active")}:</strong> {acc.activeConnections}</div>
                      <div><strong>{t("accounts.max")}:</strong> {acc.maxConnections}</div>
                      <div className="flex gap-4 pt-2">
                        <Link to={`/accounts/edit/${acc.id}`} className="text-blue-600"><Pencil /></Link>
                        <button onClick={() => handleDelete(acc.id)} className="text-red-600"><Trash2 /></button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
