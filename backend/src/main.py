from flask import Flask
from flask_cors import CORS
from api.index import app as api_blueprint

app = Flask(__name__)
CORS(app)  # Habilitar CORS para toda a aplicação

# Registrar as rotas da API
app.register_blueprint(api_blueprint, url_prefix='/api')

@app.route('/')
def home():
    return "Backend de The Odyssey of Games está funcionando!"

@app.route('/health')
def health():
    return {"status": "healthy", "service": "The Odyssey of Games Backend"}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

