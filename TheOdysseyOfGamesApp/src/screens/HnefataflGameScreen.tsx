import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

const BOARD_SIZE = 11; // Common Hnefatafl board size (11x11)
const INITIAL_BOARD = Array(BOARD_SIZE * BOARD_SIZE).fill(null); // null for empty, 1 for attacker, 2 for defender, 3 for king

// Simplified initial setup (not accurate to Hnefatafl, just for demonstration)
// King in the center
INITIAL_BOARD[Math.floor(BOARD_SIZE * BOARD_SIZE / 2)] = 3;

function HnefataflGameScreen() {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 for attackers, 2 for defenders
  const [selectedPiece, setSelectedPiece] = useState(null);

  const handleSquarePress = (index) => {
    if (selectedPiece === null) {
      // Select a piece
      if (board[index] !== null && ((currentPlayer === 1 && board[index] === 1) || (currentPlayer === 2 && (board[index] === 2 || board[index] === 3)))) {
        setSelectedPiece(index);
      }
    } else {
      // Move the selected piece
      // Simplified move logic (no validation for legal moves)
      if (board[index] === null) {
        const newBoard = [...board];
        newBoard[index] = newBoard[selectedPiece];
        newBoard[selectedPiece] = null;
        setBoard(newBoard);
        setSelectedPiece(null);
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1); // Switch player
        // Add logic for capturing pieces
      } else {
        setSelectedPiece(null); // Deselect if invalid move
      }
    }
  };

  const renderSquare = (index) => {
    const piece = board[index];
    const isSelected = selectedPiece === index;
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;
    const backgroundColor = (row + col) % 2 === 0 ? '#D2B48C' : '#8B4513'; // Wood colors

    return (
      <TouchableOpacity
        key={index}
        style={[styles.square, { backgroundColor }, isSelected && styles.selectedSquare]}
        onPress={() => handleSquarePress(index)}
      >
        <Text style={styles.pieceText}>
          {piece === 1 ? 'A' : piece === 2 ? 'D' : piece === 3 ? 'K' : ''}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={require("../assets/background.jpg")} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Hnefatafl (Viking)</Text>
        <Text style={styles.playerTurn}>Turno do Jogador: {currentPlayer === 1 ? 'Atacantes' : 'Defensores'}</Text>
        <View style={styles.board}>
          {board.map((_, index) => renderSquare(index))}
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
  board: {
    width: 330, // 11 * 30px
    height: 330, // 11 * 30px
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 2,
    borderColor: '#333',
  },
  square: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#5A2D0C',
  },
  selectedSquare: {
    borderWidth: 2,
    borderColor: 'blue',
  },
  pieceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default HnefataflGameScreen;

