from .history import historia_bp
from .message import mensagem_bp
from .user import user_bp
from .gemini import gemini_bp
from .auth import auth_bp
from .signup import signup_bp

def register_blueprints(app):
    app.register_blueprint(historia_bp)
    app.register_blueprint(mensagem_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(gemini_bp)
    app.register_blueprint(auth_bp) 
    app.register_blueprint(signup_bp) 