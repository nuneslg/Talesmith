import pytest
from unittest.mock import patch, MagicMock
from app.gemini_service import obter_resposta_do_mestre

def test_obter_resposta_do_mestre_sucesso():
    prompt = "O jogador tenta escalar uma montanha íngreme com as mãos nuas."
    resposta_simulada = (
        "Você começa a escalar com dificuldade, os dedos se firmando em pequenas saliências.\n\n"
        "O vento sopra forte e pequenas pedras se soltam, dificultando a escalada. Seu progresso é lento.\n\n"
        "Você pode tentar continuar escalando, procurar um abrigo ou descer antes que escureça."
    )

    # mock da função generate_content para simular a resposta do modelo
    with patch("app.gemini_service.model.generate_content") as mock_generate:
        mock_response = MagicMock()
        mock_response.text = resposta_simulada
        mock_generate.return_value = mock_response

        resultado = obter_resposta_do_mestre(prompt) # chama com o prompt de teste

        assert resultado == resposta_simulada
        # verifica se a resposta tem o formato correto
        assert isinstance(resultado, str)
        assert len(resultado.split()) <= 150

def test_obter_resposta_do_mestre_erro():
    prompt = "Teste de prompt"

    with patch("app.gemini_service.model.generate_content") as mock_generate:
        mock_generate.side_effect = Exception("Erro de API")

        resultado = obter_resposta_do_mestre(prompt)

        assert "Ocorreu um erro ao gerar a resposta" in resultado
