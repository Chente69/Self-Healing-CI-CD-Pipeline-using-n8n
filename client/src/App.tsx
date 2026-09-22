import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.tsx'
import MoviesPage from './pages/MoviesPage.tsx'
import UserDetailPage from './pages/UserDetailPage.tsx'
import UsersPage from './pages/UsersPage.tsx'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserDetailPage />} />
          <Route path="/movies" element={<MoviesPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App