import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithToast } from "../lib/fetchWithToast";
import { useTranslation } from "react-i18next";

export default function EditAccount() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    user: "",
    userDescription: "",
    password: "",
    expirationDate: "",
    reseller: "",
  });

  useEffect(() => {
    fetch(`http://localhost:3001/accounts/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) =>
        setForm({
          user: data.user,
          userDescription: data.userDescription,
          password: data.password,
          expirationDate: data.expirationDate.slice(0, 10),
          reseller: data.reseller || "",
        })
      );
  }, [id]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchWithToast(`http://localhost:3001/accounts/${id}`, {
      method: "PUT",
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
      <h1 className="text-2xl font-bold">{t("accounts.edit")}</h1>
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
        {t("accounts.edit")}
      </button>
    </form>
  );
}
