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
    
    acao = data.get('acao', '')
    
    # Buscar mensagens anteriores da história, ordenadas cronologicamente
    mensagens = Mensagem.query.filter_by(historia_id=historia_id).order_by(Mensagem.criada_em.asc()).all()
    
    # Montar contexto concatenando as mensagens
    contexto = '\n'.join([f"{m.remetente}: {m.conteudo}" for m in mensagens])
    
    # Obter resposta do mestre (modelo) passando contexto completo + ação atual
    resposta = obter_resposta_do_mestre(contexto, acao)
    
    # Salvar mensagem do jogador
    mensagem_usuario = Mensagem(
        historia_id=historia_id,
        remetente='jogador',
        conteudo=acao
    )
    
    # Salvar resposta da IA
    mensagem_ia = Mensagem(
        historia_id=historia_id,
        remetente='mestre',
        conteudo=resposta
    )
    
    db.session.add_all([mensagem_usuario, mensagem_ia])
    db.session.commit()

    return jsonify({'resposta': resposta})
    
@gemini_bp.route('/teste', methods=['GET'])
def teste():
    return jsonify({"status": "ok", "mensagem": "API funcionando no Render"})