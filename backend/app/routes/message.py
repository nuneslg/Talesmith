from flask import Blueprint, request, jsonify
from app.models import Mensagem
from app.extensions import db
from datetime import datetime, timezone

mensagem_bp = Blueprint('mensagem', __name__, url_prefix='/api/mensagens')

@mensagem_bp.route('/<int:historia_id>', methods=['POST'])
def criar_mensagem(historia_id):
    data = request.json
    nova_mensagem = Mensagem(
        historia_id=historia_id,
        autor=data.get('autor'),
        conteudo=data.get('conteudo'),
        enviada_em=datetime.now(timezone.utc)
    )
    db.session.add(nova_mensagem)
    db.session.commit()
    return jsonify({'id': nova_mensagem.id}), 201

@mensagem_bp.route('/<int:historia_id>', methods=['GET'])
def listar_mensagens(historia_id):
    mensagens = Mensagem.query.filter_by(historia_id=historia_id).all()
    return jsonify([
        {
            'id': m.id,
            'autor': m.autor,
            'conteudo': m.conteudo,
            'enviada_em': m.enviada_em.isoformat()
        }
        for m in mensagens
    ])
