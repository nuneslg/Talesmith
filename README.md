# Talesmith

Talesmith é uma aplicação web interativa que simula um mestre de RPG (role-playing game) por meio de uma LLM (Large Language Model). Os jogadores interagem com uma interface amigável que traduz suas ações e escolhas em eventos narrativos dinâmicos conduzidos por IA.

Talesmith foi criado por alunos na UFPE como um projeto da disciplina Desenvolvimento de Software.

## Tecnologias utilizadas

- **Backend:** Python, Flask, integração com Gemini LLM (Google AI), Render, PostgreSQL
- **Frontend:** React, Node.js, Shepherd.js

## Como rodar o projeto

### Pré-requisitos

- Python 3.10+
- Node.js 18+
- npm ou yarn

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Configure as variáveis de ambiente em .env
python init_db.py
python run.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Variáveis de Ambiente

Crie um arquivo `.env` em `backend/` com suas configurações, por exemplo:

```
FLASK_ENV=development
GEMINI_API_KEY=sua-chave-aqui
```

## Contribuindo

Antes de contribuir, leia [CONTRIBUTING.md](https://github.com/teamfortr3ss2/Talesmith/blob/main/CONTRIBUTING.md) e [DEVELOPERMANUAL.md](https://github.com/teamfortr3ss2/Talesmith/blob/main/DEVELOPERMANUAL.md) para saber das convenções utilizadas e entender como funciona a estrutura do projeto.

## Licença

Este projeto está sob a licença MIT.
