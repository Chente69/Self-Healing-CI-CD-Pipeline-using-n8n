import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import MoviesPage from './MoviesPage.tsx'
import { GET_MOVIES } from '../graphql/queries.ts'
import type { Movie } from '../types/index.ts'
import { renderWithProviders } from '../test/testUtils.tsx'

const movies: Movie[] = [
  { id: '1', name: 'Inception', yearOfPublication: 2010, isInTheaters: false },
  { id: '2', name: 'Interstellar', yearOfPublication: 2014, isInTheaters: false },
  { id: '3', name: 'The Dark Knight', yearOfPublication: 2008, isInTheaters: true },
]

describe('MoviesPage', () => {
  it('shows a loading message while the query is in flight', async () => {
    renderWithProviders(<MoviesPage />, [
      {
        request: { query: GET_MOVIES },
        result: { data: { movies } },
        delay: 50,
      },
    ])

    expect(await screen.findByText('Loading movies…')).toBeInTheDocument()
    expect(await screen.findByText('Inception')).toBeInTheDocument()
  })

  it('renders a card for every movie', async () => {
    renderWithProviders(<MoviesPage />, [
      { request: { query: GET_MOVIES }, result: { data: { movies } } },
    ])

    expect(await screen.findByText('Inception')).toBeInTheDocument()
    expect(screen.getByText('Interstellar')).toBeInTheDocument()
    expect(screen.getByText('The Dark Knight')).toBeInTheDocument()
    expect(screen.getByText('2008 · In theaters')).toBeInTheDocument()
  })

  it('shows the error message when the query fails', async () => {
    renderWithProviders(<MoviesPage />, [
      { request: { query: GET_MOVIES }, error: new Error('boom') },
    ])

    expect(await screen.findByText('Error: boom')).toBeInTheDocument()
  })
})