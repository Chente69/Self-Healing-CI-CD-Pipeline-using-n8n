import { useQuery } from '@apollo/client/react'
import { Link } from 'react-router-dom'
import UserForm from '../components/UserForm.tsx'
import { GET_USERS } from '../graphql/queries.ts'
import type { User } from '../types/index.ts'

interface GetUsersData {
  users: User[]
}

function UsersPage() {
  const { loading, error, data } = useQuery<GetUsersData>(GET_USERS)

  if (loading) return <p className="status">Loading users…</p>
  if (error) return <p className="status error">Error: {error.message}</p>

  return (
    <div>
      <UserForm />
      <h2>Users</h2>
      <ul className="card-grid">
        {data?.users.map((user) => (
          <li key={user.id} className="card">
            <Link to={`/users/${user.id}`} className="card-link">
              <h3>{user.name}</h3>
              <p>
                @{user.username} · {user.age} yrs · {user.nationality}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UsersPage