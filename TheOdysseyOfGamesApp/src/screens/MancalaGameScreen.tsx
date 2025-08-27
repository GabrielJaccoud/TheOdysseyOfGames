import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

const PITS_PER_PLAYER = 6;
const TOTAL_PITS = PITS_PER_PLAYER * 2 + 2; // 6 pits per player + 2 stores
const INITIAL_SEEDS = 4; // 4 seeds per pit

const createInitialBoard = () => {
  const board = Array(TOTAL_PITS).fill(0);
  for (let i = 0; i < PITS_PER_PLAYER; i++) {
    board[i] = INITIAL_SEEDS; // Player 1's pits
    board[i + PITS_PER_PLAYER + 1] = INITIAL_SEEDS; // Player 2's pits
  }
  return board;
};

function MancalaGameScreen() {
  const [board, setBoard] = useState(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 or 2

  const handlePitPress = (pitIndex) => {
    // Simplified logic for demonstration
    // In a real game, this would involve complex rules for sowing, capturing, etc.
    if (board[pitIndex] > 0) {
      const newBoard = [...board];
      let seedsToSow = newBoard[pitIndex];
      newBoard[pitIndex] = 0;

      let currentPit = pitIndex;
      while (seedsToSow > 0) {
        currentPit = (currentPit + 1) % TOTAL_PITS;
        newBoard[currentPit]++;
        seedsToSow--;
      }
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1); // Simple turn switch
    }
  };

  const renderPit = (pitIndex) => {
    const isStore = pitIndex === PITS_PER_PLAYER || pitIndex === TOTAL_PITS - 1;
    const pitStyle = isStore ? styles.store : styles.pit;
    const isPlayer1Pit = pitIndex >= 0 && pitIndex < PITS_PER_PLAYER;
    const isPlayer2Pit = pitIndex > PITS_PER_PLAYER && pitIndex < TOTAL_PITS - 1;

    return (
      <TouchableOpacity
        key={pitIndex}
        style={pitStyle}
        onPress={() => handlePitPress(pitIndex)}
        disabled={isStore || (currentPlayer === 1 && !isPlayer1Pit) || (currentPlayer === 2 && !isPlayer2Pit)}
      >
        <Text style={styles.pitText}>{board[pitIndex]}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={require("../assets/background.jpg")} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Mancala (África)</Text>
        <Text style={styles.playerTurn}>Turno do Jogador: {currentPlayer}</Text>
        <View style={styles.boardContainer}>
          {/* Player 2's pits (reversed for display) */}
          <View style={styles.playerPitsRow}>
            {Array.from({ length: PITS_PER_PLAYER }).map((_, i) => renderPit(TOTAL_PITS - 2 - i))}
          </View>

          <View style={styles.storesRow}>
            {renderPit(TOTAL_PITS - 1)} {/* Player 2's store */}
            {renderPit(PITS_PER_PLAYER)} {/* Player 1's store */}
          </View>

          {/* Player 1's pits */}
          <View style={styles.playerPitsRow}>
            {Array.from({ length: PITS_PER_PLAYER }).map((_, i) => renderPit(i))}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  playerTurn: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  boardContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#8B4513', // Wood color
    padding: 10,
    borderRadius: 10,
  },
  playerPitsRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  pit: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D2B48C',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5A2D0C',
  },
  store: {
    width: 80,
    height: 120,
    borderRadius: 40,
    backgroundColor: '#D2B48C',
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5A2D0C',
  },
  pitText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  storesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
});

export default MancalaGameScreen;

