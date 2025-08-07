import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    raw_uri = os.getenv('DATABASE_URL')
    if raw_uri and raw_uri.startswith('postgres://'):
        raw_uri = raw_uri.replace('postgres://', 'postgresql://', 1)
    SQLALCHEMY_DATABASE_URI = raw_uri or f"sqlite:///{os.path.join(basedir, 'talesmith.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
