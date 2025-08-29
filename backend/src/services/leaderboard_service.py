import random
import time
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional

class LeaderboardService:
    def __init__(self):
        # Simulação de banco de dados em memória
        self.players: Dict[str, Dict] = {}
        self.game_stats: Dict[str, Dict] = {}
        self.tournaments: Dict[str, Dict] = {}
        self.seasonal_rankings: Dict[str, Dict] = {}
        
        # Inicializar dados de exemplo
        self.initialize_example_data()

    def initialize_example_data(self):
        # Jogadores de exemplo
        example_players = [
            {"id": '1', "name": 'Alexandre, o Grande', "level": 25, "experience": 15420, "avatar": '👑'},
            {"id": '2', "name": 'Cleópatra VII', "level": 22, "experience": 12890, "avatar": '👸'},
            {"id": '3', "name": 'Sun Tzu', "level": 28, "experience": 18750, "avatar": '🥋'},
            {"id": '4', "name": 'Joana d\'Arc', "level": 20, "experience": 11200, "avatar": '⚔️'},
            {"id": '5', "name": 'Leonardo da Vinci', "level": 30, "experience": 22100, "avatar": '🎨'},
        ]

        for player in example_players:
            self.players[player["id"]] = {
                **player,
                "gamesPlayed": random.randint(50, 150),
                "gamesWon": random.randint(20, 80),
                "currentStreak": random.randint(0, 10),
                "bestStreak": random.randint(5, 25),
                "favoriteGame": random.choice(['Senet', 'Go', 'Mancala', 'Chaturanga']),
                "joinDate": datetime.now() - timedelta(days=random.randint(1, 365)),
                "lastActive": datetime.now() - timedelta(days=random.randint(0, 7)),
                "achievements": self.generate_random_achievements(),
                "rating": random.randint(1200, 2000),
            }

        # Estatísticas por jogo
        games = ['Senet', 'Go', 'Mancala', 'Chaturanga', 'Patolli', 'Hanafuda', 'NineMensMorris', 'Hnefatafl', 'Pachisi']
        for game in games:
            self.game_stats[game] = {
                "totalGames": random.randint(5000, 15000),
                "totalPlayers": random.randint(500, 1500),
                "averageGameTime": random.randint(10, 30),  # minutos
                "topPlayers": self.generate_top_players_for_game(game),
            }

    def generate_random_achievements(self) -> List[str]:
        all_achievements = [
            'first_win', 'win_streak_5', 'win_streak_10', 'games_played_100',
            'master_senet', 'master_go', 'master_mancala', 'level_10', 'level_20'
        ]
        count = random.randint(2, 7)
        return random.sample(all_achievements, min(count, len(all_achievements)))

    def generate_top_players_for_game(self, game: str) -> List[Dict]:
        player_ids = list(self.players.keys())
        random.shuffle(player_ids)
        
        top_players = []
        for i, player_id in enumerate(player_ids[:10]):
            player = self.players[player_id]
            top_players.append({
                "playerId": player_id,
                "playerName": player["name"],
                "rating": 1500 - (i * 50) + random.randint(-50, 100),
                "gamesPlayed": random.randint(20, 70),
                "winRate": max(0.3, 0.9 - (i * 0.05) + (random.random() * 0.1)),
            })
        
        return sorted(top_players, key=lambda x: x["rating"], reverse=True)

    def get_global_leaderboard(self, limit: int = 50) -> Dict:
        players = list(self.players.values())
        
        # Ordenar por rating, depois por experiência
        players.sort(key=lambda x: (x["rating"], x["experience"]), reverse=True)
        
        leaderboard = []
        for i, player in enumerate(players[:limit]):
            win_rate = player["gamesWon"] / player["gamesPlayed"] if player["gamesPlayed"] > 0 else 0
            leaderboard.append({
                "rank": i + 1,
                **player,
                "winRate": win_rate,
            })

        return {
            "leaderboard": leaderboard,
            "totalPlayers": len(self.players),
            "lastUpdated": datetime.now().isoformat(),
        }

    def get_game_leaderboard(self, game_name: str, limit: int = 50) -> Dict:
        if game_name not in self.game_stats:
            raise ValueError(f"Jogo {game_name} não encontrado")

        game_stats = self.game_stats[game_name]
        
        return {
            "game": game_name,
            "leaderboard": game_stats["topPlayers"][:limit],
            "totalPlayers": game_stats["totalPlayers"],
            "totalGames": game_stats["totalGames"],
            "averageGameTime": game_stats["averageGameTime"],
            "lastUpdated": datetime.now().isoformat(),
        }

    def get_player_stats(self, player_id: str) -> Dict:
        if player_id not in self.players:
            raise ValueError("Jogador não encontrado")

        player = self.players[player_id]

        # Calcular posição no ranking global
        all_players = sorted(self.players.values(), key=lambda x: x["rating"], reverse=True)
        global_rank = next((i + 1 for i, p in enumerate(all_players) if p["id"] == player_id), 0)

        # Calcular estatísticas por jogo
        game_stats = {}
        for game in self.game_stats.keys():
            game_leaderboard = self.get_game_leaderboard(game)
            player_in_game = next((p for p in game_leaderboard["leaderboard"] if p["playerId"] == player_id), None)
            if player_in_game:
                rank = game_leaderboard["leaderboard"].index(player_in_game) + 1
                game_stats[game] = {
                    "rank": rank,
                    "rating": player_in_game["rating"],
                    "gamesPlayed": player_in_game["gamesPlayed"],
                    "winRate": player_in_game["winRate"],
                }

        win_rate = player["gamesWon"] / player["gamesPlayed"] if player["gamesPlayed"] > 0 else 0

        return {
            **player,
            "globalRank": global_rank,
            "gameStats": game_stats,
            "winRate": win_rate,
        }

    def update_player_after_game(self, player_id: str, game_result: Dict) -> Dict:
        if player_id not in self.players:
            raise ValueError("Jogador não encontrado")

        player = self.players[player_id]
        game_name = game_result.get("gameName")
        won = game_result.get("won")
        game_time = game_result.get("gameTime", 900)  # 15 minutos padrão
        opponent_rating = game_result.get("opponentRating", 1500)

        # Atualizar estatísticas básicas
        player["gamesPlayed"] += 1
        if won:
            player["gamesWon"] += 1
            player["currentStreak"] += 1
            player["bestStreak"] = max(player["bestStreak"], player["currentStreak"])
        else:
            player["currentStreak"] = 0

        # Calcular mudança no rating (sistema ELO simplificado)
        expected_score = 1 / (1 + pow(10, (opponent_rating - player["rating"]) / 400))
        actual_score = 1 if won else 0
        k_factor = 32  # Fator K para mudança de rating
        rating_change = round(k_factor * (actual_score - expected_score))
        
        player["rating"] = max(800, player["rating"] + rating_change)

        # Atualizar experiência
        base_exp = 100 if won else 25
        time_bonus = max(0, 30 - (game_time // 60))  # Bônus por jogos rápidos
        streak_bonus = player["currentStreak"] * 10 if player["currentStreak"] > 1 else 0
        
        experience_gained = base_exp + time_bonus + streak_bonus
        player["experience"] += experience_gained

        # Verificar se subiu de nível
        new_level = (player["experience"] // 1000) + 1
        leveled_up = new_level > player["level"]
        player["level"] = new_level

        # Atualizar última atividade
        player["lastActive"] = datetime.now()

        # Verificar conquistas
        new_achievements = self.check_achievements(player)

        return {
            "player": player,
            "ratingChange": rating_change,
            "experienceGained": experience_gained,
            "leveledUp": leveled_up,
            "newAchievements": new_achievements,
        }

    def check_achievements(self, player: Dict) -> List[str]:
        new_achievements = []
        achievements = player.get("achievements", [])

        # Conquistas de vitórias
        if player["gamesWon"] >= 1 and 'first_win' not in achievements:
            new_achievements.append('first_win')
        if player["currentStreak"] >= 5 and 'win_streak_5' not in achievements:
            new_achievements.append('win_streak_5')
        if player["currentStreak"] >= 10 and 'win_streak_10' not in achievements:
            new_achievements.append('win_streak_10')

        # Conquistas de jogos
        if player["gamesPlayed"] >= 100 and 'games_played_100' not in achievements:
            new_achievements.append('games_played_100')

        # Conquistas de nível
        if player["level"] >= 10 and 'level_10' not in achievements:
            new_achievements.append('level_10')
        if player["level"] >= 20 and 'level_20' not in achievements:
            new_achievements.append('level_20')

        # Adicionar novas conquistas
        player["achievements"] = achievements + new_achievements

        return new_achievements

    def create_tournament(self, tournament_data: Dict) -> Dict:
        tournament_id = f"tournament_{int(time.time())}"
        tournament = {
            "id": tournament_id,
            "name": tournament_data["name"],
            "game": tournament_data["game"],
            "type": tournament_data.get("type", "elimination"),
            "maxPlayers": tournament_data.get("maxPlayers", 16),
            "entryFee": tournament_data.get("entryFee", 0),
            "prizePool": tournament_data.get("prizePool", 0),
            "startDate": (datetime.now() + timedelta(days=1)).isoformat(),
            "endDate": (datetime.now() + timedelta(days=7)).isoformat(),
            "status": "registration",
            "participants": [],
            "matches": [],
            "createdAt": datetime.now().isoformat(),
            "createdBy": tournament_data.get("createdBy", "unknown"),
        }

        self.tournaments[tournament_id] = tournament
        return tournament

    def get_active_tournaments(self) -> List[Dict]:
        active_tournaments = []
        for tournament in self.tournaments.values():
            if tournament["status"] in ["registration", "active"]:
                active_tournaments.append(tournament)
        
        return sorted(active_tournaments, key=lambda x: x["startDate"])

    def register_player_in_tournament(self, tournament_id: str, player_id: str) -> Dict:
        if tournament_id not in self.tournaments:
            raise ValueError("Torneio não encontrado")
        if player_id not in self.players:
            raise ValueError("Jogador não encontrado")

        tournament = self.tournaments[tournament_id]
        player = self.players[player_id]

        if tournament["status"] != "registration":
            raise ValueError("Inscrições encerradas")
        if len(tournament["participants"]) >= tournament["maxPlayers"]:
            raise ValueError("Torneio lotado")
        if any(p["playerId"] == player_id for p in tournament["participants"]):
            raise ValueError("Jogador já inscrito")

        tournament["participants"].append({
            "playerId": player_id,
            "playerName": player["name"],
            "playerRating": player["rating"],
            "registeredAt": datetime.now().isoformat(),
        })

        return tournament

    def get_platform_stats(self) -> Dict:
        total_players = len(self.players)
        total_games = sum(stats["totalGames"] for stats in self.game_stats.values())
        
        # Jogadores ativos (últimos 7 dias)
        active_players = sum(1 for player in self.players.values() 
                           if (datetime.now() - player["lastActive"]).days <= 7)

        # Top jogos por número de partidas
        top_games = sorted(
            [(name, stats["totalGames"]) for name, stats in self.game_stats.items()],
            key=lambda x: x[1],
            reverse=True
        )[:5]

        # Nível médio dos jogadores
        average_level = sum(player["level"] for player in self.players.values()) / total_players if total_players > 0 else 0

        return {
            "totalPlayers": total_players,
            "activePlayers": active_players,
            "totalGames": total_games,
            "totalTournaments": len(self.tournaments),
            "topGames": [{"name": name, "totalGames": games} for name, games in top_games],
            "averagePlayerLevel": round(average_level, 1),
        }

    def get_seasonal_ranking(self, season: str = 'current', game: Optional[str] = None) -> Dict:
        # Implementação simplificada - em produção seria baseado em dados históricos
        players = list(self.players.values())
        
        if game and game in self.game_stats:
            # Filtrar por jogo específico
            game_stats = self.game_stats[game]
            return {
                "season": season,
                "game": game,
                "ranking": game_stats["topPlayers"][:20],
                "totalParticipants": game_stats["totalPlayers"],
            }

        # Ranking geral sazonal
        seasonal_players = []
        for player in players:
            seasonal_player = {
                **player,
                "seasonalRating": player["rating"] + random.randint(-50, 50),  # Simulação
                "seasonalGames": random.randint(5, 25),
            }
            seasonal_players.append(seasonal_player)

        seasonal_players.sort(key=lambda x: x["seasonalRating"], reverse=True)

        return {
            "season": season,
            "ranking": seasonal_players[:50],
            "totalParticipants": len(players),
            "startDate": (datetime.now() - timedelta(days=30)).isoformat(),
            "endDate": datetime.now().isoformat(),
        }

