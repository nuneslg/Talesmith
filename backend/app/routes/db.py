from flask import current_app, jsonify, request
from flask import Blueprint

db_bp = Blueprint('db', __name__, url_prefix='/api/db')

@db_bp.route('/init-db', methods=['POST'])
def init_db():
    # Permite rodar se estiver em DEBUG=True
    # Ou se passar o token correto em produção
    token = request.headers.get("X-ADMIN-TOKEN")
    if not current_app.config.get("DEBUG", False) and token != "meu-token-secreto":
        return jsonify({"error": "Acesso negado"}), 403

    from app.extensions import db

    # Apaga todas as tabelas
    db.drop_all()

    # Cria todas as tabelas novamente
    db.create_all()

    return jsonify({"msg": "Banco reiniciado e tabelas criadas com sucesso"})
