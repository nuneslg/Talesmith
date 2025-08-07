from flask import current_app, jsonify, request
from flask import Blueprint

db_bp = Blueprint('db', __name__, url_prefix='/api/db')

@db_bp.route('/init-db', methods=['POST'])
def init_db():
    # Só permitir rodar em ambiente de desenvolvimento (DEBUG=True)
    # Ou use um token secreto para proteger em produção
    token = request.headers.get("X-ADMIN-TOKEN")
    if not current_app.config.get("DEBUG", False) and token != "meu-token-secreto":
        return jsonify({"error": "Acesso negado"}), 403

    from app.extensions import db
    db.create_all()
    return jsonify({"msg": "Tabelas criadas com sucesso"})
