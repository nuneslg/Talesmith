from app import create_app
from app.extensions import db
from app.models import Usuario, Historia, Mensagem  # importe seus modelos aqui

app = create_app()

with app.app_context():
    db.create_all()
    print("Banco de dados e tabelas criados com sucesso!")
