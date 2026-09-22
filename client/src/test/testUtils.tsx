import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { MockedProvider } from '@apollo/client/testing/react'
import type { MockedResponse } from '@apollo/client/testing'

export function renderWithProviders(
  ui: ReactElement,
  mocks: MockedResponse[] = [],
  initialEntries: string[] = ['/'],
) {
  return render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </MockedProvider>,
  )
}

export function renderRoute(
  path: string,
  element: ReactElement,
  mocks: MockedResponse[] = [],
  initialEntries: string[] = [path],
) {
  return render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path={path} element={element} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>,
  )
}