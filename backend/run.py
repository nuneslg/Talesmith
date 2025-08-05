from app import create_app
from dotenv import load_dotenv
import os

load_dotenv()
# Carrega as variáveis de ambiente do arquivo .env

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Pega a porta do Render ou 5000 local
    app.run(host="0.0.0.0", port=port, debug=True)
