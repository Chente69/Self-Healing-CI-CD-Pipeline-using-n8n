import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="navbar">
      <span className="navbar-title">GraphQL Tutorial</span>
      <nav>
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Users
        </NavLink>
        <NavLink
          to="/movies"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Movies
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar