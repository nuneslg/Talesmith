import { describe, it, vi, beforeEach, beforeAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import LoginPage from './LoginPage'
import '@testing-library/jest-dom'

const mockNavigate = vi.fn()

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
})

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('@mantine/notifications', () => ({
  notifications: {
    show: vi.fn(),
  },
}))

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: 'user-123' }),
    })
  )
  vi.clearAllMocks()
})

const TestWrapper = ({ children }) => (
  <MemoryRouter>
    <MantineProvider>
      {children}
    </MantineProvider>
  </MemoryRouter>
)

describe('LoginPage', () => {
  it('renderiza todos os campos e botões corretamente', () => {
    render(<LoginPage />, { wrapper: TestWrapper })

    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/digite sua senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
    expect(screen.getByText(/não possui conta\? registre-se/i)).toBeInTheDocument()
  })

  it('exibe erro se o login falhar', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ erro: 'Credenciais inválidas' }),
    })

    render(<LoginPage />, { wrapper: TestWrapper })
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/e-mail/i), 'teste@invalido.com')
    await user.type(screen.getByPlaceholderText(/digite sua senha/i), 'senhaerrada')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Credenciais inválidas',
          color: 'red',
        })
      )
    })

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('faz login com sucesso e navega para /historias', async () => {
    render(<LoginPage />, { wrapper: TestWrapper })
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/e-mail/i), 'teste@valido.com')
    await user.type(screen.getByPlaceholderText(/digite sua senha/i), 'senhavalida123')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://talesmith.onrender.com/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'teste@valido.com',
            password: 'senhavalida123',
          }),
        })
      )
    })

    expect(notifications.show).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Autenticado com sucesso!',
        color: 'orange',
      })
    )

    expect(mockNavigate).toHaveBeenCalledWith('/historias', { state: { userId: 'user-123' } })
  })

  it('navega para /register ao clicar em "Não possui conta? Registre-se"', async () => {
    render(<LoginPage />, { wrapper: TestWrapper })
    const user = userEvent.setup()

    await user.click(screen.getByText(/não possui conta\? registre-se/i))

    expect(mockNavigate).toHaveBeenCalledWith('/register')
  })
})