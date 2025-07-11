import google.generativeai as genai
import os
from dotenv import load_dotenv
import random

load_dotenv() # Carrega as variáveis de ambiente do arquivo .env


GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")  # Obtém a chave da API do ambiente
print("GOOGLE_API_KEY no gemini_service:", GOOGLE_API_KEY) # Verifica se a chave foi carregada corretamente

# Configure a chave da API
genai.configure(api_key=GOOGLE_API_KEY)

# Tentar com o modelo 'models/gemini-2.0-flash'
MODEL_NAME = 'models/gemini-2.0-flash'
model = genai.GenerativeModel(MODEL_NAME)

def rolar_d20():
    """
    Rola um dado de 20 lados e retorna o resultado.
    Exibe o resultado no console.
    """
    print("\nOs dados estão sendo rolados... Boa sorte!")
    resultado = random.randint(1, 20)
    print(f"Resultado do dado: {resultado}")
    return resultado

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


    # Verifica se uma ação foi fornecida para rolagem de dados
    if acao and acao.strip(): # Garante que a ação não é vazia ou apenas espaços
        resultado_dado = rolar_d20() # Rola o dado D20
        prompt += f"Ação do jogador: {acao.strip()}\n"
        prompt += f"Resultado da rolagem de dado (D20): {resultado_dado}\n\n" # Adiciona o resultado ao prompt
    elif acao is not None: # Se 'acao' foi fornecido mas está vazio, ainda o inclui no prompt
        prompt += f"Ação do jogador: {acao.strip()}\n\n"

    prompt += "Resposta do Mestre:\n"

    try:
        response = model.generate_content(prompt)
        texto_da_resposta = response.text
        with open ("arquivo_log.txt", 'w') as arq:
            arq.write(texto_da_resposta)
        return texto_da_resposta
    except Exception as e:
        return f"Ocorreu um erro ao gerar a resposta: {e}"

