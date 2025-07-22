import random
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv() # Carrega as variáveis de ambiente do arquivo .env

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")  # Obtém a chave da API do ambiente
print("GOOGLE_API_KEY no gemini_service:", GOOGLE_API_KEY) # Verifica se a chave foi carregada corretamente

# Configure a chave da API
genai.configure(api_key=GOOGLE_API_KEY)

# Tentar com o modelo 'models/gemini-2.0-flash'
MODEL_NAME = 'models/gemini-2.0-flash'
model = genai.GenerativeModel(MODEL_NAME)

def Rolagem_de_dados():
    """Rola um dado de 20 lados (D20) e retorna o resultado."""
    return random.randint(1, 20)

def obter_resposta_do_mestre(contexto, acao=None):
    """Envia um prompt para o Gemini e retorna a resposta com sistema de rolagem de dados."""

    prompt = (
        "REGRAS DO JOGO:\n"
        "- O jogador começa no nível 1. O nível máximo é 20.\n"
        "- Você é o Mestre do Jogo (DM). Guie a narrativa de forma imersiva e responsiva às ações do jogador.\n"
        "- Considere as implicações lógicas das ações do jogador no mundo.\n"
        "- SISTEMA DE DIFICULDADE:\n"
        "  * Ação fácil: Dificuldade 7\n"
        "  * Ação moderada: Dificuldade 10\n"
        "  * Ação difícil: Dificuldade 18\n"
        "  * Ação quase impossível: Dificuldade 25\n"
        "- Para qualquer ação (luta, construção, negociação, etc):\n"
        "  * Primeiro mostre: 'Dificuldade da sua ação: [valor]'\n"
        "  * Depois mostre: 'Resultado da Rolagem de dados: [valor]'\n"
        "  * Se rolagem ≥ dificuldade: ação bem-sucedida\n"
        "  * Se rolagem < dificuldade: ação falha com punição\n"
        "- Punições podem ser: dano, perda de recursos, ou consequência narrativa negativa\n"
        "- Perguntas não requerem rolagem.\n"
        "- Ações impossíveis: responda 'Sua força não é suficiente para isso' com punição\n"
        "- FORMATO DA RESPOSTA:\n"
        "  [Dificuldade e rolagem como especificado acima]\n"
        "  [Resultado imediato da ação]\n"
        "  [Consequências no ambiente]\n"
        "  [Próximas opções]\n"
        "- Limite de 150 palavras.\n"
        "\n"
    )

    # Sistema de rolagem para ações (exceto perguntas)
    rolagem = None
    dificuldade = 15  # Dificuldade padrão (moderada)
    
    if acao and not acao.strip().endswith('?'):
        rolagem = Rolagem_de_dados()
        prompt += (
            f"=== DADOS DA AÇÃO ===\n"
            f"Dificuldade da sua ação: {dificuldade}\n"
            f"Resultado da Rolagem de dados: {rolagem}\n"
            f"Tipo de resultado: {'SUCESSO' if rolagem >= dificuldade else 'FALHA'}\n\n"
        )

    prompt += f"Contexto atual:\n{contexto.strip()}\n\n"
    if acao:
        prompt += f"Ação do jogador: {acao.strip()}\n\n"

    prompt += "Resposta do Mestre (siga exatamente o formato especificado nas regras):\n"

     try:
        response = model.generate_content(prompt)
        texto_da_resposta = response.text
        with open("arquivo_log.txt", 'w') as arq:
            arq.write(texto_da_resposta)
        return texto_da_resposta
    except Exception as e:
        return f"Ocorreu um erro ao gerar a resposta: {e}"