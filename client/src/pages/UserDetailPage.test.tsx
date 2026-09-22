import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import type { MockedResponse } from '@apollo/client/testing'
import UserDetailPage from './UserDetailPage.tsx'
import { GET_USER } from '../graphql/queries.ts'
import type { User } from '../types/index.ts'
import { renderRoute } from '../test/testUtils.tsx'

const user: User = {
  id: '1',
  name: 'John Doe',
  username: 'johndoe',
  age: 28,
  nationality: 'AMERICAN',
  friends: [
    {
      id: '4',
      name: 'Paul Mackarney',
      username: 'paulmackarney',
      age: 34,
      nationality: 'COLLOMBIAN',
    },
  ],
  favoritiesMovies: [
    { id: '1', name: 'Inception', yearOfPublication: 2010, isInTheaters: false },
    { id: '2', name: 'Interstellar', yearOfPublication: 2014, isInTheaters: false },
  ],
}

const successMocks: MockedResponse[] = [
  {
    request: { query: GET_USER, variables: { id: '1' } },
    result: { data: { user } },
  },
]

describe('UserDetailPage', () => {
  it('renders the user details', async () => {
    renderRoute('/users/:id', <UserDetailPage />, successMocks, ['/users/1'])

    expect(await screen.findByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('@johndoe · 28 yrs · AMERICAN')).toBeInTheDocument()
  })

  it('renders the friends list with links', async () => {
    renderRoute('/users/:id', <UserDetailPage />, successMocks, ['/users/1'])

    await screen.findByText('John Doe')
    expect(screen.getByText('Friends')).toBeInTheDocument()
    const friendLink = screen.getByRole('link', { name: /Paul Mackarney/ })
    expect(friendLink).toHaveAttribute('href', '/users/4')
  })

  it('renders the favorite movies (favoritiesMovies)', async () => {
    renderRoute('/users/:id', <UserDetailPage />, successMocks, ['/users/1'])

    await screen.findByText('John Doe')
    expect(screen.getByText('Favorite Movies')).toBeInTheDocument()
    expect(screen.getByText('Inception (2010) · No longer in theaters')).toBeInTheDocument()
    expect(screen.getByText('Interstellar (2014) · No longer in theaters')).toBeInTheDocument()
  })

  it('renders the UpdateUsernameForm', async () => {
    renderRoute('/users/:id', <UserDetailPage />, successMocks, ['/users/1'])

    await screen.findByText('John Doe')
    expect(screen.getByRole('heading', { name: 'Update Username' })).toBeInTheDocument()
  })

  it('shows the error message when the query fails', async () => {
    renderRoute(
      '/users/:id',
      <UserDetailPage />,
      [{ request: { query: GET_USER, variables: { id: '1' } }, error: new Error('boom') }],
      ['/users/1'],
    )

    expect(await screen.findByText('Error: boom')).toBeInTheDocument()
  })
})