// Serviço de Leaderboard e Sistema de Ranking
class LeaderboardService {
  constructor() {
    // Simulação de banco de dados em memória
    this.players = new Map();
    this.gameStats = new Map();
    this.tournaments = new Map();
    this.seasonalRankings = new Map();
    
    // Inicializar dados de exemplo
    this.initializeExampleData();
  }

  initializeExampleData() {
    // Jogadores de exemplo
    const examplePlayers = [
      { id: '1', name: 'Alexandre, o Grande', level: 25, experience: 15420, avatar: '👑' },
      { id: '2', name: 'Cleópatra VII', level: 22, experience: 12890, avatar: '👸' },
      { id: '3', name: 'Sun Tzu', level: 28, experience: 18750, avatar: '🥋' },
      { id: '4', name: 'Joana d\'Arc', level: 20, experience: 11200, avatar: '⚔️' },
      { id: '5', name: 'Leonardo da Vinci', level: 30, experience: 22100, avatar: '🎨' },
    ];

    examplePlayers.forEach(player => {
      this.players.set(player.id, {
        ...player,
        gamesPlayed: Math.floor(Math.random() * 100) + 50,
        gamesWon: Math.floor(Math.random() * 60) + 20,
        currentStreak: Math.floor(Math.random() * 10),
        bestStreak: Math.floor(Math.random() * 20) + 5,
        favoriteGame: ['Senet', 'Go', 'Mancala', 'Chaturanga'][Math.floor(Math.random() * 4)],
        joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        achievements: this.generateRandomAchievements(),
        rating: Math.floor(Math.random() * 1000) + 1200,
      });
    });

    // Estatísticas por jogo
    const games = ['Senet', 'Go', 'Mancala', 'Chaturanga', 'Patolli', 'Hanafuda', 'NineMensMorris', 'Hnefatafl', 'Pachisi'];
    games.forEach(game => {
      this.gameStats.set(game, {
        totalGames: Math.floor(Math.random() * 10000) + 5000,
        totalPlayers: Math.floor(Math.random() * 1000) + 500,
        averageGameTime: Math.floor(Math.random() * 20) + 10, // minutos
        topPlayers: this.generateTopPlayersForGame(game),
      });
    });
  }

  generateRandomAchievements() {
    const allAchievements = [
      'first_win', 'win_streak_5', 'win_streak_10', 'games_played_100',
      'master_senet', 'master_go', 'master_mancala', 'level_10', 'level_20'
    ];
    const count = Math.floor(Math.random() * 5) + 2;
    return allAchievements.slice(0, count);
  }

