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

def obter_resposta_do_mestre(prompt):
    """Envia um prompt para o Gemini e retorna a resposta."""
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Ocorreu um erro ao gerar a resposta: {e}"

def regras_do_jogo():
    return """
    **INSTRUÇÕES PARA A RESPOSTA:**
    - A resposta DEVE ser em formato de 3 linhas.
    - A resposta NÃO PODE exceder 100 palavras.
    - A resposta do jogador deve ser analisada e caso seja uma ação considerada "absurda" pela API, a dificuldade da rolagem será 25, sendo que o dado só tem 20 lados, logo tornando impossível a ação.
    - O Jogador sempre começa no nível 1 e limite máximo é nível 20.
    """
