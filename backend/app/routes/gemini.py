from flask import Blueprint, request, jsonify
from app.gemini_service import obter_resposta_do_mestre
from app.extensions import db
from app.models import Historia, Mensagem

gemini_bp = Blueprint('gemini', __name__, url_prefix='/api')

@gemini_bp.route('/cena-inicial', methods=['POST'])
def cena_inicial():
    data = request.json
    historia_id = data.get('historia_id')  
    if not historia_id:
        return jsonify({"erro": "ID da história é obrigatório"}), 400
    contexto = data.get('contexto', '')
    resposta = obter_resposta_do_mestre(contexto)

    mensagem_ia = Mensagem(
        historia_id=historia_id,
        remetente='mestre',
        conteudo=resposta
    )
    db.session.add_all([mensagem_ia])
    db.session.commit()
    return jsonify({'resposta': resposta})

@gemini_bp.route('/acao-jogador', methods=['POST'])
def acao_jogador():
    data = request.json
    historia_id = data.get('historia_id') 
    if not historia_id:
        return jsonify({"erro": "ID da história é obrigatório"}), 400
    contexto = data.get('contexto', '')
    acao = data.get('acao', '')
    resposta = obter_resposta_do_mestre(contexto, acao)

    mensagem_usuario = Mensagem(
        historia_id=historia_id, 
        remetente='jogador',
        conteudo=acao
    )
    mensagem_ia = Mensagem(
        historia_id=historia_id,
        remetente='mestre',
        conteudo=resposta
    )
    db.session.add_all([mensagem_usuario, mensagem_ia])
    db.session.commit()


    return jsonify({'resposta': resposta})
