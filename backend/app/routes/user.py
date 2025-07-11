from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import Usuario

user_bp = Blueprint('user', __name__, url_prefix='/api/user')

@user_bp.route('/', methods=['GET'])
def listar_usuarios():
    usuarios = Usuario.query.all()
    resultado = [{"id": u.id, "username": u.username, "email": u.email} for u in usuarios]
    return jsonify(resultado)

@user_bp.route('/<int:id>', methods=['GET'])
def pegar_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    return jsonify({"id": usuario.id, "username": usuario.username, "email": usuario.email})

@user_bp.route('/', methods=['POST'])
def criar_usuario():
    dados = request.json
    username = dados.get('username')
    email = dados.get('email')
    if not username or not email:
        return jsonify({"erro": "username e email são obrigatórios"}), 400

    # Verifica duplicados
    if Usuario.query.filter((Usuario.username == username) | (Usuario.email == email)).first():
        return jsonify({"erro": "Usuário com esse username ou email já existe"}), 409

    usuario = Usuario(username=username, email=email)
    db.session.add(usuario)
    db.session.commit()
    return jsonify({"id": usuario.id, "username": usuario.username, "email": usuario.email}), 201

@user_bp.route('/<int:id>', methods=['DELETE'])
def deletar_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    db.session.delete(usuario)
    db.session.commit()
    return jsonify({"msg": "Usuário deletado com sucesso"}), 200
