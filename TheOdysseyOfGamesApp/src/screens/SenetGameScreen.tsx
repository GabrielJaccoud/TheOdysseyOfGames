import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function SenetGameScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Senet (Egito Antigo)</Text>
      <Text style={styles.text}>Lógica do jogo Senet será implementada aqui.</Text>
      {/* Implementação do tabuleiro e lógica do jogo */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
  },
});

export default SenetGameScreen;

