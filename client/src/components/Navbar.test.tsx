import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import Navbar from './Navbar.tsx'

function renderNavbar(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Navbar />
    </MemoryRouter>,
  )
}

describe('Navbar', () => {
  it('renders the title and both links', () => {
    renderNavbar('/')

    expect(screen.getByText('GraphQL Tutorial')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Users' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Movies' })).toBeInTheDocument()
  })

  it('marks the active route link as active', () => {
    renderNavbar('/')

    expect(screen.getByRole('link', { name: 'Users' })).toHaveClass('active')
    expect(screen.getByRole('link', { name: 'Movies' })).not.toHaveClass('active')
  })

  it('marks Movies active when on the movies route', () => {
    renderNavbar('/movies')

    expect(screen.getByRole('link', { name: 'Movies' })).toHaveClass('active')
    expect(screen.getByRole('link', { name: 'Users' })).not.toHaveClass('active')
  })
})