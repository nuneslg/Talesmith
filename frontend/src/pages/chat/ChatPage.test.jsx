import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import ChatPage from "./ChatPage";

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
    render(<ChatPage />);
    expect(screen.getByText("Talesmith")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite sua história..."));
});

test("deve permitir digitar no input", () => {
    render(<ChatPage />);
    const input = screen.getByPlaceholderText(/Digite sua história/i);
    fireEvent.change(input, { target: { value: "Olá mundo" } });
    expect(input.value).toBe("Olá mundo");
});

test("não deve enviar mensagem se input estiver vazio", () => {
    render(<ChatPage />);
    const input = screen.getByPlaceholderText(/Digite sua história/i);
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(global.fetch).not.toHaveBeenCalled();
});

test("deve enviar mensagem e exibir resposta da IA", async () => {
    global.fetch.mockResolvedValueOnce({
        json: async () => ({ resposta: "Olá, jogador!" }),
    });

    render(<ChatPage />);

    const input = screen.getByPlaceholderText(/Digite sua história/i);
    fireEvent.change(input, { target: { value: "Oi" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(await screen.findByText("Oi")).toBeInTheDocument();

    expect(await screen.findByText("Olá, jogador!")).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(1);
});


