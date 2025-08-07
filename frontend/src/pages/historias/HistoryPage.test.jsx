import { describe, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

// Mock do Shepherd.js antes de importar o componente
vi.mock('shepherd.js', () => {
  return {
    default: {
      Tour: vi.fn().mockImplementation(() => ({
        addStep: vi.fn(),
        start: vi.fn(),
      })),
    },
  }
})

// Agora importe seu componente que usa Shepherd
import TelaInicial from './HistoryPages'

// Mock do navigate e location do react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: { userId: 'user-123' } }),
  }
})

// Mock global fetch antes de cada teste
beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    }),
  )
  vi.clearAllMocks()
})

const TestWrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>

describe('TelaInicial', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve iniciar o tutorial Shepherd ao clicar no botão "Como usar esta tela"', async () => {
    render(<TelaInicial />, { wrapper: TestWrapper })

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /como usar esta tela/i }))

    // Pega a instância mockada da Tour
    const Shepherd = await import('shepherd.js')
    const tourInstance = Shepherd.default.Tour.mock.results[0].value

    expect(tourInstance.addStep).toHaveBeenCalled()
    expect(tourInstance.start).toHaveBeenCalled()
  })

  // ... seus outros testes aqui
})
