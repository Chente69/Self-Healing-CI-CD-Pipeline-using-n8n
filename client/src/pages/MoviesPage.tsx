import { useQuery } from '@apollo/client/react'
import { GET_MOVIES } from '../graphql/queries.ts'
import type { Movie } from '../types/index.ts'

interface GetMoviesData {
  movies: Movie[]
}

function MoviesPage() {
  const { loading, error, data } = useQuery<GetMoviesData>(GET_MOVIES)

  if (loading) return <p className="status">Loading movies…</p>
  if (error) return <p className="status error">Error: {error.message}</p>

  return (
    <div>
      <h2>Movies</h2>
      <ul className="card-grid">
        {data?.movies.map((movie) => (
          <li key={movie.id} className="card">
            <h3>{movie.name}</h3>
            <p>
              {movie.yearOfPublication} · {movie.isInTheaters ? 'In theaters' : 'Not in theaters'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MoviesPage