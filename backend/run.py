from app import create_app
from dotenv import load_dotenv

load_dotenv()
# Carrega as variáveis de ambiente do arquivo .env

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
