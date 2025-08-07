import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import '@testing-library/jest-dom';
import ChatPage from "./ChatPage";

vi.hoisted(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    enumerable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),      // deprecated
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate, // Sobrescrevemos useNavigate para usar nosso mock
  };
});


// Wrapper para prover o contexto do Mantine e do Router
const TestWrapper = ({ children }) => (
  <MemoryRouter>
    <MantineProvider>{children}</MantineProvider>
  </MemoryRouter>
);

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

beforeEach(() => {
  global.fetch = vi.fn()
});

afterEach(() => {
  vi.clearAllMocks()
});

test("deve renderizar o título, input e botão", () => {
  render(<ChatPage />, { wrapper: TestWrapper });
  expect(screen.getByText("Talesmith")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Digite sua história..."));
});

test("deve permitir digitar no input", () => {
  render(<ChatPage />, { wrapper: TestWrapper });
  const input = screen.getByPlaceholderText(/Digite sua história/i);
  fireEvent.change(input, { target: { value: "Olá mundo" } });
  expect(input.value).toBe("Olá mundo");
});

test("não deve enviar mensagem se input estiver vazio", () => {
  render(<ChatPage />, { wrapper: TestWrapper });
  const input = screen.getByPlaceholderText(/Digite sua história/i);
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
  expect(global.fetch).not.toHaveBeenCalled();
});

test("deve enviar mensagem e exibir resposta da IA", async () => {
  global.fetch.mockResolvedValueOnce({
    json: async () => ({ resposta: "Olá, jogador!" }),
  });

  render(<ChatPage />, { wrapper: TestWrapper });

  const input = screen.getByPlaceholderText(/Digite sua história/i);
  fireEvent.change(input, { target: { value: "Oi" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  expect(await screen.findByText("Oi")).toBeInTheDocument();

  expect(await screen.findByText("Olá, jogador!")).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledTimes(1);
});