  generateTopPlayersForGame(game) {
    const playerIds = Array.from(this.players.keys());
    return playerIds
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)
      .map((id, index) => ({
        playerId: id,
        playerName: this.players.get(id).name,
        rating: 1500 - (index * 50) + Math.floor(Math.random() * 100),
        gamesPlayed: Math.floor(Math.random() * 50) + 20,
        winRate: Math.max(0.3, 0.9 - (index * 0.05) + (Math.random() * 0.1)),
      }));
  }

  // Obter ranking global
  getGlobalLeaderboard(limit = 50) {
    const players = Array.from(this.players.values())
      .sort((a, b) => {
        // Ordenar por rating, depois por experiência
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.experience - a.experience;
      })
      .slice(0, limit)
      .map((player, index) => ({
        rank: index + 1,
        ...player,
        winRate: player.gamesPlayed > 0 ? (player.gamesWon / player.gamesPlayed) : 0,
      }));

    return {
      leaderboard: players,
      totalPlayers: this.players.size,
      lastUpdated: new Date(),
    };
  }

  // Obter ranking por jogo específico
  getGameLeaderboard(gameName, limit = 50) {
    const gameStats = this.gameStats.get(gameName);
    if (!gameStats) {
      throw new Error(`Jogo ${gameName} não encontrado`);
    }

    return {
      game: gameName,
      leaderboard: gameStats.topPlayers.slice(0, limit),
      totalPlayers: gameStats.totalPlayers,
      totalGames: gameStats.totalGames,
      averageGameTime: gameStats.averageGameTime,
      lastUpdated: new Date(),
    };
  }

  // Obter estatísticas de um jogador específico
  getPlayerStats(playerId) {
    const player = this.players.get(playerId);
    if (!player) {
      throw new Error('Jogador não encontrado');
    }

    // Calcular posição no ranking global
    const allPlayers = Array.from(this.players.values())
      .sort((a, b) => b.rating - a.rating);
    const globalRank = allPlayers.findIndex(p => p.id === playerId) + 1;

    // Calcular estatísticas por jogo
    const gameStats = {};
    Array.from(this.gameStats.keys()).forEach(game => {
      const gameLeaderboard = this.getGameLeaderboard(game);
      const playerInGame = gameLeaderboard.leaderboard.find(p => p.playerId === playerId);
      if (playerInGame) {
        gameStats[game] = {
          rank: gameLeaderboard.leaderboard.indexOf(playerInGame) + 1,
          rating: playerInGame.rating,
          gamesPlayed: playerInGame.gamesPlayed,
          winRate: playerInGame.winRate,
        };
      }
    });

    return {
      ...player,
      globalRank,
      gameStats,
      winRate: player.gamesPlayed > 0 ? (player.gamesWon / player.gamesPlayed) : 0,
    };
  }

  // Atualizar estatísticas após uma partida
  updatePlayerAfterGame(playerId, gameResult) {
    const player = this.players.get(playerId);
    if (!player) {
      throw new Error('Jogador não encontrado');
    }

    const { gameName, won, gameTime, opponentRating = 1500 } = gameResult;

    // Atualizar estatísticas básicas
    player.gamesPlayed++;
    if (won) {
      player.gamesWon++;
      player.currentStreak++;
      player.bestStreak = Math.max(player.bestStreak, player.currentStreak);
    } else {
      player.currentStreak = 0;
    }

    // Calcular mudança no rating (sistema ELO simplificado)
    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - player.rating) / 400));
    const actualScore = won ? 1 : 0;
    const kFactor = 32; // Fator K para mudança de rating
    const ratingChange = Math.round(kFactor * (actualScore - expectedScore));
    
    player.rating = Math.max(800, player.rating + ratingChange);

    // Atualizar experiência
    const baseExp = won ? 100 : 25;
    const timeBonus = Math.max(0, 30 - Math.floor(gameTime / 60)); // Bônus por jogos rápidos
    const streakBonus = player.currentStreak > 1 ? player.currentStreak * 10 : 0;
    
    player.experience += baseExp + timeBonus + streakBonus;

    // Verificar se subiu de nível
    const newLevel = Math.floor(player.experience / 1000) + 1;
    const leveledUp = newLevel > player.level;
    player.level = newLevel;

    // Atualizar última atividade
    player.lastActive = new Date();

    // Verificar conquistas
    const newAchievements = this.checkAchievements(player);

    return {
      player,
      ratingChange,
      experienceGained: baseExp + timeBonus + streakBonus,
      leveledUp,
      newAchievements,
    };
  }

  // Verificar conquistas
  checkAchievements(player) {
    const newAchievements = [];
    const achievements = player.achievements || [];

    // Conquistas de vitórias
    if (player.gamesWon >= 1 && !achievements.includes('first_win')) {
      newAchievements.push('first_win');
    }
    if (player.currentStreak >= 5 && !achievements.includes('win_streak_5')) {
      newAchievements.push('win_streak_5');
    }
    if (player.currentStreak >= 10 && !achievements.includes('win_streak_10')) {
      newAchievements.push('win_streak_10');
    }

    // Conquistas de jogos
    if (player.gamesPlayed >= 100 && !achievements.includes('games_played_100')) {
      newAchievements.push('games_played_100');
    }

    // Conquistas de nível
    if (player.level >= 10 && !achievements.includes('level_10')) {
      newAchievements.push('level_10');
    }
    if (player.level >= 20 && !achievements.includes('level_20')) {
      newAchievements.push('level_20');
    }

    // Adicionar novas conquistas
    player.achievements = [...achievements, ...newAchievements];

    return newAchievements;
  }

  // Criar torneio
  createTournament(tournamentData) {
    const tournamentId = `tournament_${Date.now()}`;
    const tournament = {
      id: tournamentId,
      name: tournamentData.name,
      game: tournamentData.game,
      type: tournamentData.type || 'elimination', // elimination, round_robin, swiss
      maxPlayers: tournamentData.maxPlayers || 16,
      entryFee: tournamentData.entryFee || 0,
      prizePool: tournamentData.prizePool || 0,
      startDate: new Date(tournamentData.startDate),
      endDate: new Date(tournamentData.endDate),
      status: 'registration', // registration, active, completed
      participants: [],
      matches: [],
      createdAt: new Date(),
      createdBy: tournamentData.createdBy,
    };

    this.tournaments.set(tournamentId, tournament);
    return tournament;
  }

  // Obter torneios ativos
  getActiveTournaments() {
    return Array.from(this.tournaments.values())
      .filter(t => t.status === 'registration' || t.status === 'active')
      .sort((a, b) => a.startDate - b.startDate);
  }

  // Inscrever jogador em torneio
  registerPlayerInTournament(tournamentId, playerId) {
    const tournament = this.tournaments.get(tournamentId);
    const player = this.players.get(playerId);

    if (!tournament) throw new Error('Torneio não encontrado');
    if (!player) throw new Error('Jogador não encontrado');
    if (tournament.status !== 'registration') throw new Error('Inscrições encerradas');
    if (tournament.participants.length >= tournament.maxPlayers) throw new Error('Torneio lotado');
    if (tournament.participants.some(p => p.playerId === playerId)) throw new Error('Jogador já inscrito');

    tournament.participants.push({
      playerId,
      playerName: player.name,
      playerRating: player.rating,
      registeredAt: new Date(),
    });

    return tournament;
  }

  // Obter estatísticas gerais da plataforma
  getPlatformStats() {
    const totalPlayers = this.players.size;
    const totalGames = Array.from(this.gameStats.values())
      .reduce((sum, stats) => sum + stats.totalGames, 0);
    
    const activePlayers = Array.from(this.players.values())
      .filter(p => {
        const daysSinceActive = (Date.now() - p.lastActive) / (1000 * 60 * 60 * 24);
        return daysSinceActive <= 7;
      }).length;

    const topGames = Array.from(this.gameStats.entries())
      .sort(([,a], [,b]) => b.totalGames - a.totalGames)
      .slice(0, 5)
      .map(([name, stats]) => ({ name, totalGames: stats.totalGames }));

    return {
      totalPlayers,
      activePlayers,
      totalGames,
      totalTournaments: this.tournaments.size,
      topGames,
      averagePlayerLevel: Array.from(this.players.values())
        .reduce((sum, p) => sum + p.level, 0) / totalPlayers,
    };
  }

  // Obter ranking semanal/mensal
  getSeasonalRanking(season = 'current', game = null) {
    // Implementação simplificada - em produção seria baseado em dados históricos
    const players = Array.from(this.players.values());
    
    if (game) {
      // Filtrar por jogo específico
      const gameStats = this.gameStats.get(game);
      if (gameStats) {
        return {
          season,
          game,
          ranking: gameStats.topPlayers.slice(0, 20),
          totalParticipants: gameStats.totalPlayers,
        };
      }
    }

    // Ranking geral sazonal
    const seasonalPlayers = players
      .map(player => ({
        ...player,
        seasonalRating: player.rating + Math.floor(Math.random() * 100) - 50, // Simulação
        seasonalGames: Math.floor(Math.random() * 20) + 5,
      }))
      .sort((a, b) => b.seasonalRating - a.seasonalRating)
      .slice(0, 50);

    return {
      season,
      ranking: seasonalPlayers,
      totalParticipants: players.length,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
      endDate: new Date(),
    };
  }
}

module.exports = LeaderboardService;

