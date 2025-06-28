import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchWithToast } from "../lib/fetchWithToast";
import {
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  ArrowDown,
  ArrowUp,
  Copy,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import AccountRow from "../components/AccountRow";

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
      const domainUrl =
        `http://${acc.provider?.domain}:${acc.provider?.port}`.toLowerCase();
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
        <table className="w-full border dark:border-gray-700">
          <thead className="hidden md:table-header-group">
            <tr className="md:table-row">
              <th className="px-4 py-2">Beschreibung</th>
              <th className="px-4 py-2">Provider</th>
              <th className="px-4 py-2">Domain</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Passwort</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Ablauf</th>
              <th className="px-4 py-2">Aktiv</th>
              <th className="px-4 py-2">Max</th>
              <th className="px-4 py-2">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {sortedAccounts.map((acc) => (
              <AccountRow key={acc.id} account={acc} onDelete={handleDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
