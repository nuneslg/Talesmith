import { describe, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom'; 
import RPGConfig from './RPGConfig';
import '@testing-library/jest-dom';

// Mock do navigate do react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: { userId: 'user-123' } }),
  };
});

// Mock global fetch para as requisições POST do handleSubmit
global.fetch = vi.fn();

const TestWrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

describe('RPGConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar todos os campos do formulário', () => {
    render(<RPGConfig />, { wrapper: TestWrapper });

    expect(screen.getByLabelText(/qual é o título do personagem\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/qual é o nome do personagem\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/qual é a raça do personagem\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/qual é a classe do personagem\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/qual é o nível do personagem\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/qual é a força do personagem\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/qual é a destreza do personagem\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/qual é a constituição do personagem\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/qual é a sabedoria do personagem\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/qual é a inteligência do personagem\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/qual é o carisma do personagem\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/qual é a história do personagem\?/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /começar aventura/i })).toBeInTheDocument();
  });

  it('deve enviar formulário com dados válidos e navegar para /chat', async () => {
    const mockHistoriaResponse = { id: 'historia-123' };
    const mockCenaResponse = { resposta: 'Cena inicial criada' };

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockHistoriaResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCenaResponse,
      });

    render(<RPGConfig />, { wrapper: TestWrapper });

    const user = userEvent.setup();

    // Preenche os campos
    await user.type(screen.getByLabelText(/qual é o título do personagem\?/i), 'O Bravo');
    await user.type(screen.getByLabelText(/qual é o nome do personagem\?/i), 'Arion');
    await user.type(screen.getByLabelText(/qual é a raça do personagem\?/i), 'Humano');
    await user.selectOptions(screen.getByLabelText(/qual é a classe do personagem\?/i), 'Guerreiro');
    await user.selectOptions(screen.getByLabelText(/qual é o nível do personagem\?/i), '5');
    await user.selectOptions(screen.getByLabelText(/qual é a força do personagem\?/i), '15');
    await user.selectOptions(screen.getByLabelText(/qual é a destreza do personagem\?/i), '14');
    await user.selectOptions(screen.getByLabelText(/qual é a constituição do personagem\?/i), '13');
    await user.selectOptions(screen.getByLabelText(/qual é a sabedoria do personagem\?/i), '12');
    await user.selectOptions(screen.getByLabelText(/qual é a inteligência do personagem\?/i), '11');
    await user.selectOptions(screen.getByLabelText(/qual é o carisma do personagem\?/i), '10');
    await user.type(screen.getByLabelText(/qual é a história do personagem\?/i), 'Um bravo guerreiro da floresta.');

    // Clica no botão enviar
    await user.click(screen.getByRole('button', { name: /começar aventura/i }));

    // Espera que as chamadas fetch tenham sido feitas corretamente
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);

      // Primeiro fetch - criação da história
      expect(fetch).toHaveBeenCalledWith(
        'https://talesmith.onrender.com/api/historias/',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.any(String),
        }),
      );

      // Segundo fetch - criação da cena inicial
      expect(fetch).toHaveBeenCalledWith(
        'https://talesmith.onrender.com/api/cena-inicial',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('"historia_id":"historia-123"'),
        }),
      );

      // Espera navegação para /chat com estado correto
      expect(mockNavigate).toHaveBeenCalledWith('/chat', {
        state: {
          config: {
            id: 'historia-123',
            contexto: 'Um bravo guerreiro da floresta.',
          },
          isNew: true,
        },
      });
    });
  });

  it('deve mostrar erro se requisição da história falhar', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Erro de servidor' }),
    });

    render(<RPGConfig />, { wrapper: TestWrapper });

    const user = userEvent.setup();

    // Preenche campos mínimos necessários
    await user.type(screen.getByLabelText(/qual é o título do personagem\?/i), 'O Bravo');
    await user.type(screen.getByLabelText(/qual é a história do personagem\?/i), 'História curta');

    // Mock window.alert para capturar chamadas
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await user.click(screen.getByRole('button', { name: /começar aventura/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Erro ao salvar a história'));
    });

    alertSpy.mockRestore();
  });

  it('deve mostrar erro se requisição da cena inicial falhar', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'historia-123' }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Erro na cena' }),
      });

    render(<RPGConfig />, { wrapper: TestWrapper });

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/qual é o título do personagem\?/i), 'O Bravo');
    await user.type(screen.getByLabelText(/qual é a história do personagem\?/i), 'História curta');

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await user.click(screen.getByRole('button', { name: /começar aventura/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Erro ao obter cena inicial'));
    });

    alertSpy.mockRestore();
  });

});
