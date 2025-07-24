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


@historia_bp.route('/', methods=['GET'])
def listar_historias_por_usuario():
    usuario_id = request.args.get('usuario_id', type=int)
    if not usuario_id:
        return jsonify({'erro': 'Parâmetro usuario_id é obrigatório'}), 400
    
    historias = Historia.query.filter_by(usuario_id=usuario_id).all()
    resultado = []
    for h in historias:
        resultado.append({
            'id': h.id,
            'titulo': h.titulo,
            'contexto': h.contexto,
            'usuario_id': h.usuario_id,
            'criada_em': h.criada_em.isoformat(),
        })
    return jsonify(resultado)