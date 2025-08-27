import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface Player {
  id: number;
  color: string;
  pieces: { id: number; position: number; isHome: boolean; isSafe: boolean }[];
  name: string;
}

interface GameState {
  currentPlayer: number;
  players: Player[];
  diceValue: number;
  gamePhase: 'setup' | 'playing' | 'finished';
  winner: number | null;
}

const PachisiGameScreen: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentPlayer: 0,
    players: [
      {
        id: 0,
        color: '#FF6B6B',
        name: 'Vermelho',
        pieces: [
          { id: 0, position: -1, isHome: true, isSafe: false },
          { id: 1, position: -1, isHome: true, isSafe: false },
          { id: 2, position: -1, isHome: true, isSafe: false },
          { id: 3, position: -1, isHome: true, isSafe: false },
        ],
      },
      {
        id: 1,
        color: '#4ECDC4',
        name: 'Verde',
        pieces: [
          { id: 0, position: -1, isHome: true, isSafe: false },
          { id: 1, position: -1, isHome: true, isSafe: false },
          { id: 2, position: -1, isHome: true, isSafe: false },
          { id: 3, position: -1, isHome: true, isSafe: false },
        ],
      },
      {
        id: 2,
        color: '#45B7D1',
        name: 'Azul',
        pieces: [
          { id: 0, position: -1, isHome: true, isSafe: false },
          { id: 1, position: -1, isHome: true, isSafe: false },
          { id: 2, position: -1, isHome: true, isSafe: false },
          { id: 3, position: -1, isHome: true, isSafe: false },
        ],
      },
      {
        id: 3,
        color: '#F7DC6F',
        name: 'Amarelo',
        pieces: [
          { id: 0, position: -1, isHome: true, isSafe: false },
          { id: 1, position: -1, isHome: true, isSafe: false },
          { id: 2, position: -1, isHome: true, isSafe: false },
          { id: 3, position: -1, isHome: true, isSafe: false },
        ],
      },
    ],
    diceValue: 0,
    gamePhase: 'setup',
    winner: null,
  });

  const [selectedPiece, setSelectedPiece] = useState<{
    playerId: number;
    pieceId: number;
  } | null>(null);

  // Posições seguras no tabuleiro (onde as peças não podem ser capturadas)
  const safePositions = [0, 8, 13, 21, 26, 34, 39, 47];

  const rollDice = () => {
    if (gameState.gamePhase !== 'playing') {
      setGameState(prev => ({ ...prev, gamePhase: 'playing' }));
    }

    const diceValue = Math.floor(Math.random() * 6) + 1;
    setGameState(prev => ({
      ...prev,
      diceValue,
    }));

    // Verificar se o jogador pode mover alguma peça
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const canMove = currentPlayer.pieces.some(piece => {
      if (piece.isHome && diceValue === 6) return true;
      if (!piece.isHome && piece.position + diceValue <= 51) return true;
      return false;
    });

    if (!canMove) {
      setTimeout(() => {
        nextPlayer();
      }, 1500);
    }
  };

  const nextPlayer = () => {
    setGameState(prev => ({
      ...prev,
      currentPlayer: (prev.currentPlayer + 1) % 4,
      diceValue: 0,
    }));
    setSelectedPiece(null);
  };

  const movePiece = (playerId: number, pieceId: number) => {
    if (playerId !== gameState.currentPlayer || gameState.diceValue === 0) {
      return;
    }

    const player = gameState.players[playerId];
    const piece = player.pieces[pieceId];

    // Se a peça está em casa, só pode sair com 6
    if (piece.isHome && gameState.diceValue !== 6) {
      Alert.alert('Movimento Inválido', 'Você precisa tirar 6 para sair de casa!');
      return;
    }

    let newPosition = piece.position;
    let newIsHome = piece.isHome;

    if (piece.isHome) {
      // Sair de casa
      newPosition = playerId * 13; // Posição inicial de cada jogador
      newIsHome = false;
    } else {
      // Mover no tabuleiro
      newPosition = piece.position + gameState.diceValue;
      if (newPosition > 51) {
        Alert.alert('Movimento Inválido', 'Movimento ultrapassa o final do tabuleiro!');
        return;
      }
    }

    // Verificar se há uma peça inimiga na posição de destino
    const targetOccupied = gameState.players.some((p, pIndex) => {
      if (pIndex === playerId) return false;
      return p.pieces.some(otherPiece => 
        !otherPiece.isHome && otherPiece.position === newPosition
      );
    });

    setGameState(prev => {
      const newState = { ...prev };
      
      // Se há uma peça inimiga e não é posição segura, capturar
      if (targetOccupied && !safePositions.includes(newPosition)) {
        newState.players.forEach((p, pIndex) => {
          if (pIndex !== playerId) {
            p.pieces.forEach(otherPiece => {
              if (!otherPiece.isHome && otherPiece.position === newPosition) {
                otherPiece.position = -1;
                otherPiece.isHome = true;
                otherPiece.isSafe = false;
              }
            });
          }
        });
      }

      // Mover a peça
      newState.players[playerId].pieces[pieceId] = {
        ...piece,
        position: newPosition,
        isHome: newIsHome,
        isSafe: safePositions.includes(newPosition),
      };

      // Verificar vitória
      const allPiecesFinished = newState.players[playerId].pieces.every(
        p => p.position === 51
      );
      
      if (allPiecesFinished) {
        newState.gamePhase = 'finished';
        newState.winner = playerId;
      }

      return newState;
    });

    // Se não tirou 6, passar a vez
    if (gameState.diceValue !== 6) {
      setTimeout(() => {
        nextPlayer();
      }, 1000);
    } else {
      setGameState(prev => ({ ...prev, diceValue: 0 }));
    }
  };

  const renderBoard = () => {
    const boardSize = Math.min(width * 0.9, height * 0.5);
    const cellSize = boardSize / 15;

    return (
      <View style={[styles.board, { width: boardSize, height: boardSize }]}>
        {/* Tabuleiro simplificado - representação visual */}
        <View style={styles.boardGrid}>
          {/* Casas centrais */}
          <View style={styles.centerCross}>
            <Text style={styles.centerText}>PACHISI</Text>
          </View>
          
          {/* Áreas de casa dos jogadores */}
          {gameState.players.map((player, index) => (
            <View
              key={player.id}
              style={[
                styles.homeArea,
                {
                  backgroundColor: player.color + '40',
                  top: index < 2 ? '10%' : '70%',
                  left: index % 2 === 0 ? '10%' : '70%',
                },
              ]}
            >
              <Text style={styles.homeLabel}>{player.name}</Text>
              <View style={styles.homePieces}>
                {player.pieces.map((piece, pieceIndex) => (
                  <TouchableOpacity
                    key={pieceIndex}
                    style={[
                      styles.piece,
                      {
                        backgroundColor: player.color,
                        opacity: piece.isHome ? 1 : 0.3,
                      },
                    ]}
                    onPress={() => movePiece(player.id, piece.id)}
                    disabled={
                      gameState.currentPlayer !== player.id ||
                      gameState.diceValue === 0
                    }
                  >
                    <Text style={styles.pieceText}>{pieceIndex + 1}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const resetGame = () => {
    setGameState({
      currentPlayer: 0,
      players: gameState.players.map(player => ({
        ...player,
        pieces: player.pieces.map(piece => ({
          ...piece,
          position: -1,
          isHome: true,
          isSafe: false,
        })),
      })),
      diceValue: 0,
      gamePhase: 'setup',
      winner: null,
    });
    setSelectedPiece(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pachisi - Jogo Real da Índia</Text>
        <Text style={styles.subtitle}>
          Jogo tradicional indiano que inspirou o Ludo moderno
        </Text>
      </View>

      {gameState.gamePhase === 'finished' && gameState.winner !== null && (
        <View style={styles.winnerBanner}>
          <Text style={styles.winnerText}>
            🏆 {gameState.players[gameState.winner].name} Venceu! 🏆
          </Text>
        </View>
      )}

      <View style={styles.gameInfo}>
        <Text style={styles.currentPlayerText}>
          Jogador Atual: {gameState.players[gameState.currentPlayer].name}
        </Text>
        <View style={styles.diceContainer}>
          <Text style={styles.diceLabel}>Dado:</Text>
          <View style={styles.dice}>
            <Text style={styles.diceValue}>
              {gameState.diceValue || '?'}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.rollButton,
              gameState.diceValue > 0 && styles.rollButtonDisabled,
            ]}
            onPress={rollDice}
            disabled={gameState.diceValue > 0}
          >
            <Text style={styles.rollButtonText}>
              {gameState.gamePhase === 'setup' ? 'Iniciar' : 'Rolar Dado'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderBoard()}

      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>Como Jogar:</Text>
        <Text style={styles.instructionsText}>
          • Role o dado para mover suas peças{'\n'}
          • Tire 6 para sair de casa{'\n'}
          • Capture peças inimigas fora das casas seguras{'\n'}
          • Leve todas as peças até o final para vencer
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Text style={styles.resetButtonText}>Novo Jogo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C1810',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#8B4513',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#DDD',
    textAlign: 'center',
    marginTop: 5,
  },
  winnerBanner: {
    backgroundColor: '#FFD700',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  winnerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  gameInfo: {
    padding: 15,
    backgroundColor: '#3D2817',
    margin: 10,
    borderRadius: 10,
  },
  currentPlayerText: {
    fontSize: 18,
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 10,
  },
  diceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceLabel: {
    fontSize: 16,
    color: '#DDD',
    marginRight: 10,
  },
  dice: {
    width: 50,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#8B4513',
  },
  diceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  rollButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  rollButtonDisabled: {
    backgroundColor: '#666',
  },
  rollButtonText: {
    color: '#8B4513',
    fontWeight: 'bold',
  },
  board: {
    alignSelf: 'center',
    margin: 20,
    backgroundColor: '#8B4513',
    borderRadius: 15,
    padding: 10,
  },
  boardGrid: {
    flex: 1,
    position: 'relative',
  },
  centerCross: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    width: '20%',
    height: '20%',
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  centerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  homeArea: {
    position: 'absolute',
    width: '20%',
    height: '20%',
    borderRadius: 10,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  homePieces: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  piece: {
    width: 20,
    height: 20,
    borderRadius: 10,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  pieceText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFF',
  },
  instructions: {
    padding: 15,
    backgroundColor: '#3D2817',
    margin: 10,
    borderRadius: 10,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 14,
    color: '#DDD',
    lineHeight: 20,
  },
  controls: {
    padding: 20,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PachisiGameScreen;

