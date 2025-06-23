import Navbar from './Navbar'
import { Toaster } from './Toaster'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <Navbar />
      <Toaster />
      <div className="p-4">
        <Outlet />
      </div>
    </>
  )
}
