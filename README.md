# Talesmith

Repositório monolítico contendo o backend em Python (Flask) e o frontend em React.

## Estrutura do Projeto

```
/
├── backend/      # Código do backend (Flask)
├── frontend/     # Código do frontend (React)
├── .gitignore
├── README.md
└── ...
```

## Tecnologias

- **Backend:** Python, Flask, integração com Gemini LLM (Google AI)
- **Frontend:** React, Node.js

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
flask run
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

1. Fork este repositório
2. Crie uma branch (`git checkout -b feature/sua-feature`)
3. Commit suas alterações (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/sua-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.