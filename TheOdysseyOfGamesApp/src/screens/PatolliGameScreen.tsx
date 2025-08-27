import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

const BOARD_SIZE = 52; // Patolli board has 52 squares
const INITIAL_BOARD = Array(BOARD_SIZE).fill(null); // null for empty, 1 for player 1, 2 for player 2

function PatolliGameScreen() {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 or 2
  const [diceRoll, setDiceRoll] = useState(0);

  const rollDice = () => {
    // Patolli uses 5 beans with one side marked
    let roll = 0;
    for (let i = 0; i < 5; i++) {
      if (Math.random() > 0.5) {
        roll++;
      }
    }
    setDiceRoll(roll);
    // In a real game, this would trigger piece movement
  };

  const renderSquare = (index) => {
    const piece = board[index];
    return (
      <View key={index} style={styles.square}>
        <Text style={styles.pieceText}>{piece ? `P${piece}` : ''}</Text>
      </View>
    );
  };

  return (
    <ImageBackground source={require("../assets/background.jpg")} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Patolli (Asteca)</Text>
        <Text style={styles.playerTurn}>Turno do Jogador: {currentPlayer}</Text>
        <View style={styles.board}>
          {board.map((_, index) => renderSquare(index))}
        </View>
        <TouchableOpacity style={styles.rollButton} onPress={rollDice}>
          <Text style={styles.rollButtonText}>Rolar Dados ({diceRoll})</Text>
        </TouchableOpacity>
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
    width: 300, // Example width, adjust as needed
    height: 300, // Example height, adjust as needed
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 2,
    borderColor: '#A0522D', // Brown for wood
    backgroundColor: '#D2B48C', // Light brown
  },
  square: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  rollButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  rollButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PatolliGameScreen;

