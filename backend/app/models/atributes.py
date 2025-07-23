
from app.extensions import db

class AtributosPersonagem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    historia_id = db.Column(db.Integer, db.ForeignKey('historia.id'), nullable=False, unique=True)

    nome = db.Column(db.String(100))
    raca = db.Column(db.String(50))            
    classe = db.Column(db.String(50))          
    nivel = db.Column(db.Integer)               
    forca = db.Column(db.Integer)
    destreza = db.Column(db.Integer)
    constituicao = db.Column(db.Integer)
    sabedoria = db.Column(db.Integer)
    inteligencia = db.Column(db.Integer)
    carisma = db.Column(db.Integer)
    contexto = db.Column(db.Text)


