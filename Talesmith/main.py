import google.generativeai as genai
import Rolagem_de_dados

# Substitua pela sua chave de API
GOOGLE_API_KEY = "AIzaSyCc29rVJdsrPC1MLRQrASdmRyxQ_B3ZHds"

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

def Regras_do_jogo(prompt):
    prompt = """
    **INSTRUÇÕES PARA A RESPOSTA:**
    - A resposta DEVE ser em formato de 3 linhas.
    - A resposta NÃO PODE exceder 100 palavras.
    - A resposta do jogador deve ser analisada e caso seja uma ação considera pela API "absurda" a dificuldade da rolagem sera 25 sendo que o dado so tem 20 lados logo tornando impossivel a ação.
    - O Jogador sempre começa no nivel 1 e limite Maximo e nivel 20.
    """
    return prompt # Retorna o prompt com as regras

if __name__ == "__main__":
    print("Bem-vindo ao Talesmith\n")
    print("Criaremos uma historia empolgante de RPG, mas antes me diga como e a historia que deseja jogar\n")
    print()

    Decisao_do_jogador = input("\nDeseja criar uma nova aventura ? Se sim Digite (Nova aventura)\n")
    if (Decisao_do_jogador == "Nova aventura"):
        Nome_do_personagem = input("Digite o nome do Personagem:\n")

        # Define as regras do jogo e as inclui no contexto
        regras = Regras_do_jogo("") # Chama a função para obter as regras
        
        # Defina o contexto da aventura
        contexto_inicial = input("Descreva o cenário inicial da aventura (local, época, situação geral):\n ")
        
        # --- PRIMEIRA MUDANÇA AQUI ---
        prompt_contexto = f"{regras}\nContexto da aventura: {contexto_inicial}. Descreva a cena inicial para os jogadores, destacando detalhes importantes e atmosferas."
        resposta_contexto = obter_resposta_do_mestre(prompt_contexto)
        print("\nCena Inicial:\n", resposta_contexto)

        while True:
            acao_do_jogador = input("\nO que seu personagem faz? (ou 'sair' para encerrar):\n")
            if acao_do_jogador.lower() == 'sair':
                break

            # --- SEGUNDA MUDANÇA AQUI ---
            prompt_acao = f"{regras}\nContexto da aventura: {contexto_inicial}. A ação dos jogadores é: {acao_do_jogador}. Como mestre, descreva o resultado dessa ação e as próximas possibilidades."
            resposta_acao = obter_resposta_do_mestre(prompt_acao)

            print("\nResposta do Talesmith:\n", resposta_acao)

        print("\nAventura encerrada!")
