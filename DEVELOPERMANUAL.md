# Talesmith – Developer Manual

## Arquitetura do Projeto

### Arquitetura geral: **Monolítica em camadas - Frontend + Backend desacoplados (client-server)**

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

## Tecnologias Utilizadas

### Backend
- **Python 3.10+**
- **Flask** – Framework leve para criação da API.
- **Gemini API** – Integração com modelo de linguagem da Google.

### Frontend
- **React** – Framework SPA para a interface do usuário.
- **Node.js 18+ / npm** – Ambiente para executar e gerenciar pacotes.

---

## Estrutura dos Diretórios

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

## Descrição das funções principais

- **BACK/ Chamada da API do Gemini: gemini_service.py**

          obter_resposta_do_mestre(): Monta um prompt com regras de RPG e o contexto da história, o enviando para a API do gemini.

Retorna o texto gerado como resposta da IA. Se houver erro na chamada da API, uma mensagem de erro personalizada é retornada.

- **BACK/ Receber contexto inicial e ações do jogador: routes.py**

          cena-inicial(): recebe um contexto via POST e envia esse contexto para a LLM, que retorna a introdução da narrativa.

          acao-jogador(): recebe contexto e acao e retorna a continuação da história com base neles.

Ambas as rotas usam a função obter_resposta_do_mestre() para gerar o texto narrativo e devolvem a resposta em formato JSON. Essas rotas são integradas à aplicação Flask pela função init_routes(app).

- **FRONT/ Interação direta com o jogador: ChatPage.jsx**
          
          sendMessage(): checa entre modo contexto e modo ação, controla o turno do usuário e envia o POST para o back.

          useEffect(): automaticamente scrolla a pagina para baixo quando é enviada uma mensagem
          obs:. estes se encontram em chatpage{}

Retorna a estrutura e conteudos da pagina

---

## Como Executar o Projeto

Veja o arquivo `README.md` para saber como executar o projeto.

---
## Testes

Veja o arquivo `TESTING.md` para saber como realizar os testes.

---
## Contribuição

Antes de contribuir, leia `CONTRIBUTING.md` para saber das convenções utilizadas.

---
Atualizado pela ultima vez em 05/08/2025
