from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
import sys
import os

# Adicionar o diretório pai ao path para importar services
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.leaderboard_service import LeaderboardService

app = Blueprint('api', __name__)
CORS(app)  # Habilitar CORS

# Inicializar serviços
leaderboard_service = LeaderboardService()

# Simulação de banco de dados de usuários
users = []

# Simulação de dados de jogos e progresso
games = [
    {"id": 1, "name": "Senet", "description": "O jogo dos mortos do Egito Antigo.", "category": "board_game"},
    {"id": 2, "name": "Go", "description": "Estratégia territorial milenar da Ásia.", "category": "board_game"},
    {"id": 3, "name": "Mancala", "description": "Jogo de sementes e estratégia da África.", "category": "board_game"},
    {"id": 4, "name": "Chaturanga", "description": "Ancestral do xadrez da Índia.", "category": "board_game"},
    {"id": 5, "name": "Patolli", "description": "Jogo de apostas sagrado Asteca.", "category": "board_game"},
    {"id": 6, "name": "Hanafuda", "description": "Cartas florais tradicionais do Japão.", "category": "card_game"},
    {"id": 7, "name": "Nine Men's Morris", "description": "Alinhamento estratégico da Europa Medieval.", "category": "board_game"},
    {"id": 8, "name": "Hnefatafl", "description": "Defesa do rei dos Vikings.", "category": "board_game"},
    {"id": 9, "name": "Pachisi", "description": "Corrida real da Índia.", "category": "board_game"},
    {"id": 10, "name": "Royal Game of Ur", "description": "Corrida real da Mesopotâmia.", "category": "board_game"},
]

progress = []  # Simulação de progresso do usuário em jogos
game_sessions = []  # Simulação de sessões de jogo ativas

@app.route('/')
def home():
    return "Backend de The Odyssey of Games está funcionando!"

# Rota de registro de usuário
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Nome de usuário e senha são obrigatórios."}), 400

    if any(user['username'] == username for user in users):
        return jsonify({"message": "Nome de usuário já existe."}), 409

    new_user = {"id": len(users) + 1, "username": username, "password": password}
    users.append(new_user)
    return jsonify({
        "message": "Usuário registrado com sucesso!",
        "user": {"id": new_user["id"], "username": new_user["username"]}
    }), 201

# Rota de login de usuário
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Nome de usuário e senha são obrigatórios."}), 400

    user = next((u for u in users if u['username'] == username and u['password'] == password), None)

    if not user:
        return jsonify({"message": "Credenciais inválidas."}), 401

    return jsonify({
        "message": "Login bem-sucedido!",
        "user": {"id": user["id"], "username": user["username"]}
    }), 200

# Rota de perfil de usuário
@app.route('/profile/<username>')
def get_profile(username):
    user = next((u for u in users if u['username'] == username), None)

    if not user:
        return jsonify({"message": "Usuário não encontrado."}), 404

    return jsonify({
        "profile": {
            "id": user["id"],
            "username": user["username"],
            "email": f"{username}@example.com"
        }
    }), 200

# Rota para obter todos os jogos
@app.route('/games')
def get_games():
    return jsonify(games), 200

# Rota para obter um jogo por ID
@app.route('/games/<int:game_id>')
def get_game(game_id):
    game = next((g for g in games if g['id'] == game_id), None)

    if not game:
        return jsonify({"message": "Jogo não encontrado."}), 404

    return jsonify(game), 200

# Rota para obter o progresso de um usuário em um jogo específico
@app.route('/progress/<int:user_id>/<int:game_id>')
def get_progress(user_id, game_id):
    user_progress = next((p for p in progress if p['userId'] == user_id and p['gameId'] == game_id), None)

    if not user_progress:
        return jsonify({"message": "Progresso não encontrado para este usuário e jogo."}), 404

    return jsonify(user_progress), 200

