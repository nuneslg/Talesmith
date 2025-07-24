from flask import Blueprint, request, jsonify
from app.models.user import Usuario
from app.extensions import db
from werkzeug.security import check_password_hash


auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    dados = request.json
    email = dados.get('email')
    password = dados.get('password')

    
    if not email or not password:
        return jsonify({"erro": "Email, senha e username são obrigatórios"}), 400

    usuario = Usuario.query.filter_by(email=email).first()

    if not usuario:
        return jsonify({"erro": "Usuario nao encontrado"}), 400
    
    is_valid_password = check_password_hash(usuario.password, password)
    if not is_valid_password:
        return  jsonify({"erro": "Credencias invalidas."}), 401
 

    return jsonify({
        "msg": "Login bem-sucedido",
        "id": usuario.id,
        "username": usuario.username,
        "email": usuario.email
    }), 200