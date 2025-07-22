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
        usuario_id=data.get('usuario_id'),
        nome_personagem=data.get('nome_personagem'), #aqui
        forca_personagem=data.get('forca_personagem'), #aqui
        percepcao_personagem=data.get('percepcao_personagem'), #aqui
        inteligencia_personagem=data.get('inteligencia_personagem'), #aqui
        sorte_personagem=data.get('sorte_personagem'), #aqui
        carisma_personagem=data.get('carisma_personagem'), #aqui
        resistencia_personagem=data.get('resistencia_personagem'), #aqui
        agilidade_personagem=data.get('agilidade_personagem') #aqui
    )

    db.session.add(nova_historia)
    db.session.commit()
    return jsonify({ 'id': nova_historia.id,
                     'titulo': nova_historia.titulo,
                     'nome_personagem' : nova_historia.nome_personagem, #aqyu
                     'atributos_personagem' : nova_historia.atributos_personagem}), 201 #aqui


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
        'criada_em': historia.criada_em.isoformat(),
        'nome_personagem' : historia.nome_personagem, #aqui
        'atributos_personagem' : historia.atributos_personagem #aqui
    })