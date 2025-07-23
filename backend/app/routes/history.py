from flask import Blueprint, request, jsonify
from app.models import Historia, AtributosPersonagem
from app.extensions import db
from app.models.message import Mensagem

historia_bp = Blueprint('historia', __name__, url_prefix='/api/historias')

@historia_bp.route('/', methods=['POST'])
def criar_historia():
    data = request.json

    nova_historia = Historia(
        titulo=data.get('titulo'),
        contexto=data.get('contexto'),
        usuario_id=data.get('usuario_id'),
    )

    db.session.add(nova_historia)
    db.session.flush()  # Para obter o ID antes de adicionar atributos
    
    atributos = AtributosPersonagem(
    historia_id=nova_historia.id,
    nome=data.get('nome_personagem'),
    raca=data.get('raca_personagem'),
    classe=data.get('classe_personagem'),
    nivel=data.get('nivel_personagem'),
    forca=data.get('forca_personagem'),
    destreza=data.get('destreza_personagem'),
    constituicao=data.get('constituicao_personagem'),
    sabedoria=data.get('sabedoria_personagem'),
    inteligencia=data.get('inteligencia_personagem'),
    carisma=data.get('carisma_personagem'),
    contexto=data.get('contexto_personagem')
)
    db.session.add(atributos)
    mensagem_inicial = Mensagem(
        historia_id=nova_historia.id,
        remetente='jogador',
        conteudo=nova_historia.contexto  # ou outro texto
    )
    db.session.add(mensagem_inicial)
    db.session.commit()

    return jsonify({
        'id': nova_historia.id,
        'titulo': nova_historia.titulo,
        'atributos_personagem': {
            'nome': atributos.nome,
            'raca': atributos.raca,
            'classe': atributos.classe,
            'nivel': atributos.nivel,
            'forca': atributos.forca,
            'destreza': atributos.destreza,
            'constituicao': atributos.constituicao,
            'sabedoria': atributos.sabedoria,
            'inteligencia': atributos.inteligencia,
            'carisma': atributos.carisma,
            'contexto': atributos.contexto
        }
    }), 201


@historia_bp.route('/<int:historia_id>', methods=['GET'])
def obter_historia(historia_id):
    historia = Historia.query.get(historia_id)
    if not historia:
        return jsonify({'erro': 'História não encontrada'}), 404
    
    atributos = historia.atributos
    return jsonify({
        'id': historia.id,
        'titulo': historia.titulo,
        'contexto': historia.contexto,
        'usuario_id': historia.usuario_id,
        'criada_em': historia.criada_em.isoformat(),
        'atributos_personagem': {
            'nome': atributos.nome,
            'forca': atributos.forca,
            'percepcao': atributos.percepcao,
            'inteligencia': atributos.inteligencia,
            'sorte': atributos.sorte,
            'carisma': atributos.carisma,
            'resistencia': atributos.resistencia,
            'agilidade': atributos.agilidade
        } if atributos else None
    })