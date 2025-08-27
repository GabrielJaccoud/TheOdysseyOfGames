import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  TextInput,
  Modal,
} from 'react-native';
import GameService, { PlayerProfile } from '../services/GameService';

const ProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');

  const gameService = GameService.getInstance();

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const playerProfile = await gameService.loadPlayerProfile();
      const playerAnalytics = await gameService.getPlayerAnalytics();
      
      setProfile(playerProfile);
      setAnalytics(playerAnalytics);
      setNewPlayerName(playerProfile.name);
    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
    } finally {
      setLoading(false);
    }
  };

  const updatePlayerName = async () => {
    if (!profile || !newPlayerName.trim()) return;

    try {
      profile.name = newPlayerName.trim();
      await gameService.savePlayerProfile();
      setEditModalVisible(false);
      Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o nome.');
    }
  };

  const togglePreference = async (key: keyof typeof profile.preferences, value: any) => {
    if (!profile) return;

    try {
      profile.preferences[key] = value;
      await gameService.savePlayerProfile();
      setProfile({ ...profile });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as preferências.');
    }
  };

  const resetProgress = () => {
    Alert.alert(
      'Resetar Progresso',
      'Tem certeza que deseja resetar todo o seu progresso? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar',
          style: 'destructive',
          onPress: async () => {
            try {
              // Criar novo perfil
              const newProfile: PlayerProfile = {
                name: profile?.name || 'Aventureiro',
                level: 1,
                experience: 0,
                stats: {},
                achievements: [],
                preferences: profile?.preferences || {
                  difficulty: 'medium',
                  soundEnabled: true,
                  animationsEnabled: true,
                },
              };
              
              await gameService.savePlayerProfile();
              await loadProfileData();
              Alert.alert('Sucesso', 'Progresso resetado com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível resetar o progresso.');
            }
          },
        },
      ]
    );
  };

  const getAchievementTitle = (achievement: string): string => {
    const titles: { [key: string]: string } = {
      'level_5': '🌟 Explorador - Nível 5',
      'level_10': '⭐ Aventureiro - Nível 10',
      'Senet_master': '🏺 Mestre do Senet',
      'Go_master': '⚫ Mestre do Go',
      'Mancala_master': '🌰 Mestre do Mancala',
      'Chaturanga_master': '♛ Mestre do Chaturanga',
      'Patolli_master': '🎲 Mestre do Patolli',
      'Hanafuda_master': '🌸 Mestre do Hanafuda',
      'NineMensMorris_master': '⚪ Mestre do Nine Men\'s Morris',
      'Hnefatafl_master': '⚔️ Mestre do Hnefatafl',
      'Pachisi_master': '🎯 Mestre do Pachisi',
      'collector': '🏆 Colecionador de Jogos',
    };
    return titles[achievement] || achievement;
  };

  const renderGameStats = () => {
    if (!profile || !profile.stats) return null;

    return Object.entries(profile.stats).map(([gameName, stats]) => (
      <View key={gameName} style={styles.gameStatCard}>
        <Text style={styles.gameStatTitle}>{gameName}</Text>
        <View style={styles.gameStatRow}>
          <Text style={styles.gameStatLabel}>Jogos:</Text>
          <Text style={styles.gameStatValue}>{stats.gamesPlayed}</Text>
        </View>
        <View style={styles.gameStatRow}>
          <Text style={styles.gameStatLabel}>Vitórias:</Text>
          <Text style={styles.gameStatValue}>{stats.gamesWon}</Text>
        </View>
        <View style={styles.gameStatRow}>
          <Text style={styles.gameStatLabel}>Taxa de Vitória:</Text>
          <Text style={styles.gameStatValue}>
            {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%
          </Text>
        </View>
        <View style={styles.gameStatRow}>
          <Text style={styles.gameStatLabel}>Tempo Total:</Text>
          <Text style={styles.gameStatValue}>
            {Math.round(stats.totalPlayTime / 60000)}min
          </Text>
        </View>
      </View>
    ));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  if (!profile || !analytics) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro ao carregar perfil</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProfileData}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header do Perfil */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Text style={styles.playerName}>{profile.name}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditModalVisible(true)}
          >
            <Text style={styles.editButtonText}>✏️ Editar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.levelInfo}>
          <Text style={styles.levelText}>Nível {profile.level}</Text>
          <View style={styles.experienceBar}>
            <View
              style={[
                styles.experienceProgress,
                {
                  width: `${((profile.experience % 1000) / 1000) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.experienceText}>
            {profile.experience % 1000}/1000 XP
          </Text>
        </View>
      </View>

      {/* Estatísticas Gerais */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Estatísticas Gerais</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{analytics.totalGames}</Text>
            <Text style={styles.statLabel}>Jogos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{analytics.totalWins}</Text>
            <Text style={styles.statLabel}>Vitórias</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{Math.round(analytics.winRate)}%</Text>
            <Text style={styles.statLabel}>Taxa de Vitória</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{analytics.totalPlayTime}min</Text>
            <Text style={styles.statLabel}>Tempo Total</Text>
          </View>
        </View>
        <View style={styles.favoriteGame}>
          <Text style={styles.favoriteGameLabel}>Jogo Favorito:</Text>
          <Text style={styles.favoriteGameValue}>{analytics.favoriteGame}</Text>
        </View>
      </View>

      {/* Conquistas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 Conquistas ({profile.achievements.length})</Text>
        {profile.achievements.length > 0 ? (
          <View style={styles.achievementsList}>
            {profile.achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementCard}>
                <Text style={styles.achievementText}>
                  {getAchievementTitle(achievement)}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noAchievementsText}>
            Nenhuma conquista ainda. Continue jogando para desbloquear!
          </Text>
        )}
      </View>

      {/* Estatísticas por Jogo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎮 Estatísticas por Jogo</Text>
        {Object.keys(profile.stats).length > 0 ? (
          <View style={styles.gameStatsList}>
            {renderGameStats()}
          </View>
        ) : (
          <Text style={styles.noStatsText}>
            Nenhuma estatística ainda. Comece jogando!
          </Text>
        )}
      </View>

      {/* Configurações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Configurações</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Som</Text>
          <Switch
            value={profile.preferences.soundEnabled}
            onValueChange={(value) => togglePreference('soundEnabled', value)}
            trackColor={{ false: '#767577', true: '#FFD700' }}
            thumbColor={profile.preferences.soundEnabled ? '#FFF' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Animações</Text>
          <Switch
            value={profile.preferences.animationsEnabled}
            onValueChange={(value) => togglePreference('animationsEnabled', value)}
            trackColor={{ false: '#767577', true: '#FFD700' }}
            thumbColor={profile.preferences.animationsEnabled ? '#FFF' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Dificuldade da IA</Text>
          <Text style={styles.settingValue}>
            {profile.preferences.difficulty === 'easy' ? 'Fácil' :
             profile.preferences.difficulty === 'medium' ? 'Médio' : 'Difícil'}
          </Text>
        </View>
      </View>

      {/* Ações */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.resetButton} onPress={resetProgress}>
          <Text style={styles.resetButtonText}>🔄 Resetar Progresso</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Edição */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Nome</Text>
            <TextInput
              style={styles.nameInput}
              value={newPlayerName}
              onChangeText={setNewPlayerName}
              placeholder="Digite seu nome"
              maxLength={20}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={updatePlayerName}
              >
                <Text style={styles.modalSaveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    padding: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#1A1A2E',
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#16213E',
    padding: 20,
    paddingTop: 50,
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  playerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  editButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#FFD700',
    fontSize: 14,
  },
  levelInfo: {
    alignItems: 'center',
  },
  levelText: {
    fontSize: 20,
    color: '#FFF',
    marginBottom: 10,
  },
  experienceBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 5,
  },
  experienceProgress: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  experienceText: {
    color: '#CCC',
    fontSize: 12,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  statLabel: {
    fontSize: 12,
    color: '#CCC',
    marginTop: 5,
  },
  favoriteGame: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    padding: 15,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 10,
  },
  favoriteGameLabel: {
    color: '#FFF',
    fontSize: 16,
  },
  favoriteGameValue: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementsList: {
    gap: 10,
  },
  achievementCard: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  achievementText: {
    color: '#FFF',
    fontSize: 16,
  },
  noAchievementsText: {
    color: '#CCC',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  gameStatsList: {
    gap: 15,
  },
  gameStatCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 15,
    borderRadius: 10,
  },
  gameStatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  gameStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  gameStatLabel: {
    color: '#CCC',
    fontSize: 14,
  },
  gameStatValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noStatsText: {
    color: '#CCC',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingLabel: {
    color: '#FFF',
    fontSize: 16,
  },
  settingValue: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#16213E',
    padding: 20,
    borderRadius: 15,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
  },
  nameInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFF',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    backgroundColor: '#666',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  modalCancelText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalSaveButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  modalSaveText: {
    color: '#1A1A2E',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;

