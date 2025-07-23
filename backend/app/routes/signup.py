from flask import Blueprint, request, jsonify
from app.models.user import Usuario
from app.extensions import db

signup_bp = Blueprint('signup', __name__, url_prefix='/api/auth')

@signup_bp.route('/signup', methods=['POST'])
def signup():
    dados = request.json
    username = dados.get('username')
    email = dados.get('email')
    password = dados.get('password')


    if not username or not email or not password:
        return jsonify({"erro": "Username, email e senha são obrigatórios"}), 400

  
    usuario_existente = Usuario.query.filter(
        (Usuario.username == username) | (Usuario.email == email)
    ).first()
    if usuario_existente:
        return jsonify({"erro": "Usuário já existe com esse username ou email"}), 409


    novo_usuario = Usuario(username=username, email=email, password=password)
    db.session.add(novo_usuario)
    db.session.commit()

    return jsonify({
        "id": novo_usuario.id,
        "username": novo_usuario.username,
        "email": novo_usuario.email,
        "password": novo_usuario.password
    }), 201