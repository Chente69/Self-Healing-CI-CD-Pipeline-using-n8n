import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import UpdateUsernameForm from '../components/UpdateUsernameForm.tsx'
import { GET_USER } from '../graphql/queries.ts'
import type { User } from '../types/index.ts'

interface GetUserData {
  user: User
}

function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { loading, error, data } = useQuery<GetUserData>(GET_USER, {
    variables: { id },
    skip: !id,
  })

  if (loading) return <p className="status">Loading user…</p>
  if (error) return <p className="status error">Error: {error.message}</p>
  if (!data?.user) return <p className="status">User not found</p>

  const user = data.user

  return (
    <div>
      <Link to="/" className="back-link">
        ← Back to users
      </Link>
      <div className="card">
        <h2>{user.name}</h2>
        <p>
          @{user.username} · {user.age} yrs · {user.nationality}
        </p>
      </div>

      <UpdateUsernameForm userId={user.id} />

      <div className="card">
        <h3>Friends</h3>
        {user.friends && user.friends.length > 0 ? (
          <ul>
            {user.friends.map((friend) => (
              <li key={friend.id}>
                <Link to={`/users/${friend.id}`}>{friend.name}</Link> (@{friend.username})
              </li>
            ))}
          </ul>
        ) : (
          <p>No friends</p>
        )}
      </div>

      <div className="card">
        <h3>Favorite Movies</h3>
        {user.favoritiesMovies && user.favoritiesMovies.length > 0 ? (
          <ul>
            {user.favoritiesMovies.map((movie) => (
              <li key={movie.id}>
                {movie.name} ({movie.yearOfPublication}) ·
                {movie.isInTheaters ? ' In theaters' : ' No longer in theaters'}
              </li>
            ))}
          </ul>
        ) : (
          <p>No favorite movies</p>
        )}
      </div>
    </div>
  )
}

export default UserDetailPage