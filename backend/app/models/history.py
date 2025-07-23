from flask import Blueprint, request, jsonify
from app.extensions import db
from datetime import datetime, timezone

historia_bp = Blueprint('historia', __name__, url_prefix='/api/historia')

class Historia(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200))
    contexto = db.Column(db.Text)  # Contexto inicial da história (como o formulário de inicio)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    criada_em = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    atributos = db.relationship('AtributosPersonagem', uselist=False, backref='historia', cascade="all, delete")
    mensagens = db.relationship('Mensagem', backref='historia', lazy=True)


from app.models.message import Mensagem 