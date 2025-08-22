const express = require("express");
const app = express();

app.use(express.json()); // Para parsear JSON no corpo das requisições

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

module.exports = app;

