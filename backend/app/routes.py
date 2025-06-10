from flask import request, jsonify
from .gemini_service import obter_resposta_do_mestre

def init_routes(app):
    @app.route('/api/cena-inicial', methods=['POST'])
    def cena_inicial():
        data = request.json
        contexto = data.get('contexto', '')
        resposta = obter_resposta_do_mestre(contexto)
        return jsonify({'resposta': resposta})

    @app.route('/api/acao-jogador', methods=['POST'])
    def acao_jogador():
        data = request.json
        contexto = data.get('contexto', '')
        acao = data.get('acao', '')
        resposta = obter_resposta_do_mestre(contexto, acao)
        return jsonify({'resposta': resposta})
