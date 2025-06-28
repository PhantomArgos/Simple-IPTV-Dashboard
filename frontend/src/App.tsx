import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Accounts from './pages/Accounts'
import NewAccount from './pages/NewAccount'
import Providers from './pages/Providers'
import NewProvider from './pages/NewProvider'
import EditAccount from './pages/EditAccount'
import EditProvider from './pages/EditProvider'
import './i18n/i18n'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Accounts />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/accounts/new" element={<NewAccount />} />
            <Route path="/accounts/edit/:id" element={<EditAccount />} />
            <Route path="/providers" element={<Providers />} />
            <Route path="/providers/new" element={<NewProvider />} />
            <Route path="/providers/edit/:id" element={<EditProvider />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
