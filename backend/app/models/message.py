from app.extensions import db
from datetime import datetime, timezone

class Mensagem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    historia_id = db.Column(db.Integer, db.ForeignKey('historia.id'), nullable=False)
    remetente = db.Column(db.String(50))  # 'jogador' ou 'mestre'
    conteudo = db.Column(db.Text)
    criada_em = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
