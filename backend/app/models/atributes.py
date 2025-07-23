from app.extensions import db

class AtributosPersonagem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    historia_id = db.Column(db.Integer, db.ForeignKey('historia.id'), nullable=False, unique=True)

    nome = db.Column(db.String(50), nullable=False)
    forca = db.Column(db.Integer)
    percepcao = db.Column(db.Integer)
    inteligencia = db.Column(db.Integer)
    sorte = db.Column(db.Integer)
    carisma = db.Column(db.Integer)
    resistencia = db.Column(db.Integer)
    agilidade = db.Column(db.Integer)

