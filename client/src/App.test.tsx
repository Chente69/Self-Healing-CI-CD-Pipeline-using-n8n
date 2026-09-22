import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import type { MockedResponse } from '@apollo/client/testing'
import App from './App.tsx'
import { GET_USERS, GET_MOVIES } from './graphql/queries.ts'
import type { User } from './types/index.ts'
import type { Movie } from './types/index.ts'
import { renderWithProviders } from './test/testUtils.tsx'

const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    age: 28,
    nationality: 'AMERICAN',
    friends: [],
  },
]

const movies: Movie[] = [
  { id: '1', name: 'Inception', yearOfPublication: 2010, isInTheaters: false },
]

const usersMock: MockedResponse[] = [
  { request: { query: GET_USERS }, result: { data: { users } } },
]

const moviesMock: MockedResponse[] = [
  { request: { query: GET_MOVIES }, result: { data: { movies } } },
]

describe('App routing smoke test', () => {
  it('renders the UsersPage on "/"', async () => {
    renderWithProviders(<App />, usersMock, ['/'])

    expect(await screen.findByText('John Doe')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument()
  })

  it('renders the MoviesPage on "/movies"', async () => {
    renderWithProviders(<App />, moviesMock, ['/movies'])

    expect(await screen.findByText('Inception')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Movies' })).toBeInTheDocument()
  })
})