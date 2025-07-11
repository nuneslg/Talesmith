from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from app.extensions import db  # Importa a instância do SQLAlchemy
from .config import Config
from .routes import register_blueprints  # Importa a função para registrar os blueprints
import os


load_dotenv()  # Carrega as variáveis .env ao criar o app

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)  # Carrega as configurações do config.py
    CORS(app)
    db.init_app(app)  # Inicializa o SQLAlchemy com o app
    register_blueprints(app)  # Registra os blueprints
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)