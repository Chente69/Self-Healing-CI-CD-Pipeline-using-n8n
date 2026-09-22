import { useState, type FormEvent } from 'react'
import { useMutation } from '@apollo/client/react'
import { CREATE_USER } from '../graphql/mutations.ts'
import { GET_USERS } from '../graphql/queries.ts'
import { NATIONALITIES, type Nationality, type User } from '../types/index.ts'

interface CreateUserVars {
  input: {
    name: string
    username: string
    age: number
    nationality: Nationality
  }
}

function UserForm() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [age, setAge] = useState('')
  const [nationality, setNationality] = useState<Nationality>('AMERICAN')

  const [createUser, { loading, error }] = useMutation<User, CreateUserVars>(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    createUser({
      variables: {
        input: { name, username, age: Number(age), nationality },
      },
    })
    setName('')
    setUsername('')
    setAge('')
    setNationality('AMERICAN')
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>Create User</h2>
      <div className="form-row">
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Age
          <input
            type="number"
            min="0"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </label>
        <label>
          Nationality
          <select
            value={nationality}
            onChange={(e) => setNationality(e.target.value as Nationality)}
          >
            {NATIONALITIES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>
      {error && <p className="status error">Error: {error.message}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating…' : 'Create User'}
      </button>
    </form>
  )
}

export default UserForm