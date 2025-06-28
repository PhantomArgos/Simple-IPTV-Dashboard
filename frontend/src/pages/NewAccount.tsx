import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithToast } from "../lib/fetchWithToast";
import { useTranslation } from "react-i18next";

export default function NewAccount() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState({
    providerId: "",
    user: "",
    userDescription: "",
    password: "",
    expirationDate: "",
    reseller: "",
  });

  useEffect(() => {
    fetch("http://localhost:3001/providers", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setProviders);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchWithToast("http://localhost:3001/accounts", {
      method: "POST",
      body: form,
      successMessage: t("accounts.edit"),
      errorMessage: t("accounts.edit"),
      navigateTo: "/accounts",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 space-y-4 text-black dark:text-white"
    >
      <h1 className="text-2xl font-bold">{t("accounts.title")}</h1>

      <select
        className="block border p-2 rounded w-full dark:bg-gray-700"
        value={form.providerId}
        onChange={(e) => setForm({ ...form, providerId: e.target.value })}
      >
        <option value="">{t("accounts.provider")}</option>
        {providers.map((p: any) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <input
        className="block border p-2 rounded w-full dark:bg-gray-700"
        placeholder={t("accounts.description")}
        value={form.userDescription}
        onChange={(e) => setForm({ ...form, userDescription: e.target.value })}
      />

      <input
        className="block border p-2 rounded w-full dark:bg-gray-700"
        placeholder={t("accounts.username")}
        value={form.user}
        onChange={(e) => setForm({ ...form, user: e.target.value })}
      />

      <input
        type="password"
        className="block border p-2 rounded w-full dark:bg-gray-700"
        placeholder={t("accounts.password")}
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <input
        className="block border p-2 rounded w-full dark:bg-gray-700"
        type="date"
        value={form.expirationDate}
        onChange={(e) => setForm({ ...form, expirationDate: e.target.value })}
      />

      <input
        className="block border p-2 rounded w-full dark:bg-gray-700"
        placeholder="Reseller"
        value={form.reseller}
        onChange={(e) => setForm({ ...form, reseller: e.target.value })}
      />

      <button className="bg-blue-600 text-white p-2 rounded w-full">
        {t("accounts.add")}
      </button>
    </form>
  );
}
