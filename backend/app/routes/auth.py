from flask import Blueprint, request, jsonify
from app.models.user import Usuario

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    dados = request.json
    email = dados.get('email')
    username = dados.get('username')
    password = dados.get('password')

    if not email or not username or not password:
        return jsonify({"erro": "Email, senha e username são obrigatórios"}), 400

    usuario = Usuario.query.filter_by(email=email, username=username).first()

    if not usuario or usuario.password != password:
        return jsonify({"erro": "Usuário ou senha inválidos"}), 401

    return jsonify({
        "msg": "Login bem-sucedido",
        "id": usuario.id,
        "username": usuario.username,
        "email": usuario.email
    }), 200