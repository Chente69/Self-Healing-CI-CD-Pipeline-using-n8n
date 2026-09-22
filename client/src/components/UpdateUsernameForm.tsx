import { useState, type FormEvent } from 'react'
import { useMutation } from '@apollo/client/react'
import { UPDATE_USERNAME } from '../graphql/mutations.ts'
import { GET_USER } from '../graphql/queries.ts'

interface UpdateUsernameVars {
  input: {
    id: string
    newUserName: string
  }
}

function UpdateUsernameForm({ userId }: { userId: string }) {
  const [username, setUsername] = useState('')

  const [updateUsername, { loading, error }] = useMutation<{ id: string }, UpdateUsernameVars>(
    UPDATE_USERNAME,
    {
      refetchQueries: [{ query: GET_USER, variables: { id: userId } }],
    },
  )

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    updateUsername({ variables: { input: { id: userId, newUserName: username } } })
    setUsername('')
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>Update Username</h3>
      <div className="form-row">
        <label>
          New username
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
      </div>
      {error && <p className="status error">Error: {error.message}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Updating…' : 'Update'}
      </button>
    </form>
  )
}

export default UpdateUsernameForm