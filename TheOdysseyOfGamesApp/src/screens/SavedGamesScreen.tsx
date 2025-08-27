import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GameService, { GameSave } from '../services/GameService';

const SavedGamesScreen: React.FC = () => {
  const [savedGames, setSavedGames] = useState<GameSave[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const navigation = useNavigation();
  const gameService = GameService.getInstance();

  useEffect(() => {
    loadSavedGames();
  }, []);

  const loadSavedGames = async () => {
    try {
      setLoading(true);
      const games = await gameService.getSavedGames();
      // Ordenar por timestamp (mais recente primeiro)
      const sortedGames = games.sort((a, b) => b.timestamp - a.timestamp);
      setSavedGames(sortedGames);
    } catch (error) {
      console.error('Erro ao carregar jogos salvos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os jogos salvos.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSavedGames();
    setRefreshing(false);
  };

  const loadGame = async (gameSave: GameSave) => {
    try {
      // Navegar para a tela do jogo correspondente
      const gameScreenMap: { [key: string]: string } = {
        'Senet': 'SenetGame',
        'Go': 'GoGame',
        'Mancala': 'MancalaGame',
        'Chaturanga': 'ChaturangaGame',
        'Patolli': 'PatolliGame',
        'Hanafuda': 'HanafudaGame',
        'Nine Men\'s Morris': 'NineMensMorrisGame',
        'Hnefatafl': 'HnefataflGame',
        'Pachisi': 'PachisiGame',
      };

      const screenName = gameScreenMap[gameSave.gameName];
      if (screenName) {
        navigation.navigate(screenName, { 
          loadGameId: gameSave.id,
          gameState: gameSave.gameState 
        });
      } else {
        Alert.alert('Erro', 'Jogo não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao carregar jogo:', error);
      Alert.alert('Erro', 'Não foi possível carregar o jogo.');
    }
  };

  const deleteGame = (gameSave: GameSave) => {
    Alert.alert(
      'Excluir Jogo Salvo',
      `Tem certeza que deseja excluir o jogo salvo "${gameSave.gameName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await gameService.deleteSavedGame(gameSave.id);
              await loadSavedGames();
              Alert.alert('Sucesso', 'Jogo salvo excluído com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o jogo salvo.');
            }
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getGameIcon = (gameName: string): string => {
    const icons: { [key: string]: string } = {
      'Senet': '🏺',
      'Go': '⚫',
      'Mancala': '🌰',
      'Chaturanga': '♛',
      'Patolli': '🎲',
      'Hanafuda': '🌸',
      'Nine Men\'s Morris': '⚪',
      'Hnefatafl': '⚔️',
      'Pachisi': '🎯',
    };
    return icons[gameName] || '🎮';
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 80) return '#4CAF50'; // Verde
    if (progress >= 50) return '#FF9800'; // Laranja
    if (progress >= 20) return '#2196F3'; // Azul
    return '#9E9E9E'; // Cinza
  };

  const renderSavedGame = (gameSave: GameSave) => (
    <View key={gameSave.id} style={styles.gameCard}>
      <TouchableOpacity
        style={styles.gameContent}
        onPress={() => loadGame(gameSave)}
      >
        <View style={styles.gameHeader}>
          <View style={styles.gameInfo}>
            <Text style={styles.gameIcon}>{getGameIcon(gameSave.gameName)}</Text>
            <View style={styles.gameDetails}>
              <Text style={styles.gameName}>{gameSave.gameName}</Text>
              <Text style={styles.playerName}>Por: {gameSave.playerName}</Text>
            </View>
          </View>
          <View style={styles.gameStats}>
            <Text style={styles.gameDate}>{formatDate(gameSave.timestamp)}</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${gameSave.progress}%`,
                      backgroundColor: getProgressColor(gameSave.progress),
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{gameSave.progress}%</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteGame(gameSave)}
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  const groupGamesByName = (games: GameSave[]) => {
    const grouped: { [key: string]: GameSave[] } = {};
    games.forEach(game => {
      if (!grouped[game.gameName]) {
        grouped[game.gameName] = [];
      }
      grouped[game.gameName].push(game);
    });
    return grouped;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando jogos salvos...</Text>
      </View>
    );
  }

  const groupedGames = groupGamesByName(savedGames);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💾 Jogos Salvos</Text>
        <Text style={styles.subtitle}>
          {savedGames.length} {savedGames.length === 1 ? 'jogo salvo' : 'jogos salvos'}
        </Text>
      </View>

      {savedGames.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎮</Text>
          <Text style={styles.emptyTitle}>Nenhum jogo salvo</Text>
          <Text style={styles.emptyText}>
            Seus jogos salvos aparecerão aqui.{'\n'}
            Comece jogando e salve seu progresso!
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Voltar ao Lobby</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.gamesList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFD700"
              colors={['#FFD700']}
            />
          }
        >
          {Object.keys(groupedGames).length > 0 ? (
            Object.entries(groupedGames).map(([gameName, games]) => (
              <View key={gameName} style={styles.gameGroup}>
                <Text style={styles.groupTitle}>
                  {getGameIcon(gameName)} {gameName} ({games.length})
                </Text>
                {games.map(renderSavedGame)}
              </View>
            ))
          ) : (
            savedGames.map(renderSavedGame)
          )}
          
          <View style={styles.bottomPadding} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
  },
  loadingText: {
    color: '#FFD700',
    fontSize: 18,
  },
  header: {
    backgroundColor: '#16213E',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCC',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#CCC',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#1A1A2E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gamesList: {
    flex: 1,
    padding: 15,
  },
  gameGroup: {
    marginBottom: 25,
  },
  groupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  gameCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  gameContent: {
    flex: 1,
    padding: 15,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  gameIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  gameDetails: {
    flex: 1,
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 2,
  },
  playerName: {
    fontSize: 14,
    color: '#CCC',
  },
  gameStats: {
    alignItems: 'flex-end',
  },
  gameDate: {
    fontSize: 12,
    color: '#CCC',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    width: 60,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold',
    minWidth: 35,
    textAlign: 'right',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  bottomPadding: {
    height: 20,
  },
});

export default SavedGamesScreen;

