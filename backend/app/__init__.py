from flask import Flask
from flask_cors import CORS
from .routes import init_routes  # importa a função que registra as rotas
from dotenv import load_dotenv
import os

load_dotenv()  # Carrega as variáveis .env ao criar o app

def create_app():
    app = Flask(__name__)
    CORS(app)
    init_routes(app)  # registra as rotas usando o app
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)