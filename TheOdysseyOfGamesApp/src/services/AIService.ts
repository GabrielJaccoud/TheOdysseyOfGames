import GameService from './GameService';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface AIMove {
  from?: { x: number; y: number };
  to: { x: number; y: number };
  piece?: any;
  value?: number;
  confidence: number;
}

export interface GamePosition {
  board: any[][];
  currentPlayer: number;
  gameState: any;
}

class AIService {
  private static instance: AIService;
  private gameService: GameService;

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  constructor() {
    this.gameService = GameService.getInstance();
  }

  // IA para Senet
  async calculateSenetMove(gameState: any, difficulty: Difficulty): Promise<AIMove | null> {
    const player = gameState.players[gameState.currentPlayer];
    const diceValue = gameState.diceValue;

    if (!player || diceValue === 0) return null;

    const possibleMoves: AIMove[] = [];

    // Avaliar todos os movimentos possíveis
    player.pieces.forEach((piece: any, index: number) => {
      if (piece.position >= 0) {
        const newPosition = piece.position + diceValue;
        if (newPosition <= 29) { // 30 casas no Senet
          const confidence = this.evaluateSenetMove(gameState, index, newPosition, difficulty);
          possibleMoves.push({
            to: { x: index, y: newPosition },
            piece: index,
            confidence,
          });
        }
      }
    });

    if (possibleMoves.length === 0) return null;

    // Ordenar por confiança e aplicar dificuldade
    possibleMoves.sort((a, b) => b.confidence - a.confidence);

    return this.selectMoveByDifficulty(possibleMoves, difficulty);
  }

  private evaluateSenetMove(gameState: any, pieceIndex: number, newPosition: number, difficulty: Difficulty): number {
    let score = 0;

    // Pontuação básica por progresso
    score += newPosition * 2;

    // Bonificação por casas especiais (casas seguras)
    const safeHouses = [4, 8, 14, 23, 26, 28];
    if (safeHouses.includes(newPosition)) {
      score += 50;
    }

    // Penalização por casas perigosas
    const dangerousHouses = [27]; // Casa da água
    if (dangerousHouses.includes(newPosition)) {
      score -= 30;
    }

    // Verificar se pode capturar peça inimiga
    const enemyPieces = gameState.players[(gameState.currentPlayer + 1) % 2].pieces;
    const canCapture = enemyPieces.some((piece: any) => piece.position === newPosition);
    if (canCapture) {
      score += 100;
    }

    // Verificar se pode bloquear inimigo
    const blockingScore = this.calculateBlockingScore(gameState, newPosition);
    score += blockingScore;

    return Math.max(0, score);
  }

  // IA para Go
  async calculateGoMove(gameState: any, difficulty: Difficulty): Promise<AIMove | null> {
    const boardSize = gameState.boardSize || 19;
    const board = gameState.board;
    const currentPlayer = gameState.currentPlayer;

    const possibleMoves: AIMove[] = [];

    // Avaliar todas as posições vazias
    for (let x = 0; x < boardSize; x++) {
      for (let y = 0; y < boardSize; y++) {
        if (board[x][y] === 0) { // Posição vazia
          const confidence = this.evaluateGoMove(gameState, x, y, currentPlayer, difficulty);
          if (confidence > 0) {
            possibleMoves.push({
              to: { x, y },
              confidence,
            });
          }
        }
      }
    }

    if (possibleMoves.length === 0) return null;

    possibleMoves.sort((a, b) => b.confidence - a.confidence);
    return this.selectMoveByDifficulty(possibleMoves, difficulty);
  }

