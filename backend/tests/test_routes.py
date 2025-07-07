import pytest
from app.gemini_service import obter_resposta_do_mestre
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_cena_inicial_route(client):
    payload = {"contexto": "Placeholder contexto para cena inicial"}
    response = client.post("/api/cena-inicial", json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert "resposta" in data
    assert isinstance(data["resposta"], str)
    assert len(data["resposta"]) > 0


def test_acao_jogador_route(client):
    payload = {"contexto": "Placeholder contexto para ação do jogador", "acao": "Placeholder ação"}
    response = client.post("/api/acao-jogador", json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert "resposta" in data
    assert isinstance(data["resposta"], str)
    assert len(data["resposta"]) > 0