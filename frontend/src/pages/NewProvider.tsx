import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithToast } from "../lib/fetchWithToast";
import { useTranslation } from "react-i18next";

export default function NewProvider() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", domain: "", port: 80 });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchWithToast("http://localhost:3001/providers", {
      method: "POST",
      body: form,
      successMessage: t("providers.edit"),
      errorMessage: t("providers.edit"),
      navigateTo: "/providers",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 space-y-4 text-black dark:text-white"
    >
      <h1 className="text-2xl font-bold">{t("providers.add")}</h1>
      <input
        className="block border p-2 rounded w-full dark:bg-gray-700"
        placeholder={t("providers.name")}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="block border p-2 rounded w-full dark:bg-gray-700"
        placeholder={t("providers.domain")}
        value={form.domain}
        onChange={(e) => setForm({ ...form, domain: e.target.value })}
      />
      <input
        className="block border p-2 rounded w-full dark:bg-gray-700"
        type="number"
        placeholder={t("providers.port")}
        value={form.port}
        onChange={(e) => setForm({ ...form, port: +e.target.value })}
      />
      <button className="bg-blue-600 text-white p-2 rounded w-full">
        {t("providers.add")}
      </button>
    </form>
  );
}
