import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedRoute() {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3001/me", {
          credentials: "include",
        })
        const data = await res.json()
        setAuthenticated(data.authenticated === true)
      } catch (e) {
        setAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) return <div className="text-center mt-10">Lade...</div>
  if (!authenticated) return <Navigate to="/login" />

  return <Outlet />
}
