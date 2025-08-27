import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

const BOARD_POINTS = [
  [0, 0], [3, 0], [6, 0],
  [1, 1], [3, 1], [5, 1],
  [2, 2], [3, 2], [4, 2],
  [0, 3], [1, 3], [2, 3], [4, 3], [5, 3], [6, 3],
  [2, 4], [3, 4], [4, 4],
  [1, 5], [3, 5], [5, 5],
  [0, 6], [3, 6], [6, 6],
];

const INITIAL_BOARD = Array(BOARD_POINTS.length).fill(null); // null for empty, 1 for player 1, 2 for player 2

function NineMensMorrisGameScreen() {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 or 2
  const [phase, setPhase] = useState('placing'); // 'placing', 'moving', 'flying'
  const [selectedPiece, setSelectedPiece] = useState(null);

  const handlePointPress = (index) => {
    // Simplified logic for demonstration
    if (phase === 'placing') {
      if (board[index] === null) {
        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        // Add logic to check for mills and remove opponent's piece
      }
    } else if (phase === 'moving') {
      if (selectedPiece === null) {
        if (board[index] === currentPlayer) {
          setSelectedPiece(index);
        }
      } else {
        // Logic for moving selected piece to a valid adjacent empty point
        if (board[index] === null) {
          const newBoard = [...board];
          newBoard[index] = newBoard[selectedPiece];
          newBoard[selectedPiece] = null;
          setBoard(newBoard);
          setSelectedPiece(null);
          setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
          // Add logic to check for mills and remove opponent's piece
        } else {
          setSelectedPiece(null);
        }
      }
    }
  };

  const renderPoint = (point, index) => {
    const piece = board[index];
    const isSelected = selectedPiece === index;
    return (
      <TouchableOpacity
        key={index}
        style={[styles.point, { left: point[0] * 50, top: point[1] * 50 }, isSelected && styles.selectedPoint]}
        onPress={() => handlePointPress(index)}
      >
        {piece === 1 && <View style={styles.player1Piece} />}
        {piece === 2 && <View style={styles.player2Piece} />}
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={require("../assets/background.jpg")} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Nine Men's Morris (Medieval)</Text>
        <Text style={styles.playerTurn}>Turno do Jogador: {currentPlayer}</Text>
        <Text style={styles.phase}>Fase: {phase}</Text>
        <View style={styles.board}>
          {BOARD_POINTS.map((point, index) => renderPoint(point, index))}
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
  phase: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  board: {
    width: 350, // Adjust as needed
    height: 350, // Adjust as needed
    borderWidth: 2,
    borderColor: '#fff',
    position: 'relative',
  },
  point: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ccc',
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPoint: {
    borderColor: 'blue',
    borderWidth: 2,
  },
  player1Piece: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'red',
  },
  player2Piece: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'blue',
  },
});

export default NineMensMorrisGameScreen;

