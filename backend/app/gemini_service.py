import random
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv() # Carrega as variáveis de ambiente do arquivo .env

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") # Obtém a chave da API do ambiente
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
        "- A resposta do mestre (incluindo Dificuldade, Rolagem, Resultado imediato, Consequências e Próximas opções) deve ter no máximo 65 palavras.\n"
        "- SISTEMA DE DIFICULDADE:\n"
        "   * Ação fácil: Dificuldade 7\n"
        "   * Ação moderada: Dificuldade 12\n"
        "   * Ação difícil: Dificuldade 18\n"
        "   * Ação quase impossível: Dificuldade 25\n"
        "- Para qualquer ação (luta, construção, negociação, etc) que necessite de rolagem:\n"
        "   * Primeiro mostre: 'Dificuldade: [valor]'\n"
        "   * Pule de linha\n"
        "   * Depois mostre: 'Rolagem: [valor]'\n"
        "   * Pule de linha\n"
        "   * Se rolagem ≥ dificuldade: ação bem-sucedida\n"
        "   * Se rolagem < dificuldade: ação falha com punição\n"
        "- Punições podem ser: dano, perda de recursos, ou consequência narrativa negativa\n"
        "- Perguntas não requerem rolagem.\n"
        "- Ações básicas não necessitam de Rolagem de dados. Considere sucesso independente. Exemplos: observar alguém, entrar em um local, deitar na cama, conversar com alguém.\n"
        "- Ao sair de um combate, a mensagem 'Descanse em algum lugar para sua vida voltar a 100%' deve ser exibida.\n"
        "- Ações sem sentido para o contexto do jogo: responda 'Por favor, mande uma entrada correta.'\n"
        "- O jogador tem 100 pontos de vida. Se chegar a zero, é game over. Descansar recupera a vida totalmente.\n"
        "- FORMATO DA RESPOSTA:\n"
        "   [Dificuldade e rolagem como especificado acima, se aplicável]\n"
        "   [Resultado imediato da ação (máximo 55 palavras para esta seção, consequências e próximas opções combinadas)]\n"
        "   [Consequências no ambiente]\n"
        "   [Próximas opções]\n"
        "\n"
    )

    # Lista de ações que não requerem rolagem
    acoes_basicas_sucesso_automatico = [
        "observar", "entrar", "deitar", "conversar", "falar", "olhar", "ouvir", "andar", "correr", "sentar", "levantar", "dormir"
    ]

    rolagem = None
    dificuldade = 15  # Dificuldade padrão (moderada)
    
    # Verifica se a ação requer rolagem
    acao_requer_rolagem = True
    if acao:
        acao_normalizada = acao.strip().lower()
        if acao_normalizada.endswith('?'):
            acao_requer_rolagem = False
        else:
            for termo in acoes_basicas_sucesso_automatico:
                if termo in acao_normalizada:
                    acao_requer_rolagem = False
                    break

    if acao_requer_rolagem:
        rolagem = Rolagem_de_dados()
        prompt += (
            f"Dificuldade: {dificuldade}\n"
            f"Rolagem: {rolagem}\n"
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