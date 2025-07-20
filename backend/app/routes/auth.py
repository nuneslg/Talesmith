from flask import Blueprint, request, jsonify
from app.models.user import Usuario

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    dados = request.json
    email = dados.get('email')
    username = dados.get('username')

    if not email or not username:
        return jsonify({"erro": "Email e username são obrigatórios"}), 400

    usuario = Usuario.query.filter_by(email=email, username=username).first()

    if not usuario:
        return jsonify({"erro": "Credenciais inválidas"}), 401

    return jsonify({
        "msg": "Login bem-sucedido",
        "id": usuario.id,
        "username": usuario.username,
        "email": usuario.email
    }), 200