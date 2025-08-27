import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

const BOARD_SIZE = 30; // 3 linhas x 10 colunas
const INITIAL_BOARD = Array(BOARD_SIZE).fill(null); // null para vazio, 1 para peça do jogador 1, 2 para peça do jogador 2

// Posições iniciais das peças (exemplo simplificado)
INITIAL_BOARD[0] = 1; INITIAL_BOARD[1] = 2; INITIAL_BOARD[2] = 1; INITIAL_BOARD[3] = 2; INITIAL_BOARD[4] = 1;
INITIAL_BOARD[5] = 2; INITIAL_BOARD[6] = 1; INITIAL_BOARD[7] = 2; INITIAL_BOARD[8] = 1; INITIAL_BOARD[9] = 2;

function SenetGameScreen() {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 ou 2
  const [selectedPiece, setSelectedPiece] = useState(null); // Índice da peça selecionada

  const handlePressSquare = (index) => {
    if (selectedPiece === null) {
      // Selecionar peça
      if (board[index] === currentPlayer) {
        setSelectedPiece(index);
      }
    } else {
      // Mover peça
      // Lógica de movimento simplificada (apenas para demonstração)
      if (board[index] === null) {
        const newBoard = [...board];
        newBoard[index] = newBoard[selectedPiece];
        newBoard[selectedPiece] = null;
        setBoard(newBoard);
        setSelectedPiece(null);
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1); // Troca de jogador
      } else {
        setSelectedPiece(null); // Desseleciona se o movimento for inválido
      }
    }
  };

  const renderSquare = (index) => {
    const piece = board[index];
    const isSelected = selectedPiece === index;
    return (
      <TouchableOpacity
        key={index}
        style={[styles.square, isSelected && styles.selectedSquare]}
        onPress={() => handlePressSquare(index)}
      >
        <Text style={styles.pieceText}>{piece ? `P${piece}` : ''}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={require("../assets/background.jpg")} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Senet (Egito Antigo)</Text>
        <Text style={styles.playerTurn}>Turno do Jogador: {currentPlayer}</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)', // Overlay para legibilidade
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
    width: 300, // 10 colunas * 30px
    height: 90, // 3 linhas * 30px
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 2,
    borderColor: '#fff',
  },
  square: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  selectedSquare: {
    backgroundColor: '#add8e6',
  },
  pieceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default SenetGameScreen;

