import pytest
from unittest.mock import MagicMock, patch
from flask import Flask, jsonify
from app.routes.auth import auth_bp
from app.routes.signup import signup_bp
from app.models.user import Usuario # Importa o modelo Usuario
from app.extensions import db # Importa a instância do SQLAlchemy

# Fixture para configurar um cliente de teste para cada teste
@pytest.fixture(scope='function') # Usar 'function' para garantir isolamento entre os testes
def test_client():
    # Cria uma instância mínima da aplicação Flask para testes
    app = Flask(__name__)
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:' # Usa um banco de dados em memória
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Registra os blueprints de autenticação e cadastro
    app.register_blueprint(auth_bp)
    app.register_blueprint(signup_bp)

    # Inicializa o SQLAlchemy com a aplicação de teste
    # É importante que db.init_app(app) seja chamado para que o db object funcione
    # No seu app/__init__.py, você provavelmente tem algo como db.init_app(app)
    # Aqui, vamos simular isso ou garantir que o db esteja configurado para o contexto de teste.
    # Para este teste, vamos mockar as operações de banco de dados diretamente no Usuario.query
    # mas em um cenário real, você inicializaria o db corretamente.

    with app.app_context():
        # A linha abaixo é crucial se você realmente usa db.create_all() nos seus testes
        # Mas como vamos mockar Usuario.query, não é estritamente necessário para estes mocks.
        # db.create_all()
        with app.test_client() as client:
            yield client
        # db.drop_all() # Não é necessário se o banco de dados é em memória e mockado

# --- Testes para a rota de Cadastro (signup) ---

@patch('app.models.user.Usuario.query')
@patch('app.extensions.db.session')
def test_signup_successful(mock_db_session, mock_usuario_query, test_client):
    """
    Testa o cadastro bem-sucedido de um novo usuário.
    """
    # Configura o mock para simular que o usuário não existe
    mock_usuario_query.filter.return_value.first.return_value = None

    user_data = {
        'username': 'novo_usuario',
        'email': 'novo@example.com'
    }
    response = test_client.post('/api/auth/signup', json=user_data)

    assert response.status_code == 201
    assert response.json['username'] == 'novo_usuario'
    assert response.json['email'] == 'novo@example.com'
    # Verifica se o usuário foi adicionado e commitado ao banco de dados
    mock_db_session.add.assert_called_once()
    mock_db_session.commit.assert_called_once()

@patch('app.models.user.Usuario.query')
def test_signup_missing_fields(mock_usuario_query, test_client):
    """
    Testa o cadastro com campos obrigatórios faltando.
    """
    # Teste com username faltando
    response = test_client.post('/api/auth/signup', json={'email': 'test@example.com'})
    assert response.status_code == 400
    assert response.json['erro'] == 'Username e email são obrigatórios'

    # Teste com email faltando
    response = test_client.post('/api/auth/signup', json={'username': 'testuser'})
    assert response.status_code == 400
    assert response.json['erro'] == 'Username e email são obrigatórios'

    # Verifica que nenhuma operação de banco de dados foi chamada
    mock_usuario_query.filter.assert_not_called()

@patch('app.models.user.Usuario.query')
def test_signup_existing_user(mock_usuario_query, test_client):
    """
    Testa o cadastro de um usuário que já existe (username ou email).
    """
    existing_user_mock = MagicMock(spec=Usuario)
    existing_user_mock.username = 'usuario_existente'
    existing_user_mock.email = 'existente@example.com'

    mock_usuario_query.filter.return_value.first.return_value = existing_user_mock

    user_data = {
        'username': 'usuario_existente',
        'email': 'outro@example.com' 
    }
    response = test_client.post('/api/auth/signup', json=user_data)

    assert response.status_code == 409
    assert response.json['erro'] == 'Usuário já existe com esse username ou email'

    user_data_email_exists = {
        'username': 'novo_username',
        'email': 'existente@example.com' 
    }
    response = test_client.post('/api/auth/signup', json=user_data_email_exists)

    assert response.status_code == 409
    assert response.json['erro'] == 'Usuário já existe com esse username ou email'



@patch('app.models.user.Usuario.query')
def test_login_successful(mock_usuario_query, test_client):
    """
    Testa o login bem-sucedido de um usuário.
    """
    
    found_user_mock = MagicMock(spec=Usuario)
    found_user_mock.id = 1
    found_user_mock.username = 'usuario_login'
    found_user_mock.email = 'login@example.com'


    mock_usuario_query.filter_by.return_value.first.return_value = found_user_mock

    login_data = {
        'username': 'usuario_login',
        'email': 'login@example.com'
    }
    response = test_client.post('/api/auth/login', json=login_data)

    assert response.status_code == 200
    assert response.json['msg'] == 'Login bem-sucedido'
    assert response.json['username'] == 'usuario_login'
    assert response.json['email'] == 'login@example.com'
    assert response.json['id'] == 1

    mock_usuario_query.filter_by.assert_called_once_with(email='login@example.com', username='usuario_login')

@patch('app.models.user.Usuario.query')
def test_login_missing_fields(mock_usuario_query, test_client):
    """
    Testa o login com campos obrigatórios faltando.
    """
    response = test_client.post('/api/auth/login', json={'username': 'testuser'})
    assert response.status_code == 400
    assert response.json['erro'] == 'Email e username são obrigatórios'

    response = test_client.post('/api/auth/login', json={'email': 'test@example.com'})
    assert response.status_code == 400
    assert response.json['erro'] == 'Email e username são obrigatórios'

    mock_usuario_query.filter_by.assert_not_called()

@patch('app.models.user.Usuario.query')
def test_login_invalid_credentials(mock_usuario_query, test_client):
    """
    Testa o login com credenciais inválidas (usuário não encontrado).
    """

    mock_usuario_query.filter_by.return_value.first.return_value = None

    login_data = {
        'username': 'nao_existe',
        'email': 'nao_existe@example.com'
    }
    response = test_client.post('/api/auth/login', json=login_data)

    assert response.status_code == 401
    assert response.json['erro'] == 'Credenciais inválidas'
  
    mock_usuario_query.filter_by.assert_called_once()

