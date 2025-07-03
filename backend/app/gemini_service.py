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

    prompt = (
        "REGRAS DO JOGO:\n"
        "- O jogador começa no nível 1. O nível máximo é 20.\n"
        "- Você é o Mestre do Jogo (DM). Guie a narrativa de forma imersiva e responsiva às ações do jogador.\n"
        "- Considere as implicações lógicas das ações do jogador no mundo.\n"
        "- Se a ação do jogador for absurda ou impossível, trate como falha automática ou descreva a dificuldade 25 para impedir a ação.\n"
        "- A resposta DEVE conter: 'Sua força não é suficiente para isso' se a ação for impossível.\n"
        "- Mantenha o tom adequado ao gênero da aventura.\n"
        "- Sempre responda em 3 parágrafos:\n"
        "  1. Resultado direto da ação.\n"
        "  2. Consequências no ambiente e narrativa.\n"
        "  3. Próximas opções para o jogador.\n"
        "- Nunca ultrapasse 150 palavras.\n"
        "- Seja fiel às regras acima, mesmo que a ação do jogador pareça criativa ou divertida.\n"
        "- EXEMPLO DE AÇÃO ABSURDA: 'Quero destruir uma cidade com um olhar' → resultado deve ser falha ou resposta proporcional ao nível do jogador.\n"
        "\n"
    )

    prompt += f"Contexto atual da aventura:\n{contexto.strip()}\n\n"
    if acao:
        prompt += f"Ação do jogador: {acao.strip()}\n\n"

    prompt += "Resposta do Mestre:\n"

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Ocorreu um erro ao gerar a resposta: {e}"

