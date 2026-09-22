import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { MockedResponse } from '@apollo/client/testing'
import UpdateUsernameForm from './UpdateUsernameForm.tsx'
import { UPDATE_USERNAME } from '../graphql/mutations.ts'
import { GET_USER } from '../graphql/queries.ts'
import type { User } from '../types/index.ts'
import { renderWithProviders } from '../test/testUtils.tsx'

const user: User = {
  id: '1',
  name: 'John Doe',
  username: 'johndoe',
  age: 28,
  nationality: 'AMERICAN',
}

function updateUsernameMocks(newUserName: string, override?: Partial<MockedResponse>): MockedResponse[] {
  return [
    {
      request: {
        query: UPDATE_USERNAME,
        variables: { input: { id: '1', newUserName } },
      },
      result: {
        data: {
          updateUserName: { id: '1', name: 'John Doe', username: newUserName },
        },
      },
      ...override,
    },
    {
      request: { query: GET_USER, variables: { id: '1' } },
      result: { data: { user } },
    },
  ]
}

describe('UpdateUsernameForm', () => {
  it('submits the updateUsername mutation with the id and new username', async () => {
    renderWithProviders(<UpdateUsernameForm userId="1" />, updateUsernameMocks('newuser'))

    const testUser = userEvent.setup()
    await testUser.type(screen.getByLabelText('New username'), 'newuser')
    await testUser.click(screen.getByRole('button', { name: 'Update' }))

    await waitFor(() => expect(screen.getByLabelText('New username')).toHaveValue(''))
    expect(screen.queryByText('Error:')).not.toBeInTheDocument()
  })

  it('shows a loading label while updating', async () => {
    renderWithProviders(
      <UpdateUsernameForm userId="1" />,
      updateUsernameMocks('newuser', { delay: 50 }),
    )

    const testUser = userEvent.setup()
    await testUser.type(screen.getByLabelText('New username'), 'newuser')
    await testUser.click(screen.getByRole('button', { name: 'Update' }))

    const loadingButton = await screen.findByRole('button', { name: 'Updating…' })
    expect(loadingButton).toBeDisabled()
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Update' })).toBeEnabled(),
    )
  })

  it('shows the error message when the mutation fails', async () => {
    renderWithProviders(<UpdateUsernameForm userId="1" />, [
      {
        request: {
          query: UPDATE_USERNAME,
          variables: { input: { id: '1', newUserName: 'newuser' } },
        },
        error: new Error('boom'),
      },
      {
        request: { query: GET_USER, variables: { id: '1' } },
        result: { data: { user } },
      },
    ])

    const testUser = userEvent.setup()
    await testUser.type(screen.getByLabelText('New username'), 'newuser')
    await testUser.click(screen.getByRole('button', { name: 'Update' }))

    expect(await screen.findByText('Error: boom')).toBeInTheDocument()
  })
})