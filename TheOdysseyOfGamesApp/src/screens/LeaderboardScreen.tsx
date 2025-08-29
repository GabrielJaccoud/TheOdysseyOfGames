import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';

interface Player {
  rank: number;
  id: string;
  name: string;
  level: number;
  experience: number;
  rating: number;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  avatar?: string;
  currentStreak: number;
}

interface LeaderboardData {
  leaderboard: Player[];
  totalPlayers: number;
  lastUpdated: string;
}

const LeaderboardScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'global' | 'games'>('global');
  const [selectedGame, setSelectedGame] = useState<string>('Senet');
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardData | null>(null);
  const [gameLeaderboard, setGameLeaderboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const games = [
    { name: 'Senet', icon: '🏺', color: '#FFD700' },
    { name: 'Go', icon: '⚫', color: '#FF6B6B' },
    { name: 'Mancala', icon: '🌰', color: '#8B4513' },
    { name: 'Chaturanga', icon: '♛', color: '#FF8C00' },
    { name: 'Patolli', icon: '🎲', color: '#DC143C' },
    { name: 'Hanafuda', icon: '🌸', color: '#FF69B4' },
    { name: 'NineMensMorris', icon: '⚪', color: '#4682B4' },
    { name: 'Hnefatafl', icon: '⚔️', color: '#2F4F4F' },
    { name: 'Pachisi', icon: '🎯', color: '#DAA520' },
  ];

  useEffect(() => {
    loadLeaderboards();
  }, []);

  const loadLeaderboards = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadGlobalLeaderboard(),
        loadGameLeaderboard(selectedGame)
      ]);
    } catch (error) {
      console.error('Erro ao carregar leaderboards:', error);
      Alert.alert('Erro', 'Não foi possível carregar os rankings.');
    } finally {
      setLoading(false);
    }
  };

  const loadGlobalLeaderboard = async () => {
    try {
      // Simulação de dados - em produção seria uma chamada à API
      const mockData: LeaderboardData = {
        leaderboard: [
          {
            rank: 1,
            id: '1',
            name: 'Alexandre, o Grande',
            level: 25,
            experience: 15420,
            rating: 1850,
            gamesPlayed: 127,
            gamesWon: 89,
            winRate: 0.70,
            avatar: '👑',
            currentStreak: 8,
          },
          {
            rank: 2,
            id: '2',
            name: 'Cleópatra VII',
            level: 22,
            experience: 12890,
            rating: 1780,
            gamesPlayed: 98,
            gamesWon: 65,
            winRate: 0.66,
            avatar: '👸',
            currentStreak: 3,
          },
          {
            rank: 3,
            id: '3',
            name: 'Sun Tzu',
            level: 28,
            experience: 18750,
            rating: 1720,
            gamesPlayed: 156,
            gamesWon: 98,
            winRate: 0.63,
            avatar: '🥋',
            currentStreak: 12,
          },
          {
            rank: 4,
            id: '4',
            name: 'Joana d\'Arc',
            level: 20,
            experience: 11200,
            rating: 1680,
            gamesPlayed: 87,
            gamesWon: 52,
            winRate: 0.60,
            avatar: '⚔️',
            currentStreak: 0,
          },
          {
            rank: 5,
            id: '5',
            name: 'Leonardo da Vinci',
            level: 30,
            experience: 22100,
            rating: 1650,
            gamesPlayed: 203,
            gamesWon: 115,
            winRate: 0.57,
            avatar: '🎨',
            currentStreak: 5,
          },
        ],
        totalPlayers: 1247,
        lastUpdated: new Date().toISOString(),
      };

      setGlobalLeaderboard(mockData);
    } catch (error) {
      console.error('Erro ao carregar ranking global:', error);
    }
  };

  const loadGameLeaderboard = async (gameName: string) => {
    try {
      // Simulação de dados - em produção seria uma chamada à API
      const mockData = {
        game: gameName,
        leaderboard: [
          {
            rank: 1,
            playerId: '3',
            playerName: 'Sun Tzu',
            rating: 1920,
            gamesPlayed: 45,
            winRate: 0.82,
          },
          {
            rank: 2,
            playerId: '1',
            playerName: 'Alexandre, o Grande',
            rating: 1875,
            gamesPlayed: 38,
            winRate: 0.79,
          },
          {
            rank: 3,
            playerId: '2',
            playerName: 'Cleópatra VII',
            rating: 1820,
            gamesPlayed: 32,
            winRate: 0.75,
          },
        ],
        totalPlayers: 456,
        totalGames: 2847,
        averageGameTime: 15,
        lastUpdated: new Date().toISOString(),
      };

      setGameLeaderboard(mockData);
    } catch (error) {
      console.error('Erro ao carregar ranking do jogo:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboards();
    setRefreshing(false);
  };

  const handleGameSelect = async (gameName: string) => {
    setSelectedGame(gameName);
    setLoading(true);
    await loadGameLeaderboard(gameName);
    setLoading(false);
  };

  const getRankColor = (rank: number): string => {
    if (rank === 1) return '#FFD700'; // Ouro
    if (rank === 2) return '#C0C0C0'; // Prata
    if (rank === 3) return '#CD7F32'; // Bronze
    return '#666';
  };

  const getRankIcon = (rank: number): string => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}º`;
  };

  const renderPlayerCard = (player: Player, showAvatar = true) => (
    <View key={player.id} style={styles.playerCard}>
      <View style={styles.rankSection}>
        <Text style={[styles.rankText, { color: getRankColor(player.rank) }]}>
          {getRankIcon(player.rank)}
        </Text>
      </View>

      <View style={styles.playerInfo}>
        {showAvatar && (
          <Text style={styles.playerAvatar}>{player.avatar || '👤'}</Text>
        )}
        <View style={styles.playerDetails}>
          <Text style={styles.playerName}>{player.name}</Text>
          <View style={styles.playerStats}>
            <Text style={styles.statText}>Nível {player.level}</Text>
            <Text style={styles.statSeparator}>•</Text>
            <Text style={styles.statText}>Rating: {player.rating}</Text>
          </View>
        </View>
      </View>

      <View style={styles.performanceSection}>
        <Text style={styles.winRateText}>
          {Math.round(player.winRate * 100)}%
        </Text>
        <Text style={styles.gamesText}>
          {player.gamesWon}/{player.gamesPlayed}
        </Text>
        {player.currentStreak > 0 && (
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥{player.currentStreak}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderGameLeaderboardItem = (item: any, index: number) => (
    <View key={item.playerId} style={styles.gamePlayerCard}>
      <View style={styles.rankSection}>
        <Text style={[styles.rankText, { color: getRankColor(item.rank) }]}>
          {getRankIcon(item.rank)}
        </Text>
      </View>

      <View style={styles.playerInfo}>
        <View style={styles.playerDetails}>
          <Text style={styles.playerName}>{item.playerName}</Text>
          <Text style={styles.ratingText}>Rating: {item.rating}</Text>
        </View>
      </View>

      <View style={styles.performanceSection}>
        <Text style={styles.winRateText}>
          {Math.round(item.winRate * 100)}%
        </Text>
        <Text style={styles.gamesText}>
          {item.gamesPlayed} jogos
        </Text>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Carregando rankings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Leaderboard</Text>
        <Text style={styles.subtitle}>
          {activeTab === 'global' 
            ? `${globalLeaderboard?.totalPlayers || 0} jogadores` 
            : `${gameLeaderboard?.totalPlayers || 0} jogadores`}
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'global' && styles.activeTab]}
          onPress={() => setActiveTab('global')}
        >
          <Text style={[styles.tabText, activeTab === 'global' && styles.activeTabText]}>
            🌍 Global
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'games' && styles.activeTab]}
          onPress={() => setActiveTab('games')}
        >
          <Text style={[styles.tabText, activeTab === 'games' && styles.activeTabText]}>
            🎮 Por Jogo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Game Selector (apenas para tab de jogos) */}
      {activeTab === 'games' && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.gameSelector}
          contentContainerStyle={styles.gameSelectorContent}
        >
          {games.map((game) => (
            <TouchableOpacity
              key={game.name}
              style={[
                styles.gameButton,
                selectedGame === game.name && styles.selectedGameButton,
                { borderColor: game.color }
              ]}
              onPress={() => handleGameSelect(game.name)}
            >
              <Text style={styles.gameIcon}>{game.icon}</Text>
              <Text style={[
                styles.gameButtonText,
                selectedGame === game.name && styles.selectedGameButtonText
              ]}>
                {game.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Leaderboard Content */}
      <ScrollView
        style={styles.leaderboardContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFD700"
            colors={['#FFD700']}
          />
        }
      >
        {activeTab === 'global' && globalLeaderboard && (
          <View style={styles.leaderboardContent}>
            <Text style={styles.sectionTitle}>🌟 Top Jogadores</Text>
            {globalLeaderboard.leaderboard.map(player => renderPlayerCard(player))}
          </View>
        )}

        {activeTab === 'games' && gameLeaderboard && (
          <View style={styles.leaderboardContent}>
            <View style={styles.gameStatsHeader}>
              <Text style={styles.sectionTitle}>
                {games.find(g => g.name === selectedGame)?.icon} {selectedGame}
              </Text>
              <View style={styles.gameStatsRow}>
                <View style={styles.gameStat}>
                  <Text style={styles.gameStatValue}>{gameLeaderboard.totalGames}</Text>
                  <Text style={styles.gameStatLabel}>Partidas</Text>
                </View>
                <View style={styles.gameStat}>
                  <Text style={styles.gameStatValue}>{gameLeaderboard.averageGameTime}min</Text>
                  <Text style={styles.gameStatLabel}>Tempo Médio</Text>
                </View>
                <View style={styles.gameStat}>
                  <Text style={styles.gameStatValue}>{gameLeaderboard.totalPlayers}</Text>
                  <Text style={styles.gameStatLabel}>Jogadores</Text>
                </View>
              </View>
            </View>
            {gameLeaderboard.leaderboard.map(renderGameLeaderboardItem)}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
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
    fontSize: 16,
    marginTop: 10,
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#16213E',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FFD700',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CCC',
  },
  activeTabText: {
    color: '#1A1A2E',
  },
  gameSelector: {
    backgroundColor: '#16213E',
    paddingBottom: 15,
  },
  gameSelectorContent: {
    paddingHorizontal: 20,
  },
  gameButton: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    minWidth: 80,
  },
  selectedGameButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  gameIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  gameButtonText: {
    fontSize: 12,
    color: '#CCC',
    textAlign: 'center',
  },
  selectedGameButtonText: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  leaderboardContainer: {
    flex: 1,
  },
  leaderboardContent: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
    textAlign: 'center',
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  gamePlayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  rankSection: {
    width: 50,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  playerAvatar: {
    fontSize: 24,
    marginRight: 10,
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 2,
  },
  playerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#CCC',
  },
  statSeparator: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 5,
  },
  ratingText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  performanceSection: {
    alignItems: 'flex-end',
  },
  winRateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  gamesText: {
    fontSize: 12,
    color: '#CCC',
    marginTop: 2,
  },
  streakBadge: {
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  streakText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: 'bold',
  },
  gameStatsHeader: {
    marginBottom: 20,
  },
  gameStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  gameStat: {
    alignItems: 'center',
  },
  gameStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  gameStatLabel: {
    fontSize: 12,
    color: '#CCC',
    marginTop: 2,
  },
  bottomPadding: {
    height: 20,
  },
});

export default LeaderboardScreen;

