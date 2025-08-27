import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LobbyScreen = () => {
  const navigation = useNavigation();

  const games = [
    { name: 'Senet', screen: 'SenetGame', origin: 'Egito Antigo', color: '#FFD700' },
    { name: 'Go', screen: 'GoGame', origin: 'China', color: '#FF6B6B' },
    { name: 'Mancala', screen: 'MancalaGame', origin: 'África', color: '#8B4513' },
    { name: 'Chaturanga', screen: 'ChaturangaGame', origin: 'Índia', color: '#FF8C00' },
    { name: 'Patolli', screen: 'PatolliGame', origin: 'Asteca', color: '#DC143C' },
    { name: 'Hanafuda', screen: 'HanafudaGame', origin: 'Japão', color: '#FF69B4' },
    { name: 'Nine Men\'s Morris', screen: 'NineMensMorrisGame', origin: 'Medieval', color: '#4682B4' },
    { name: 'Hnefatafl', screen: 'HnefataflGame', origin: 'Viking', color: '#2F4F4F' },
    { name: 'Pachisi', screen: 'PachisiGame', origin: 'Índia', color: '#DAA520' },
  ];

  return (
    <ImageBackground 
      source={require("../assets/background.jpg")} 
      style={styles.background}
    >
      <ScrollView style={styles.container}>
        <View style={styles.overlay}>
          <Text style={styles.title}>The Odyssey of Games</Text>
          <Text style={styles.subtitle}>Sua jornada pelos jogos clássicos da humanidade</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎮 Modos de Jogo</Text>
            
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Modo Aventura</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Torneios</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Perfil</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏛️ Jogos Clássicos</Text>
            
            {games.map((game, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.gameButton, { borderLeftColor: game.color }]}
                onPress={() => navigation.navigate(game.screen)}
              >
                <View style={styles.gameInfo}>
                  <Text style={styles.gameTitle}>{game.name}</Text>
                  <Text style={styles.gameOrigin}>{game.origin}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0066CC',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameOrigin: {
    color: '#CCCCCC',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default LobbyScreen;


