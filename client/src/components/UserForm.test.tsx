import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { MockedResponse } from '@apollo/client/testing'
import UserForm from './UserForm.tsx'
import { CREATE_USER } from '../graphql/mutations.ts'
import { GET_USERS } from '../graphql/queries.ts'
import type { User } from '../types/index.ts'
import { renderWithProviders } from '../test/testUtils.tsx'

const createdUser: User = {
  id: '5',
  name: 'Ada Lovelace',
  username: 'ada',
  age: 36,
  nationality: 'AMERICAN',
}

function userFormMocks(variables: object): MockedResponse[] {
  return [
    {
      request: { query: CREATE_USER, variables },
      result: { data: { createUser: createdUser } },
    },
    { request: { query: GET_USERS }, result: { data: { users: [] } } },
  ]
}

const fillForm = async (name = 'Ada Lovelace', username = 'ada', age = '36') => {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Name'), name)
  await user.type(screen.getByLabelText('Username'), username)
  await user.type(screen.getByLabelText('Age'), age)
  return user
}

describe('UserForm', () => {
  it('submits the createUser mutation with the entered values and clears the form', async () => {
    renderWithProviders(
      <UserForm />,
      userFormMocks({
        input: { name: 'Ada Lovelace', username: 'ada', age: 36, nationality: 'AMERICAN' },
      }),
    )

    const user = await fillForm()
    await user.click(screen.getByRole('button', { name: 'Create User' }))

    await waitFor(() => expect(screen.getByLabelText('Name')).toHaveValue(''))
    expect(screen.getByLabelText('Username')).toHaveValue('')
    expect(screen.getByLabelText('Age')).toHaveValue(null)
    expect(screen.getByLabelText('Nationality')).toHaveValue('AMERICAN')
    expect(screen.queryByText('Error:')).not.toBeInTheDocument()
  })

  it('submits the selected nationality (COLLOMBIAN)', async () => {
    renderWithProviders(
      <UserForm />,
      userFormMocks({
        input: { name: 'Carla', username: 'carla', age: 22, nationality: 'COLLOMBIAN' },
      }),
    )

    const user = await fillForm('Carla', 'carla', '22')
    await user.selectOptions(screen.getByLabelText('Nationality'), 'COLLOMBIAN')
    await user.click(screen.getByRole('button', { name: 'Create User' }))

    await waitFor(() => expect(screen.getByLabelText('Name')).toHaveValue(''))
    expect(screen.queryByText('Error:')).not.toBeInTheDocument()
  })

  it('disables the button and shows a loading label while creating', async () => {
    renderWithProviders(<UserForm />, [
      {
        request: {
          query: CREATE_USER,
          variables: {
            input: { name: 'Ada Lovelace', username: 'ada', age: 36, nationality: 'AMERICAN' },
          },
        },
        result: { data: { createUser: createdUser } },
        delay: 50,
      },
      { request: { query: GET_USERS }, result: { data: { users: [] } } },
    ])

    const user = await fillForm()
    await user.click(screen.getByRole('button', { name: 'Create User' }))

    const loadingButton = await screen.findByRole('button', { name: 'Creating…' })
    expect(loadingButton).toBeDisabled()
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Create User' })).toBeEnabled(),
    )
  })

  it('shows the error message when the mutation fails', async () => {
    renderWithProviders(<UserForm />, [
      {
        request: {
          query: CREATE_USER,
          variables: {
            input: { name: 'Ada Lovelace', username: 'ada', age: 36, nationality: 'AMERICAN' },
          },
        },
        error: new Error('boom'),
      },
      { request: { query: GET_USERS }, result: { data: { users: [] } } },
    ])

    const user = await fillForm()
    await user.click(screen.getByRole('button', { name: 'Create User' }))

    expect(await screen.findByText('Error: boom')).toBeInTheDocument()
  })
})