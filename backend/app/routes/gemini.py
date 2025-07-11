from flask import Blueprint, request, jsonify
from app.gemini_service import obter_resposta_do_mestre
from app.extensions import db
from app.models import Historia, Mensagem

gemini_bp = Blueprint('gemini', __name__, url_prefix='/api')

@gemini_bp.route('/cena-inicial', methods=['POST'])
def cena_inicial():
    data = request.json
    contexto = data.get('contexto', '')
    resposta = obter_resposta_do_mestre(contexto)

    # Cria mensagens no banco
    mensagem_usuario = Mensagem(
        historia_id=1,  # mudar futuramente para usar o id correto da história
        remetente='jogador',
        conteudo=contexto
    )
    mensagem_ia = Mensagem(
        historia_id=1,
        remetente='mestre',
        conteudo=resposta
    )
    db.session.add_all([mensagem_usuario, mensagem_ia])
    db.session.commit()
    return jsonify({'resposta': resposta})

@gemini_bp.route('/acao-jogador', methods=['POST'])
def acao_jogador():
    data = request.json
    contexto = data.get('contexto', '')
    acao = data.get('acao', '')
    resposta = obter_resposta_do_mestre(contexto, acao)

    mensagem_usuario = Mensagem(
        historia_id=1,  # substitua pelo ID correto
        remetente='jogador',
        conteudo=acao
    )
    mensagem_ia = Mensagem(
        historia_id=1,
        remetente='mestre',
        conteudo=resposta
    )
    db.session.add_all([mensagem_usuario, mensagem_ia])
    db.session.commit()


    return jsonify({'resposta': resposta})
