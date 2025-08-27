import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

const HANAFUDA_CARDS = [
  { month: 'Janeiro', suit: 'Pinheiro', value: 'Poesia' },
  { month: 'Janeiro', suit: 'Pinheiro', value: 'Faixa' },
  { month: 'Janeiro', suit: 'Pinheiro', value: 'Simples' },
  { month: 'Janeiro', suit: 'Pinheiro', value: 'Simples' },
  { month: 'Fevereiro', suit: 'Ameixa', value: 'Rouxinol' },
  { month: 'Fevereiro', suit: 'Ameixa', value: 'Faixa' },
  { month: 'Fevereiro', suit: 'Ameixa', value: 'Simples' },
  { month: 'Fevereiro', suit: 'Ameixa', value: 'Simples' },
  // ... add all 48 Hanafuda cards
];

function HanafudaGameScreen() {
  const [deck, setDeck] = useState(HANAFUDA_CARDS);
  const [playerHand, setPlayerHand] = useState([]);
  const [table, setTable] = useState([]);
  const [score, setScore] = useState(0);

  const dealCards = () => {
    // Simplified dealing for demonstration
    const newDeck = [...HANAFUDA_CARDS];
    const newPlayerHand = newDeck.splice(0, 8); // 8 cards for player
    const newTable = newDeck.splice(0, 8); // 8 cards for table
    setDeck(newDeck);
    setPlayerHand(newPlayerHand);
    setTable(newTable);
  };

  const renderCard = (card, index) => (
    <View key={index} style={styles.card}>
      <Text style={styles.cardText}>{card.month}</Text>
      <Text style={styles.cardText}>{card.suit}</Text>
    </View>
  );

  return (
    <ImageBackground source={require("../assets/background.jpg")} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Hanafuda (Japão)</Text>
        <Text style={styles.score}>Pontuação: {score}</Text>

        <TouchableOpacity style={styles.dealButton} onPress={dealCards}>
          <Text style={styles.dealButtonText}>Distribuir Cartas</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mão do Jogador:</Text>
          <View style={styles.handContainer}>
            {playerHand.map((card, index) => renderCard(card, index))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mesa:</Text>
          <View style={styles.tableContainer}>
            {table.map((card, index) => renderCard(card, index))}
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
  score: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  dealButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  dealButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  handContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: 60,
    height: 90,
    backgroundColor: '#fff',
    borderRadius: 5,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  cardText: {
    fontSize: 10,
    textAlign: 'center',
  },
});

export default HanafudaGameScreen;

