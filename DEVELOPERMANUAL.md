# 🛠️ Talesmith – Developer Manual

## 📖 Visão Geral

Talesmith é uma aplicação web interativa que simula um mestre de RPG (role-playing game) por meio de uma LLM (Large Language Model). Os jogadores interagem com uma interface amigável que traduz suas ações e escolhas em eventos narrativos dinâmicos conduzidos por IA.

---

## 🧱 Arquitetura do Projeto

### Arquitetura geral: **Um monólito modularizado - Frontend + Backend desacoplados (client-server)**

```
[ React Frontend ]  <-->  [ Flask API Backend ]  <-->  [ Gemini LLM (via API) ]
        |                            |
     Usuário                     Processamento
     (input/output)             de comandos e lógica
```

- **Frontend (React/Node.js)**: Responsável por renderizar a interface e capturar interações do jogador.
- **Backend (Flask/Python)**: Faz a ponte entre o frontend e a LLM. Recebe os comandos do jogador, envia à LLM e retorna as respostas narrativas.
- **Gemini (LLM)**: Gera a narrativa com base no contexto do jogo e nas ações do jogador.

---

## 🧰 Tecnologias Utilizadas

### Backend
- **Python 3.10+**
- **Flask** – Framework leve para criação da API.
- **Gemini API** – Integração com modelo de linguagem da Google.

### Frontend
- **React** – Framework SPA para a interface do usuário.
- **Node.js 18+ / npm** – Ambiente para executar e gerenciar pacotes.

---

## 📦 Estrutura dos Diretórios

```plaintext
/
├── backend/
│   ├── app/               # Código principal do backend
│   ├── routes/            # Rotas Flask
│   ├── services/          # Integração com a LLM
│   ├── .env               # Variáveis de ambiente
│   └── run.py             # Ponto de entrada do backend
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas principais
│   │   ├── services/      # Comunicação com API
│   │   └── App.jsx        # Componente principal
│
├── README.md
├── DEVELOPERMANUAL.md
├── TESTING.md
└── CONTRIBUTING.md
```

---

## 📌 Funcionalidades Principais

- Início de aventuras com prompts customizados.
- Narração interativa via LLM.
- Histórico da história e contexto mantidos pelo backend.
- Comunicação assíncrona entre frontend e backend.

---

## 🚀 Como Executar o Projeto

Veja o arquivo `README.md` para saber como executar o projeto.

---

## 🧪 Testes

Veja o arquivo `TESTING.md` para saber como executar testes unitários e manuais.

---

## 🤝 Contribuição

Antes de contribuir, leia `CONTRIBUTING.md` para saber das convenções utilizadas.

---
Atualizado pela ultima vez em 04/07/2025
