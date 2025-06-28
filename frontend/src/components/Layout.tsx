import ResponsiveNavbar from './ResponsiveNavbar'
import { Toaster } from './Toaster'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <ResponsiveNavbar />
      <Toaster />
      <div className="p-4">
        <Outlet />
      </div>
    </>
  )
}
