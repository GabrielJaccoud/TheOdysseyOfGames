import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

const BOARD_SIZE = 8; // 8x8 board
const INITIAL_BOARD = Array(BOARD_SIZE * BOARD_SIZE).fill(null); // null for empty, 'P' for pawn, 'R' for rook, etc.

// Simplified initial setup (not accurate to Chaturanga, just for demonstration)
INITIAL_BOARD[0] = 'R1'; INITIAL_BOARD[1] = 'K1'; INITIAL_BOARD[2] = 'B1'; INITIAL_BOARD[3] = 'Q1';
INITIAL_BOARD[4] = 'K2'; INITIAL_BOARD[5] = 'B2'; INITIAL_BOARD[6] = 'R2'; INITIAL_BOARD[7] = 'R1';
for (let i = 8; i < 16; i++) INITIAL_BOARD[i] = 'P1';
for (let i = 48; i < 56; i++) INITIAL_BOARD[i] = 'P2';
INITIAL_BOARD[56] = 'R2'; INITIAL_BOARD[57] = 'K2'; INITIAL_BOARD[58] = 'B2'; INITIAL_BOARD[59] = 'Q2';
INITIAL_BOARD[60] = 'K1'; INITIAL_BOARD[61] = 'B1'; INITIAL_BOARD[62] = 'R1'; INITIAL_BOARD[63] = 'R2';

function ChaturangaGameScreen() {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const handleSquarePress = (index) => {
    if (selectedPiece === null) {
      if (board[index] !== null) {
        setSelectedPiece(index);
      }
    } else {
      // Simplified move logic (no validation)
      const newBoard = [...board];
      newBoard[index] = newBoard[selectedPiece];
      newBoard[selectedPiece] = null;
      setBoard(newBoard);
      setSelectedPiece(null);
    }
  };

  const renderSquare = (index) => {
    const piece = board[index];
    const isSelected = selectedPiece === index;
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;
    const backgroundColor = (row + col) % 2 === 0 ? '#f0d9b5' : '#b58863'; // Chessboard colors

    return (
      <TouchableOpacity
        key={index}
        style={[styles.square, { backgroundColor }, isSelected && styles.selectedSquare]}
        onPress={() => handleSquarePress(index)}
      >
        <Text style={styles.pieceText}>{piece}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={require("../assets/background.jpg")} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Chaturanga (Índia)</Text>
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
  board: {
    width: 320, // 8 * 40px
    height: 320, // 8 * 40px
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 2,
    borderColor: '#333',
  },
  square: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSquare: {
    borderWidth: 2,
    borderColor: 'blue',
  },
  pieceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ChaturangaGameScreen;

