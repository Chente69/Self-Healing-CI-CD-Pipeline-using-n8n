import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import type { MockedResponse } from '@apollo/client/testing'
import UsersPage from './UsersPage.tsx'
import { GET_USERS } from '../graphql/queries.ts'
import type { User } from '../types/index.ts'
import { renderWithProviders } from '../test/testUtils.tsx'

const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    age: 28,
    nationality: 'AMERICAN',
    friends: [],
  },
  {
    id: '2',
    name: 'Jane Smith',
    username: 'janesmith',
    age: 32,
    nationality: 'CANADIAN',
    friends: [],
  },
]

const successMocks: MockedResponse[] = [
  { request: { query: GET_USERS }, result: { data: { users } } },
]

describe('UsersPage', () => {
  it('shows a loading message while the query is in flight', async () => {
    renderWithProviders(<UsersPage />, [
      {
        request: { query: GET_USERS },
        result: { data: { users } },
        delay: 50,
      },
    ])

    expect(await screen.findByText('Loading users…')).toBeInTheDocument()
    expect(await screen.findByText('John Doe')).toBeInTheDocument()
  })

  it('renders a card with a link for every user', async () => {
    renderWithProviders(<UsersPage />, successMocks)

    expect(await screen.findByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute('href', '/users/1')
    expect(links[1]).toHaveAttribute('href', '/users/2')

    expect(
      screen.getByText('@johndoe · 28 yrs · AMERICAN'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('@janesmith · 32 yrs · CANADIAN'),
    ).toBeInTheDocument()
  })

  it('shows the error message when the query fails', async () => {
    renderWithProviders(<UsersPage />, [
      { request: { query: GET_USERS }, error: new Error('boom') },
    ])

    expect(await screen.findByText('Error: boom')).toBeInTheDocument()
  })

  it('renders an empty list when no users are returned', async () => {
    renderWithProviders(<UsersPage />, [
      { request: { query: GET_USERS }, result: { data: { users: [] } } },
    ])

    await screen.findByText('Users')
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })
})