# Talesmith - Guia de Contribuição

Este documento orienta sobre como contribuir com nosso projeto de forma clara, organizada e padronizada.

---

## Fluxo de colaboração no repositório

1. **Criação de issues**:
   - Use issues para relatar bugs, sugerir melhorias ou iniciar discussões.
   - Escreva títulos descritivos e explique bem o contexto.

2. **Fork e branches**:
   - Faça um fork do repositório.
   - Crie uma branch descritiva a partir da `main` ou `dev`, conforme o tipo de contribuição (veja convenções de branches abaixo).

3. **Commits e PRs**:
   - Commits devem ser pequenos, frequentes e descritivos.
   - Abra um Pull Request apontando para a branch principal (`main`) ou para `dev` se for trabalho em progresso.
   - Relacione a issue correspondente no corpo do PR (se aplicável).

4. **Revisão e merge**:
   - Cada PR será revisado por ao menos um membro do grupo antes de ser integrado.
   - Se houver mudanças solicitadas, atualize a mesma branch.
   - Mais informações sobre regras de revisão abaixo.

---

## Convenções de nomes de branches

- `main`: versão estável e pronta para produção.
- `dev`: integração de funcionalidades em desenvolvimento.
- `feature/nome`: nova funcionalidade (ex: `feature/login`)
- `bugfix/nome`: correção de bug (ex: `bugfix/cadastro`)
- `docs/nome`: alterações apenas de documentação (ex: `docs/contributing-md`)

---

## Convenções de mensagens de commit

Usamos mensagens claras e devem seguir o seguinte padrão:

`<tipo>(<escopo>): <descrição da ação>`

####  Tipo:
- `feat:` nova funcionalidade
- `fix:` correção de erro
- `docs:` documentação apenas
- `style:` mudanças de formatação (espaços, identação, etc.)
- `refactor:` refatoração de código (sem mudar comportamento)
- `test:` adição ou alteração de testes
- `chore:` tarefas administrativas ou de build

#### Escopo: 
Parte ou módulo do projeto afetado (ex: `rotas`, `modelo`, `front`, `config`, etc.).

#### Descrição da ação:
Breve descrição do que foi feito, com verbos no infinitivo sem conjunção (ex: *"criar tela de login"*, *"atualizar rota de usuário"*, etc.). A ideia é que a mensagem possa ser lida como: *"Este commit irá (criar tela de login)"*.

- Exemplo de commit: "feat(rotas): criar endpoint de listagem de usuários"
---

## Regras para revisar código

- Todo código novo ou alterado deve passar por revisão antes do merge.
- Comentários devem ser respeitosos e com foco na melhoria do projeto.
- O código deve seguir as boas práticas do Python (PEP8).
- Evite duplicação de código e preferira funções bem nomeadas e concisas.
- Sempre que possível, cubra funcionalidades com testes automatizados.

---

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
