const express = require("express");
const LeaderboardService = require("../services/leaderboardService");

const app = express();
const leaderboardService = new LeaderboardService();

app.use(express.json()); // Para parsear JSON no corpo das requisições

// Middleware CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Simulação de banco de dados de usuários
const users = [];

// Simulação de dados de jogos e progresso
const games = [
  { id: 1, name: "Senet", description: "O jogo dos mortos do Egito Antigo.", category: "board_game" },
  { id: 2, name: "Go", description: "Estratégia territorial milenar da Ásia.", category: "board_game" },
  { id: 3, name: "Mancala", description: "Jogo de sementes e estratégia da África.", category: "board_game" },
  { id: 4, name: "Chaturanga", description: "Ancestral do xadrez da Índia.", category: "board_game" },
  { id: 5, name: "Patolli", description: "Jogo de apostas sagrado Asteca.", category: "board_game" },
  { id: 6, name: "Hanafuda", description: "Cartas florais tradicionais do Japão.", category: "card_game" },
  { id: 7, name: "Nine Men\'s Morris", description: "Alinhamento estratégico da Europa Medieval.", category: "board_game" },
  { id: 8, name: "Hnefatafl", description: "Defesa do rei dos Vikings.", category: "board_game" },
  { id: 9, name: "Pachisi", description: "Corrida real da Índia.", category: "board_game" },
  { id: 10, name: "Royal Game of Ur", description: "Corrida real da Mesopotâmia.", category: "board_game" },
];

const progress = []; // Simulação de progresso do usuário em jogos
const gameSessions = []; // Simulação de sessões de jogo ativas

// Rota de registro de usuário
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Nome de usuário e senha são obrigatórios." });
  }

  if (users.find(user => user.username === username)) {
    return res.status(409).json({ message: "Nome de usuário já existe." });
  }

  const newUser = { id: users.length + 1, username, password }; // Em um ambiente real, a senha seria hash
  users.push(newUser);
  res.status(201).json({ message: "Usuário registrado com sucesso!", user: { id: newUser.id, username: newUser.username } });
});

// Rota de login de usuário
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Nome de usuário e senha são obrigatórios." });
  }

  const user = users.find(user => user.username === username && user.password === password); // Em um ambiente real, a senha seria comparada com o hash

  if (!user) {
    return res.status(401).json({ message: "Credenciais inválidas." });
  }

  res.status(200).json({ message: "Login bem-sucedido!", user: { id: user.id, username: user.username } });
});

// Rota de perfil de usuário (exemplo, em um ambiente real exigiria autenticação)
app.get("/profile/:username", (req, res) => {
  const { username } = req.params;
  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }

  res.status(200).json({ profile: { id: user.id, username: user.username, email: `${username}@example.com` } }); // Exemplo de dados de perfil
});

// Rota para obter todos os jogos
app.get("/games", (req, res) => {
  res.status(200).json(games);
});

// Rota para obter um jogo por ID
app.get("/games/:id", (req, res) => {
  const gameId = parseInt(req.params.id);
  const game = games.find(g => g.id === gameId);

  if (!game) {
    return res.status(404).json({ message: "Jogo não encontrado." });
  }
  res.status(200).json(game);
});

// Rota para obter o progresso de um usuário em um jogo específico
app.get("/progress/:userId/:gameId", (req, res) => {
  const userId = parseInt(req.params.userId);
  const gameId = parseInt(req.params.gameId);
  const userProgress = progress.find(p => p.userId === userId && p.gameId === gameId);

  if (!userProgress) {
    return res.status(404).json({ message: "Progresso não encontrado para este usuário e jogo." });
  }
  res.status(200).json(userProgress);
});

// Rota para atualizar o progresso de um usuário em um jogo
app.post("/progress", (req, res) => {
  const { userId, gameId, score, level, status } = req.body;

  if (!userId || !gameId) {
    return res.status(400).json({ message: "ID do usuário e ID do jogo são obrigatórios." });
  }

  let userProgress = progress.find(p => p.userId === userId && p.gameId === gameId);

  if (userProgress) {
    // Atualiza o progresso existente
    userProgress.score = score !== undefined ? score : userProgress.score;
    userProgress.level = level !== undefined ? level : userProgress.level;
    userProgress.status = status !== undefined ? status : userProgress.status;
    res.status(200).json({ message: "Progresso atualizado com sucesso!", progress: userProgress });
  } else {
    // Cria um novo progresso
    const newProgress = { userId, gameId, score: score || 0, level: level || 1, status: status || "started" };
    progress.push(newProgress);
    res.status(201).json({ message: "Progresso criado com sucesso!", progress: newProgress });
  }
});

// Rota para iniciar uma nova sessão de jogo
app.post("/game/start", (req, res) => {
  const { userId, gameId, mode } = req.body;

  if (!userId || !gameId || !mode) {
    return res.status(400).json({ message: "ID do usuário, ID do jogo e modo são obrigatórios." });
  }

  const game = games.find(g => g.id === gameId);
  if (!game) {
    return res.status(404).json({ message: "Jogo não encontrado." });
  }

  const newSession = { id: gameSessions.length + 1, userId, gameId, mode, startTime: new Date(), status: "active" };
  gameSessions.push(newSession);
  res.status(201).json({ message: "Sessão de jogo iniciada!", session: newSession });
});

// Rota para obter o estado de uma sessão de jogo (placeholder)
app.get("/game/session/:sessionId", (req, res) => {
  const sessionId = parseInt(req.params.sessionId);
  const session = gameSessions.find(s => s.id === sessionId);

  if (!session) {
    return res.status(404).json({ message: "Sessão de jogo não encontrada." });
  }
  // Em um ambiente real, aqui seria retornada a lógica do tabuleiro/estado do jogo
  res.status(200).json({ message: "Estado da sessão de jogo", session, gameState: { board: [], players: [] } });
});

