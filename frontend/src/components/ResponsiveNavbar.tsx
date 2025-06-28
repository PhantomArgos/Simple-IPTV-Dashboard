import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  UserPlus,
  Server,
  LogOut,
  Languages,
  Menu,
  X,
  Lightbulb,
} from "lucide-react";
import { DarkModeToggle } from "./DarkModeToggle";
import logoLight from "../assets/logo_light.png";
import logoDark from "../assets/logo_dark.png";

export default function ResponsiveNavbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("http://localhost:3001/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  };

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    setDarkMode(document.documentElement.classList.contains("dark"));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white shadow-md">
      <div className="w-full px-4 py-2 flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Logo-Bereich */}
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <img
            src={darkMode ? logoDark : logoLight}
            alt="Logo"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-wrap items-center gap-4 whitespace-nowrap mt-2 md:mt-0">
          <Link
            to="/accounts"
            className="hover:underline flex items-center gap-1"
          >
            <LayoutDashboard className="w-4 h-4" /> {t("accounts.title")}
          </Link>
          <Link
            to="/accounts/new"
            className="hover:underline flex items-center gap-1"
          >
            <UserPlus className="w-4 h-4" /> {t("accounts.add")}
          </Link>
          <Link
            to="/providers"
            className="hover:underline flex items-center gap-1"
          >
            <Server className="w-4 h-4" /> {t("providers.title")}
          </Link>
          <Link
            to="/providers/new"
            className="hover:underline flex items-center gap-1"
          >
            <UserPlus className="w-4 h-4" /> {t("providers.add")}
          </Link>

          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            <DarkModeToggle />
            <Languages className="w-4 h-4" />
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="bg-transparent border rounded px-1 py-0.5 dark:border-gray-600"
            >
              <option value="en">🇬🇧 English</option>
              <option value="de">🇩🇪 Deutsch</option>
            </select>
          </div>

          <button
            onClick={handleLogout}
            className="text-red-600 hover:underline flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" /> {t("logout.label", "Logout")}
          </button>
        </nav>

        {/* Burger Menu Button */}
        <button
          className="md:hidden absolute top-4 right-4"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-gray-100 dark:bg-gray-900 p-4 flex flex-col gap-4 border-t border-gray-300 dark:border-gray-700">
          <Link
            to="/accounts"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <LayoutDashboard className="w-4 h-4" /> {t("accounts.title")}
          </Link>
          <Link
            to="/accounts/new"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" /> {t("accounts.add")}
          </Link>
          <Link
            to="/providers"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Server className="w-4 h-4" /> {t("providers.title")}
          </Link>
          <Link
            to="/providers/new"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" /> {t("providers.add")}
          </Link>

          <hr className="border-gray-300 dark:border-gray-700" />

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Languages className="w-4 h-4" />
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="bg-transparent border rounded px-1 py-0.5 dark:border-gray-600"
              >
                <option value="en">🇬🇧 English</option>
                <option value="de">🇩🇪 Deutsch</option>
              </select>
            </div>

            <div className="flex items-center gap-2 whitespace-nowrap">
              <Lightbulb className="w-4 h-4" />
              <DarkModeToggle />
            </div>

            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline flex items-center gap-1 whitespace-nowrap"
            >
              <LogOut className="w-4 h-4" /> {t("logout.label", "Logout")}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