# Rota para atualizar o progresso de um usuário em um jogo
@app.route('/progress', methods=['POST'])
def update_progress():
    data = request.get_json()
    user_id = data.get('userId')
    game_id = data.get('gameId')
    score = data.get('score')
    level = data.get('level')
    status = data.get('status')

    if not user_id or not game_id:
        return jsonify({"message": "ID do usuário e ID do jogo são obrigatórios."}), 400

    user_progress = next((p for p in progress if p['userId'] == user_id and p['gameId'] == game_id), None)

    if user_progress:
        # Atualiza o progresso existente
        if score is not None:
            user_progress['score'] = score
        if level is not None:
            user_progress['level'] = level
        if status is not None:
            user_progress['status'] = status
        return jsonify({"message": "Progresso atualizado com sucesso!", "progress": user_progress}), 200
    else:
        # Cria um novo progresso
        new_progress = {
            "userId": user_id,
            "gameId": game_id,
            "score": score or 0,
            "level": level or 1,
            "status": status or "started"
        }
        progress.append(new_progress)
        return jsonify({"message": "Progresso criado com sucesso!", "progress": new_progress}), 201

# Rota para iniciar uma nova sessão de jogo
@app.route('/game/start', methods=['POST'])
def start_game():
    data = request.get_json()
    user_id = data.get('userId')
    game_id = data.get('gameId')
    mode = data.get('mode')

    if not user_id or not game_id or not mode:
        return jsonify({"message": "ID do usuário, ID do jogo e modo são obrigatórios."}), 400

    game = next((g for g in games if g['id'] == game_id), None)
    if not game:
        return jsonify({"message": "Jogo não encontrado."}), 404

    new_session = {
        "id": len(game_sessions) + 1,
        "userId": user_id,
        "gameId": game_id,
        "mode": mode,
        "startTime": "2025-01-01T00:00:00Z",  # Em produção seria datetime.now()
        "status": "active"
    }
    game_sessions.append(new_session)
    return jsonify({"message": "Sessão de jogo iniciada!", "session": new_session}), 201

# Rota para obter o estado de uma sessão de jogo
@app.route('/game/session/<int:session_id>')
def get_session(session_id):
    session = next((s for s in game_sessions if s['id'] == session_id), None)

    if not session:
        return jsonify({"message": "Sessão de jogo não encontrada."}), 404

    return jsonify({
        "message": "Estado da sessão de jogo",
        "session": session,
        "gameState": {"board": [], "players": []}
    }), 200

# Rota para finalizar uma sessão de jogo
@app.route('/game/end/<int:session_id>', methods=['POST'])
def end_game(session_id):
    session = next((s for s in game_sessions if s['id'] == session_id), None)

    if not session:
        return jsonify({"message": "Sessão de jogo não encontrada."}), 404

    session['status'] = "completed"
    session['endTime'] = "2025-01-01T01:00:00Z"  # Em produção seria datetime.now()
    return jsonify({"message": "Sessão de jogo finalizada!", "session": session}), 200

# ===== ROTAS DO SISTEMA DE LEADERBOARD E PONTUAÇÃO =====

# Obter ranking global
@app.route('/leaderboard/global')
def get_global_leaderboard():
    try:
        limit = int(request.args.get('limit', 50))
        leaderboard = leaderboard_service.get_global_leaderboard(limit)
        return jsonify(leaderboard), 200
    except Exception as e:
        return jsonify({"message": "Erro ao obter ranking global", "error": str(e)}), 500

# Obter ranking por jogo
@app.route('/leaderboard/game/<game_name>')
def get_game_leaderboard(game_name):
    try:
        limit = int(request.args.get('limit', 50))
        leaderboard = leaderboard_service.get_game_leaderboard(game_name, limit)
        return jsonify(leaderboard), 200
    except Exception as e:
        return jsonify({"message": "Erro ao obter ranking do jogo", "error": str(e)}), 404

# Obter estatísticas de um jogador
@app.route('/player/<player_id>/stats')
def get_player_stats(player_id):
    try:
        player_stats = leaderboard_service.get_player_stats(player_id)
        return jsonify(player_stats), 200
    except Exception as e:
        return jsonify({"message": "Jogador não encontrado", "error": str(e)}), 404

# Atualizar estatísticas após uma partida
@app.route('/player/<player_id>/game-result', methods=['POST'])
def update_player_stats(player_id):
    try:
        game_result = request.get_json()
        
        # Validar dados obrigatórios
        if not game_result.get('gameName') or 'won' not in game_result:
            return jsonify({
                "message": "Dados obrigatórios: gameName (string) e won (boolean)"
            }), 400

        result = leaderboard_service.update_player_after_game(player_id, game_result)
        return jsonify({
            "message": "Estatísticas atualizadas com sucesso",
            **result
        }), 200
    except Exception as e:
        return jsonify({"message": "Erro ao atualizar estatísticas", "error": str(e)}), 400

