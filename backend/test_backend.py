import requests
from dotenv import load_dotenv

load_dotenv() # Carrega as variáveis de ambiente do arquivo .env
# Testa a conexão com o backend e a funcionalidade de cena inicial


def testar_cena_inicial():
    url = "http://127.0.0.1:5000/api/cena-inicial"
    payload = {"contexto": "Você está numa caverna escura e silenciosa."}
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()  # Garante que deu certo (status 200)
        dados = response.json()
        print("Resposta do backend:")
        print(dados)
    except requests.exceptions.RequestException as e:
        print("Erro ao conectar com o backend:", e)

if __name__ == "__main__":
    testar_cena_inicial()
