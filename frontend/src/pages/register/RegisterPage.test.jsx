import { describe, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import RegisterPage from './RegisterPage'
import { notifications } from '@mantine/notifications'
import { MantineProvider } from '@mantine/core'
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
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// Mock react-router-dom hooks
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock Mantine notifications
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
    }),
  )
  vi.clearAllMocks()
})

const TestWrapper = ({ children }) => 
    <MemoryRouter>
        <MantineProvider>
            {children}
        </MantineProvider>
    </MemoryRouter>

describe('RegisterPage', () => {
  it('renderiza todos os campos e botões corretamente', () => {
    render(<RegisterPage />, { wrapper: TestWrapper })

    expect(screen.getByRole('heading', { name: /registro/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/digite sua senha/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirme sua senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /registrar/i })).toBeInTheDocument()
    expect(screen.getByText(/ja possui conta \? entre/i)).toBeInTheDocument()
  })

  it('valida erros para email inválido, senha curta e senhas diferentes', async () => {
    render(<RegisterPage />, { wrapper: TestWrapper })
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/e-mail/i), 'email-invalido')
    await user.type(screen.getByPlaceholderText(/digite sua senha/i), '123')
    await user.type(screen.getByLabelText(/confirme sua senha/i), '456')

    await user.click(screen.getByRole('button', { name: /registrar/i }))

    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('realiza registro com sucesso, exibe notificação e navega para /historias', async () => {
    render(<RegisterPage />, { wrapper: TestWrapper })
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/nome/i), 'Usuário Teste')
    await user.type(screen.getByLabelText(/e-mail/i), 'teste@valido.com')
    await user.type(screen.getByPlaceholderText(/digite sua senha/i), 'senhavalida123')
    await user.type(screen.getByLabelText(/confirme sua senha/i), 'senhavalida123')

    await user.click(screen.getByRole('button', { name: /registrar/i }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://talesmith.onrender.com/api/auth/signup',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'Usuário Teste',
            email: 'teste@valido.com',
            password: 'senhavalida123',
          }),
        }),
      )
    })

    expect(notifications.show).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Registrado com sucesso!',
        color: 'orange',
      }),
    )

    expect(mockNavigate).toHaveBeenCalledWith('/historias', { state: { userId: 'user-123' } })
  })

  it('exibe notificação de erro se o registro falhar', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ erro: 'Erro no servidor' }),
    })

    render(<RegisterPage />, { wrapper: TestWrapper })
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/nome/i), 'Usuário Teste')
    await user.type(screen.getByLabelText(/e-mail/i), 'teste@valido.com')
    await user.type(screen.getByPlaceholderText(/digite sua senha/i), 'senhavalida123')
    await user.type(screen.getByLabelText(/confirme sua senha/i), 'senhavalida123')

    await user.click(screen.getByRole('button', { name: /registrar/i }))

    await waitFor(() => {
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Erro no servidor',
          color: 'red',
        }),
      )
    })

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('navega para /login ao clicar no link "Já possui conta? Entre"', async () => {
    render(<RegisterPage />, { wrapper: TestWrapper })
    const user = userEvent.setup()

    await user.click(screen.getByText(/ja possui conta \? entre/i))

    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })
})