# Obter estatísticas gerais da plataforma
@app.route('/platform/stats')
def get_platform_stats():
    try:
        stats = leaderboard_service.get_platform_stats()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"message": "Erro ao obter estatísticas da plataforma", "error": str(e)}), 500

# Obter ranking sazonal
@app.route('/leaderboard/seasonal')
def get_seasonal_ranking():
    try:
        season = request.args.get('season', 'current')
        game = request.args.get('game')
        ranking = leaderboard_service.get_seasonal_ranking(season, game)
        return jsonify(ranking), 200
    except Exception as e:
        return jsonify({"message": "Erro ao obter ranking sazonal", "error": str(e)}), 500

# ===== ROTAS DE TORNEIOS =====

# Criar torneio
@app.route('/tournaments', methods=['POST'])
def create_tournament():
    try:
        tournament = leaderboard_service.create_tournament(request.get_json())
        return jsonify({
            "message": "Torneio criado com sucesso",
            "tournament": tournament
        }), 201
    except Exception as e:
        return jsonify({"message": "Erro ao criar torneio", "error": str(e)}), 400

# Obter torneios ativos
@app.route('/tournaments/active')
def get_active_tournaments():
    try:
        tournaments = leaderboard_service.get_active_tournaments()
        return jsonify(tournaments), 200
    except Exception as e:
        return jsonify({"message": "Erro ao obter torneios ativos", "error": str(e)}), 500

# Inscrever jogador em torneio
@app.route('/tournaments/<tournament_id>/register', methods=['POST'])
def register_in_tournament(tournament_id):
    try:
        data = request.get_json()
        player_id = data.get('playerId')
        
        if not player_id:
            return jsonify({"message": "playerId é obrigatório"}), 400

        tournament = leaderboard_service.register_player_in_tournament(tournament_id, player_id)
        return jsonify({
            "message": "Jogador inscrito com sucesso",
            "tournament": tournament
        }), 200
    except Exception as e:
        return jsonify({"message": "Erro ao inscrever jogador", "error": str(e)}), 400

# ===== ROTAS DE CONQUISTAS =====

# Obter todas as conquistas disponíveis
@app.route('/achievements')
def get_achievements():
    achievements = [
        {"id": 'first_win', "name": 'Primeira Vitória', "description": 'Ganhe sua primeira partida', "icon": '🏆', "rarity": 'common'},
        {"id": 'win_streak_5', "name": 'Sequência de 5', "description": 'Ganhe 5 partidas seguidas', "icon": '🔥', "rarity": 'uncommon'},
        {"id": 'win_streak_10', "name": 'Sequência de 10', "description": 'Ganhe 10 partidas seguidas', "icon": '⚡', "rarity": 'rare'},
        {"id": 'games_played_100', "name": 'Veterano', "description": 'Jogue 100 partidas', "icon": '🎖️', "rarity": 'uncommon'},
        {"id": 'level_10', "name": 'Explorador', "description": 'Alcance o nível 10', "icon": '🌟', "rarity": 'common'},
        {"id": 'level_20', "name": 'Aventureiro', "description": 'Alcance o nível 20', "icon": '⭐', "rarity": 'uncommon'},
        {"id": 'master_senet', "name": 'Mestre do Senet', "description": 'Ganhe 10 partidas de Senet', "icon": '🏺', "rarity": 'rare'},
        {"id": 'master_go', "name": 'Mestre do Go', "description": 'Ganhe 10 partidas de Go', "icon": '⚫', "rarity": 'rare'},
        {"id": 'master_mancala', "name": 'Mestre do Mancala', "description": 'Ganhe 10 partidas de Mancala', "icon": '🌰', "rarity": 'rare'},
        {"id": 'collector', "name": 'Colecionador', "description": 'Jogue todos os jogos disponíveis', "icon": '📚', "rarity": 'legendary'},
    ]
    
    return jsonify(achievements), 200

