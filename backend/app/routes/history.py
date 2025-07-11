from flask import Blueprint, request, jsonify
from app.models import Historia
from app.extensions import db

historia_bp = Blueprint('historia', __name__, url_prefix='/api/historias')

@historia_bp.route('/', methods=['POST'])
def criar_historia():
    data = request.json
    nova_historia = Historia(
        titulo=data.get('titulo'),
        contexto=data.get('contexto'),
        usuario_id=data.get('usuario_id')
    )
    db.session.add(nova_historia)
    db.session.commit()
    return jsonify({'id': nova_historia.id, 'titulo': nova_historia.titulo}), 201

@historia_bp.route('/<int:historia_id>', methods=['GET'])
def obter_historia(historia_id):
    historia = Historia.query.get(historia_id)
    if not historia:
        return jsonify({'erro': 'História não encontrada'}), 404
    
    return jsonify({
        'id': historia.id,
        'titulo': historia.titulo,
        'contexto': historia.contexto,
        'usuario_id': historia.usuario_id,
        'criada_em': historia.criada_em.isoformat()
    })