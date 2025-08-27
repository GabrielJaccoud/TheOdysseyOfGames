import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GameSave {
  id: string;
  gameName: string;
  gameState: any;
  timestamp: number;
  playerName: string;
  progress: number;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  totalPlayTime: number;
  favoriteGame: string;
  achievements: string[];
}

export interface PlayerProfile {
  name: string;
  level: number;
  experience: number;
  stats: { [gameName: string]: GameStats };
  achievements: string[];
  preferences: {
    difficulty: 'easy' | 'medium' | 'hard';
    soundEnabled: boolean;
    animationsEnabled: boolean;
  };
}

class GameService {
  private static instance: GameService;
  private playerProfile: PlayerProfile | null = null;

  static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService();
    }
    return GameService.instance;
  }

  // Gerenciamento de Perfil do Jogador
  async loadPlayerProfile(): Promise<PlayerProfile> {
    try {
      const profileData = await AsyncStorage.getItem('playerProfile');
      if (profileData) {
        this.playerProfile = JSON.parse(profileData);
        return this.playerProfile!;
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do jogador:', error);
    }

    // Criar perfil padrão se não existir
    this.playerProfile = {
      name: 'Aventureiro',
      level: 1,
      experience: 0,
      stats: {},
      achievements: [],
      preferences: {
        difficulty: 'medium',
        soundEnabled: true,
        animationsEnabled: true,
      },
    };

    await this.savePlayerProfile();
    return this.playerProfile;
  }

  async savePlayerProfile(): Promise<void> {
    if (this.playerProfile) {
      try {
        await AsyncStorage.setItem('playerProfile', JSON.stringify(this.playerProfile));
      } catch (error) {
        console.error('Erro ao salvar perfil do jogador:', error);
      }
    }
  }

  async updatePlayerStats(gameName: string, won: boolean, playTime: number): Promise<void> {
    if (!this.playerProfile) {
      await this.loadPlayerProfile();
    }

    if (!this.playerProfile!.stats[gameName]) {
      this.playerProfile!.stats[gameName] = {
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        totalPlayTime: 0,
        favoriteGame: gameName,
        achievements: [],
      };
    }

    const stats = this.playerProfile!.stats[gameName];
    stats.gamesPlayed++;
    stats.totalPlayTime += playTime;

    if (won) {
      stats.gamesWon++;
      this.playerProfile!.experience += 100;
    } else {
      stats.gamesLost++;
      this.playerProfile!.experience += 25;
    }

    // Verificar se subiu de nível
    const newLevel = Math.floor(this.playerProfile!.experience / 1000) + 1;
    if (newLevel > this.playerProfile!.level) {
      this.playerProfile!.level = newLevel;
      this.checkAchievements();
    }

    await this.savePlayerProfile();
  }

  // Sistema de Conquistas
  private checkAchievements(): void {
    if (!this.playerProfile) return;

    const achievements = this.playerProfile.achievements;

    // Conquista de nível
    if (this.playerProfile.level >= 5 && !achievements.includes('level_5')) {
      achievements.push('level_5');
    }
    if (this.playerProfile.level >= 10 && !achievements.includes('level_10')) {
      achievements.push('level_10');
    }

    // Conquistas por jogos
    Object.entries(this.playerProfile.stats).forEach(([gameName, stats]) => {
      if (stats.gamesWon >= 10 && !achievements.includes(`${gameName}_master`)) {
        achievements.push(`${gameName}_master`);
      }
      if (stats.gamesPlayed >= 50 && !achievements.includes(`${gameName}_veteran`)) {
        achievements.push(`${gameName}_veteran`);
      }
    });

    // Conquista de colecionador (jogou todos os jogos)
    const totalGames = Object.keys(this.playerProfile.stats).length;
    if (totalGames >= 9 && !achievements.includes('collector')) {
      achievements.push('collector');
    }
  }

  // Salvamento de Jogos
  async saveGame(gameName: string, gameState: any): Promise<string> {
    const gameId = `${gameName}_${Date.now()}`;
    const gameSave: GameSave = {
      id: gameId,
      gameName,
      gameState,
      timestamp: Date.now(),
      playerName: this.playerProfile?.name || 'Jogador',
      progress: this.calculateProgress(gameState),
    };

    try {
      const existingSaves = await this.getSavedGames();
      const updatedSaves = [...existingSaves, gameSave];
      
      // Manter apenas os 10 saves mais recentes por jogo
      const filteredSaves = updatedSaves
        .filter(save => save.gameName === gameName)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10);

      const otherSaves = updatedSaves.filter(save => save.gameName !== gameName);
      const finalSaves = [...otherSaves, ...filteredSaves];

      await AsyncStorage.setItem('savedGames', JSON.stringify(finalSaves));
      return gameId;
    } catch (error) {
      console.error('Erro ao salvar jogo:', error);
      throw error;
    }
  }

  async loadGame(gameId: string): Promise<GameSave | null> {
    try {
      const savedGames = await this.getSavedGames();
      return savedGames.find(save => save.id === gameId) || null;
    } catch (error) {
      console.error('Erro ao carregar jogo:', error);
      return null;
    }
  }

  async getSavedGames(): Promise<GameSave[]> {
    try {
      const savedGamesData = await AsyncStorage.getItem('savedGames');
      return savedGamesData ? JSON.parse(savedGamesData) : [];
    } catch (error) {
      console.error('Erro ao obter jogos salvos:', error);
      return [];
    }
  }

  async deleteSavedGame(gameId: string): Promise<void> {
    try {
      const savedGames = await this.getSavedGames();
      const filteredSaves = savedGames.filter(save => save.id !== gameId);
      await AsyncStorage.setItem('savedGames', JSON.stringify(filteredSaves));
    } catch (error) {
      console.error('Erro ao deletar jogo salvo:', error);
    }
  }

  // Cálculo de progresso do jogo (implementação básica)
  private calculateProgress(gameState: any): number {
    if (!gameState) return 0;

    // Lógica básica para calcular progresso
    if (gameState.gamePhase === 'finished') return 100;
    if (gameState.gamePhase === 'playing') return 50;
    if (gameState.gamePhase === 'setup') return 10;
    
    return 0;
  }

  // Sistema de Dicas e Tutoriais
  async getGameTips(gameName: string): Promise<string[]> {
    const tips: { [key: string]: string[] } = {
      'Senet': [
        'Use as casas seguras para proteger suas peças',
        'Tente bloquear o caminho do oponente',
        'Planeje seus movimentos com antecedência',
      ],
      'Go': [
        'Controle o centro do tabuleiro',
        'Conecte suas pedras para formar territórios',
        'Capture grupos inimigos cercando-os',
      ],
      'Mancala': [
        'Tente terminar em sua casa para jogar novamente',
        'Capture as sementes do oponente quando possível',
        'Mantenha sementes em suas casas para defesa',
      ],
      'Chaturanga': [
        'Proteja seu Rajá a todo custo',
        'Use os elefantes para controlar diagonais',
        'Coordene suas peças para ataques efetivos',
      ],
      'Patolli': [
        'Aposte com sabedoria nos dados',
        'Use as casas especiais estrategicamente',
        'Gerencie seus recursos cuidadosamente',
      ],
      'Hanafuda': [
        'Memorize as cartas que já foram jogadas',
        'Forme combinações valiosas',
        'Observe as cartas do oponente',
      ],
      'Nine Men\'s Morris': [
        'Forme moinhos para capturar peças inimigas',
        'Controle o centro do tabuleiro',
        'Bloqueie os movimentos do oponente',
      ],
      'Hnefatafl': [
        'Como atacante, cerque o rei',
        'Como defensor, proteja o rei e fuja para as bordas',
        'Use o terreno a seu favor',
      ],
      'Pachisi': [
        'Tire 6 para sair de casa',
        'Use as casas seguras para proteção',
        'Capture peças inimigas quando possível',
      ],
    };

    return tips[gameName] || ['Divirta-se jogando!'];
  }

  // Sistema de IA Adaptativa
  getAIDifficulty(): 'easy' | 'medium' | 'hard' {
    if (!this.playerProfile) return 'medium';
    
    const totalGames = Object.values(this.playerProfile.stats)
      .reduce((total, stats) => total + stats.gamesPlayed, 0);
    
    const winRate = Object.values(this.playerProfile.stats)
      .reduce((total, stats) => total + (stats.gamesWon / Math.max(stats.gamesPlayed, 1)), 0) / 
      Math.max(Object.keys(this.playerProfile.stats).length, 1);

    if (totalGames < 10 || winRate < 0.3) return 'easy';
    if (totalGames < 50 || winRate < 0.6) return 'medium';
    return 'hard';
  }

  // Análise de Desempenho
  async getPlayerAnalytics(): Promise<any> {
    if (!this.playerProfile) {
      await this.loadPlayerProfile();
    }

    const stats = this.playerProfile!.stats;
    const totalGames = Object.values(stats).reduce((total, s) => total + s.gamesPlayed, 0);
    const totalWins = Object.values(stats).reduce((total, s) => total + s.gamesWon, 0);
    const totalPlayTime = Object.values(stats).reduce((total, s) => total + s.totalPlayTime, 0);

    const favoriteGame = Object.entries(stats)
      .sort(([,a], [,b]) => b.gamesPlayed - a.gamesPlayed)[0]?.[0] || 'Nenhum';

    return {
      level: this.playerProfile!.level,
      experience: this.playerProfile!.experience,
      totalGames,
      totalWins,
      winRate: totalGames > 0 ? (totalWins / totalGames) * 100 : 0,
      totalPlayTime: Math.round(totalPlayTime / 60000), // em minutos
      favoriteGame,
      achievements: this.playerProfile!.achievements.length,
      gamesUnlocked: Object.keys(stats).length,
    };
  }
}

export default GameService;

