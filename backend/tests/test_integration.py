import pytest
from app.gemini_service import obter_resposta_do_mestre



@pytest.mark.integration
def test_integration_resposta_absurda():
    prompt = "Quero matar um dragão com um peteleco."
    resultado = obter_resposta_do_mestre(prompt)

    assert isinstance(resultado, str)
    assert len(resultado.split()) <= 150
    assert "sua força não é suficiente para isso" in resultado.lower()

