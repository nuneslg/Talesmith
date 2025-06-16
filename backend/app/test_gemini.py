from gemini_service import obter_resposta_do_mestre, regras_do_jogo

def main():
    print("Bem-vindo ao Talesmith\n")
    print("Criaremos uma historia empolgante de RPG, mas antes me diga como é a historia que deseja jogar\n")

    decisao_do_jogador = input("\nDeseja criar uma nova aventura? Se sim, digite (Nova aventura):\n")
    if decisao_do_jogador.lower() == "nova aventura":
        nome_do_personagem = input("Digite o nome do personagem:\n")

        # Define as regras do jogo e as inclui no contexto
        regras = regras_do_jogo()  # Chama a função para obter as regras

        # Defina o contexto da aventura
        contexto_inicial = input("Descreva o cenário inicial da aventura (local, época, situação geral):\n")

        # Cria prompt para a cena inicial
        prompt_contexto = f"{regras}\nContexto da aventura: {contexto_inicial}. Descreva a cena inicial para os jogadores, destacando detalhes importantes e atmosferas."
        resposta_contexto = obter_resposta_do_mestre(prompt_contexto)
        print("\nCena Inicial:\n", resposta_contexto)

        while True:
            acao_do_jogador = input("\nO que seu personagem faz? (ou 'sair' para encerrar):\n")
            if acao_do_jogador.lower() == 'sair':
                break

            prompt_acao = f"{regras}\nContexto da aventura: {contexto_inicial}. A ação dos jogadores é: {acao_do_jogador}. Como mestre, descreva o resultado dessa ação e as próximas possibilidades."
            resposta_acao = obter_resposta_do_mestre(prompt_acao)

            print("\nResposta do Talesmith:\n", resposta_acao)

        print("\nAventura encerrada!")

