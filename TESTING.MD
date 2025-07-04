# Estratégia de Testes - Talesmith

## Visão Geral

Este documento descreve a estratégia de testes adotada no projeto Talesmith, separando as abordagens para o **backend** e o **frontend**.

---

## Backend

### Ferramentas Utilizadas

- [pytest](https://docs.pytest.org/): para escrever e rodar testes unitários no backend.
- [pytest-cov](https://github.com/pytest-dev/pytest-cov): para medir a cobertura de testes.

### Estrutura de Testes

Os testes do backend estão localizados na pasta `tests/`, que espelha a estrutura da pasta `app/`.

Além disso, há um arquivo `pytest.ini` na raiz do projeto que define marcadores personalizados:

```ini
[pytest]
markers =
    unit: marca testes unitários isolados (com mocks)
    integration: marca testes de integração que envolvem componentes reais ou múltiplos módulos
```

### O que está sendo testado

- `routes.py`: testes para os endpoints da API Flask (`/api/cena-inicial`, `/api/acao-jogador`).
- `gemini_service.py`: testes unitários da função `obter_resposta_do_mestre()` com mock da API do Gemini, evitando chamadas reais.
- **Testes de integração**: testes com chamadas reais à API Gemini para validar a resposta da IA a situações complexas, como ações absurdas.


### Rodando os testes

- Rodar todos os testes (unitários e de integração):

```powershell
pytest
```
- Rodar apenas os unitários:
```powershell
pytest -m unit
```
- Rodar somente os testes de integração:

```powershell
pytest -m integration
```

### Cobertura de Testes

- Para medir a cobertura do backend:

```powershell
pytest --cov=app --cov-report=term-missing
```

- Para relatório visual em HTML:

```powershell
pytest --cov=app --cov-report=html
```

O relatório será salvo na pasta `htmlcov/`. Abra no navegador:

```powershell
start .\htmlcov\index.html
```

---

## Frontend