import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

const BOARD_SIZE = 9; // For a 9x9 Go board
const INITIAL_BOARD = Array(BOARD_SIZE * BOARD_SIZE).fill(null); // null for empty, 1 for black, 2 for white

function GoGameScreen() {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 for black, 2 for white

  const handlePlaceStone = (index) => {
    if (board[index] === null) {
      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1); // Switch player
    }
  };

  const renderIntersection = (index) => {
    const stone = board[index];
    return (
      <TouchableOpacity
        key={index}
        style={styles.intersection}
        onPress={() => handlePlaceStone(index)}
      >
        {stone === 1 && <View style={styles.blackStone} />}
        {stone === 2 && <View style={styles.whiteStone} />}
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={require("../assets/background.jpg")} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Go (Ásia)</Text>
        <Text style={styles.playerTurn}>Turno do Jogador: {currentPlayer === 1 ? 'Preto' : 'Branco'}</Text>
        <View style={styles.board}>
          {board.map((_, index) => renderIntersection(index))}
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
    width: 360, // 9 * 40px
    height: 360, // 9 * 40px
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 2,
    borderColor: '#8B4513', // Brown for wood board
    backgroundColor: '#D2B48C', // Light brown
  },
  intersection: {
    width: 40,
    height: 40,
    borderWidth: 0.5,
    borderColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blackStone: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#000',
  },
  whiteStone: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
});

export default GoGameScreen;