// Rota para finalizar uma sessão de jogo (placeholder)
app.post("/game/end/:sessionId", (req, res) => {
  const sessionId = parseInt(req.params.sessionId);
  const session = gameSessions.find(s => s.id === sessionId);

  if (!session) {
    return res.status(404).json({ message: "Sessão de jogo não encontrada." });
  }

  session.status = "completed";
  session.endTime = new Date();
  res.status(200).json({ message: "Sessão de jogo finalizada!", session });
});

app.get("/", (req, res) => {
  res.send("Backend de The Odyssey of Games está funcionando!");
});

// ===== ROTAS DO SISTEMA DE LEADERBOARD E PONTUAÇÃO =====

// Obter ranking global
app.get("/leaderboard/global", (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const leaderboard = leaderboardService.getGlobalLeaderboard(limit);
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter ranking global", error: error.message });
  }
});

// Obter ranking por jogo
app.get("/leaderboard/game/:gameName", (req, res) => {
  try {
    const { gameName } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const leaderboard = leaderboardService.getGameLeaderboard(gameName, limit);
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(404).json({ message: "Erro ao obter ranking do jogo", error: error.message });
  }
});

// Obter estatísticas de um jogador
app.get("/player/:playerId/stats", (req, res) => {
  try {
    const { playerId } = req.params;
    const playerStats = leaderboardService.getPlayerStats(playerId);
    res.status(200).json(playerStats);
  } catch (error) {
    res.status(404).json({ message: "Jogador não encontrado", error: error.message });
  }
});

// Atualizar estatísticas após uma partida
app.post("/player/:playerId/game-result", (req, res) => {
  try {
    const { playerId } = req.params;
    const gameResult = req.body;
    
    // Validar dados obrigatórios
    if (!gameResult.gameName || typeof gameResult.won !== 'boolean') {
      return res.status(400).json({ 
        message: "Dados obrigatórios: gameName (string) e won (boolean)" 
      });
    }

    const result = leaderboardService.updatePlayerAfterGame(playerId, gameResult);
    res.status(200).json({
      message: "Estatísticas atualizadas com sucesso",
      ...result
    });
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar estatísticas", error: error.message });
  }
});

// Obter estatísticas gerais da plataforma
app.get("/platform/stats", (req, res) => {
  try {
    const stats = leaderboardService.getPlatformStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter estatísticas da plataforma", error: error.message });
  }
});

// Obter ranking sazonal
app.get("/leaderboard/seasonal", (req, res) => {
  try {
    const season = req.query.season || 'current';
    const game = req.query.game || null;
    const ranking = leaderboardService.getSeasonalRanking(season, game);
    res.status(200).json(ranking);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter ranking sazonal", error: error.message });
  }
});

// ===== ROTAS DE TORNEIOS =====

// Criar torneio
app.post("/tournaments", (req, res) => {
  try {
    const tournament = leaderboardService.createTournament(req.body);
    res.status(201).json({
      message: "Torneio criado com sucesso",
      tournament
    });
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar torneio", error: error.message });
  }
});

// Obter torneios ativos
app.get("/tournaments/active", (req, res) => {
  try {
    const tournaments = leaderboardService.getActiveTournaments();
    res.status(200).json(tournaments);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter torneios ativos", error: error.message });
  }
});

// Inscrever jogador em torneio
app.post("/tournaments/:tournamentId/register", (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { playerId } = req.body;
    
    if (!playerId) {
      return res.status(400).json({ message: "playerId é obrigatório" });
    }

    const tournament = leaderboardService.registerPlayerInTournament(tournamentId, playerId);
    res.status(200).json({
      message: "Jogador inscrito com sucesso",
      tournament
    });
  } catch (error) {
    res.status(400).json({ message: "Erro ao inscrever jogador", error: error.message });
  }
});

// ===== ROTAS DE CONQUISTAS =====

// Obter todas as conquistas disponíveis
app.get("/achievements", (req, res) => {
  const achievements = [
    { id: 'first_win', name: 'Primeira Vitória', description: 'Ganhe sua primeira partida', icon: '🏆', rarity: 'common' },
    { id: 'win_streak_5', name: 'Sequência de 5', description: 'Ganhe 5 partidas seguidas', icon: '🔥', rarity: 'uncommon' },
    { id: 'win_streak_10', name: 'Sequência de 10', description: 'Ganhe 10 partidas seguidas', icon: '⚡', rarity: 'rare' },
    { id: 'games_played_100', name: 'Veterano', description: 'Jogue 100 partidas', icon: '🎖️', rarity: 'uncommon' },
    { id: 'level_10', name: 'Explorador', description: 'Alcance o nível 10', icon: '🌟', rarity: 'common' },
    { id: 'level_20', name: 'Aventureiro', description: 'Alcance o nível 20', icon: '⭐', rarity: 'uncommon' },
    { id: 'master_senet', name: 'Mestre do Senet', description: 'Ganhe 10 partidas de Senet', icon: '🏺', rarity: 'rare' },
    { id: 'master_go', name: 'Mestre do Go', description: 'Ganhe 10 partidas de Go', icon: '⚫', rarity: 'rare' },
    { id: 'master_mancala', name: 'Mestre do Mancala', description: 'Ganhe 10 partidas de Mancala', icon: '🌰', rarity: 'rare' },
    { id: 'collector', name: 'Colecionador', description: 'Jogue todos os jogos disponíveis', icon: '📚', rarity: 'legendary' },
  ];
  
  res.status(200).json(achievements);
});

module.exports = app;