  private evaluateGoMove(gameState: any, x: number, y: number, player: number, difficulty: Difficulty): number {
    let score = 0;
    const board = gameState.board;
    const boardSize = gameState.boardSize || 19;

    // Pontuação por posição (centro vale mais)
    const centerDistance = Math.abs(x - boardSize/2) + Math.abs(y - boardSize/2);
    score += Math.max(0, 20 - centerDistance);

    // Verificar capturas possíveis
    const captureScore = this.calculateGoCaptureScore(board, x, y, player, boardSize);
    score += captureScore * 50;

    // Verificar conexões com peças próprias
    const connectionScore = this.calculateGoConnectionScore(board, x, y, player, boardSize);
    score += connectionScore * 30;

    // Verificar se a jogada é suicida
    if (this.isGoSuicideMove(board, x, y, player, boardSize)) {
      score -= 1000;
    }

    return Math.max(0, score);
  }

  // IA para Mancala
  async calculateMancalaMove(gameState: any, difficulty: Difficulty): Promise<AIMove | null> {
    const currentPlayer = gameState.currentPlayer;
    const playerPits = gameState.board[currentPlayer];

    const possibleMoves: AIMove[] = [];

    // Avaliar cada casa do jogador atual
    playerPits.forEach((seeds: number, index: number) => {
      if (seeds > 0) {
        const confidence = this.evaluateMancalaMove(gameState, index, difficulty);
        possibleMoves.push({
          to: { x: currentPlayer, y: index },
          confidence,
        });
      }
    });

    if (possibleMoves.length === 0) return null;

    possibleMoves.sort((a, b) => b.confidence - a.confidence);
    return this.selectMoveByDifficulty(possibleMoves, difficulty);
  }

  private evaluateMancalaMove(gameState: any, pitIndex: number, difficulty: Difficulty): number {
    let score = 0;
    const currentPlayer = gameState.currentPlayer;
    const seeds = gameState.board[currentPlayer][pitIndex];

    // Simular o movimento
    const simulatedState = this.simulateMancalaMove(gameState, pitIndex);

    // Bonificação por jogar novamente
    if (simulatedState.extraTurn) {
      score += 100;
    }

    // Bonificação por capturar sementes
    if (simulatedState.capturedSeeds > 0) {
      score += simulatedState.capturedSeeds * 20;
    }

    // Bonificação por esvaziar casa (estratégia defensiva)
    if (seeds > 0) {
      score += seeds * 5;
    }

    // Penalização por dar muitas sementes ao oponente
    if (simulatedState.seedsToOpponent > 3) {
      score -= simulatedState.seedsToOpponent * 10;
    }

    return Math.max(0, score);
  }

  // IA para Pachisi
  async calculatePachisiMove(gameState: any, difficulty: Difficulty): Promise<AIMove | null> {
    const currentPlayer = gameState.currentPlayer;
    const player = gameState.players[currentPlayer];
    const diceValue = gameState.diceValue;

    if (!player || diceValue === 0) return null;

    const possibleMoves: AIMove[] = [];

    // Avaliar movimento de cada peça
    player.pieces.forEach((piece: any, index: number) => {
      let canMove = false;
      let newPosition = piece.position;

      if (piece.isHome && diceValue === 6) {
        canMove = true;
        newPosition = currentPlayer * 13; // Posição inicial
      } else if (!piece.isHome && piece.position + diceValue <= 51) {
        canMove = true;
        newPosition = piece.position + diceValue;
      }

      if (canMove) {
        const confidence = this.evaluatePachisiMove(gameState, index, newPosition, difficulty);
        possibleMoves.push({
          to: { x: currentPlayer, y: index },
          piece: index,
          confidence,
        });
      }
    });

    if (possibleMoves.length === 0) return null;

    possibleMoves.sort((a, b) => b.confidence - a.confidence);
    return this.selectMoveByDifficulty(possibleMoves, difficulty);
  }

