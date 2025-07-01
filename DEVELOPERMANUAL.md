# 🏗️ Manual do Desenvolvedor - Talesmith

> Documento técnico com foco na **arquitetura do sistema** e as **principais responsabilidades funcionais** do projeto.

## 🧱 1. Arquitetura do Sistema

### Tipo de Arquitetura:
- [ ] Monolítica em camadas

### Diagrama de Arquitetura (simplificado):

```plaintext
[Frontend] <--> [Flask] <--> [Backend] <--> [Banco de Dados]

```

### Componentes Principais:
| Componente          | Tecnologia                     | Responsabilidade                             |
|---------------------|--------------------------------|----------------------------------------------|
| Frontend            | React / Node.js                | Interface com o usuário final                |
| Backend/API         | Python / Gemini LLM / Flask    | Lógica funcionamento da API e rotas          |
| Banco de Dados      |               -/-              |                      -/-                     |


---

## 🧩 2. Módulos/Funções do Projeto

### 📂 Módulo: Autenticação
- Registro, login, logout

### 📂 Módulo: Rolagem de dados
- Determina a sorte do jogador ao realizar uma ação

---

## 🧰 3. Tecnologias Utilizadas

| Categoria             | Ferramenta/Stack                         |
|-----------------------|------------------------------------------|
| Frontend              | React, Node.js                           |
| Backend               | Python, Flask, Integração com Gemini LLM |
| Banco de Dados        |                     -/-                  |


---

## 👥 4. Equipe Técnica

| Nome            | Função                            | Contato                   |
|-----------------|-----------------------------------|---------------------------|
| Matheus Aléfe   | Frontend Manager                  | mabs2@cin.ufpe.br         |
| Maycon Otávio   | Frontend Developer                | mobs@cin.ufpe.br          |
| Giovanna Bardi  | Frontend Developer / PO           | gmcb@cin.ufpe.br          |
| Luís Ghuilherme | Backend Manager / DevOps          | igmmn@cin.ufpe.br         |
| Lucas Matheus   | Backend Developer                 | lmsf@cin.ufpe.br          |
| Romero Rego     | Backend Developer                 | rrcf@cin.ufpe.br          |
| Sérgio Lima     | Backend Developer / Documentation | stcml@cin.ufpe.br         |

---

## 📄 5. Licença

Este projeto está licenciado sob a licença MIT.  

---

> Última atualização: `01/07/2025`
