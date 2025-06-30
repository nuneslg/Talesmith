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

def obter_resposta_do_mestre(contexto, acao=None):
    """Envia um prompt para o Gemini e retorna a resposta."""
    prompt = regras_do_jogo() + "\n" + contexto
    if acao:
        prompt += f"\nAção do jogador: {acao}"
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Ocorreu um erro ao gerar a resposta: {e}"

def regras_do_jogo():
    return """
    **REGRAS DO JOGO:**
    - O jogador começa no nível 1. O nível máximo é 20.
    - Você é o Mestre do Jogo (DM). Guie a narrativa de forma imersiva e responsiva às ações do jogador.
    - Considere as implicações lógicas das ações do jogador no mundo.
    - Se a ação do jogador for muito ambiciosa ou absurda para o contexto atual, você pode impor uma dificuldade de 25 para a rolagem, tornando-a impossível com um d20.
    - Mantenha um tom adequado ao gênero da aventura (ex: fantasia épica, terror, ficção científica).

    **INSTRUÇÕES PARA A RESPOSTA DO MESTRE:**
    - A resposta DEVE ser em **3 linhas**.
    - O primeiro parágrafo descreve o resultado da ação do jogador.
    - O segundo parágrafo detalha as consequências ou novas informações no cenário.
    - O terceiro parágrafo apresenta as opções ou a próxima pergunta para o jogador.
    - A resposta NÃO PODE exceder 150 palavras no total para manter o ritmo.
    """