  private evaluatePachisiMove(gameState: any, pieceIndex: number, newPosition: number, difficulty: Difficulty): number {
    let score = 0;

    // Pontuação por progresso
    score += newPosition * 2;

    // Bonificação por sair de casa
    const piece = gameState.players[gameState.currentPlayer].pieces[pieceIndex];
    if (piece.isHome) {
      score += 50;
    }

    // Bonificação por casas seguras
    const safePositions = [0, 8, 13, 21, 26, 34, 39, 47];
    if (safePositions.includes(newPosition)) {
      score += 30;
    }

    // Verificar captura de peças inimigas
    const canCapture = gameState.players.some((p: any, pIndex: number) => {
      if (pIndex === gameState.currentPlayer) return false;
      return p.pieces.some((otherPiece: any) => 
        !otherPiece.isHome && otherPiece.position === newPosition && !safePositions.includes(newPosition)
      );
    });

    if (canCapture) {
      score += 150;
    }

    // Bonificação por chegar ao final
    if (newPosition === 51) {
      score += 200;
    }

    return Math.max(0, score);
  }

  // Seleção de movimento baseada na dificuldade
  private selectMoveByDifficulty(moves: AIMove[], difficulty: Difficulty): AIMove {
    if (moves.length === 0) {
      throw new Error('Nenhum movimento disponível');
    }

    switch (difficulty) {
      case 'easy':
        // 70% chance de escolher um movimento aleatório, 30% o melhor
        if (Math.random() < 0.7) {
          return moves[Math.floor(Math.random() * Math.min(moves.length, 3))];
        }
        return moves[0];

      case 'medium':
        // 40% chance de escolher o melhor, 60% entre os 3 melhores
        if (Math.random() < 0.4) {
          return moves[0];
        }
        return moves[Math.floor(Math.random() * Math.min(moves.length, 3))];

      case 'hard':
        // 80% chance de escolher o melhor movimento
        if (Math.random() < 0.8) {
          return moves[0];
        }
        return moves[Math.floor(Math.random() * Math.min(moves.length, 2))];

      default:
        return moves[0];
    }
  }

  // Métodos auxiliares
  private calculateBlockingScore(gameState: any, position: number): number {
    // Implementação simplificada para calcular se a posição bloqueia o inimigo
    return 0;
  }

  private calculateGoCaptureScore(board: any[][], x: number, y: number, player: number, boardSize: number): number {
    // Implementação simplificada para calcular capturas no Go
    return 0;
  }

  private calculateGoConnectionScore(board: any[][], x: number, y: number, player: number, boardSize: number): number {
    // Implementação simplificada para calcular conexões no Go
    let connections = 0;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    directions.forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[nx][ny] === player) {
        connections++;
      }
    });

    return connections;
  }

  private isGoSuicideMove(board: any[][], x: number, y: number, player: number, boardSize: number): boolean {
    // Implementação simplificada para detectar movimentos suicidas no Go
    return false;
  }

  private simulateMancalaMove(gameState: any, pitIndex: number): any {
    // Implementação simplificada para simular movimento no Mancala
    return {
      extraTurn: false,
      capturedSeeds: 0,
      seedsToOpponent: 0,
    };
  }

  // Método principal para obter movimento da IA
  async getAIMove(gameName: string, gameState: any): Promise<AIMove | null> {
    const difficulty = this.gameService.getAIDifficulty();

    switch (gameName) {
      case 'Senet':
        return this.calculateSenetMove(gameState, difficulty);
      case 'Go':
        return this.calculateGoMove(gameState, difficulty);
      case 'Mancala':
        return this.calculateMancalaMove(gameState, difficulty);
      case 'Pachisi':
        return this.calculatePachisiMove(gameState, difficulty);
      default:
        return null;
    }
  }

  // Análise de jogada do jogador (para feedback)
  analyzePlayerMove(gameName: string, gameState: any, playerMove: AIMove): string {
    const aiMove = this.getAIMove(gameName, gameState);
    
    if (!aiMove) return 'Movimento válido!';

    if (playerMove.confidence && aiMove.confidence) {
      const efficiency = (playerMove.confidence / aiMove.confidence) * 100;
      
      if (efficiency >= 90) return 'Excelente jogada! 🏆';
      if (efficiency >= 70) return 'Boa jogada! 👍';
      if (efficiency >= 50) return 'Jogada razoável. 🤔';
      return 'Considere outras opções. 💭';
    }

    return 'Movimento válido!';
  }
}

export default AIService;

