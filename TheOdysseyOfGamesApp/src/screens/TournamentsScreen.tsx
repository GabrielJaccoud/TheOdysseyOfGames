import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Tournament {
  id: string;
  name: string;
  game: string;
  type: 'elimination' | 'round_robin' | 'swiss';
  maxPlayers: number;
  currentPlayers: number;
  entryFee: number;
  prizePool: number;
  startDate: string;
  endDate: string;
  status: 'registration' | 'active' | 'completed';
  participants: any[];
  createdBy: string;
}

const TournamentsScreen: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'my' | 'completed'>('active');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newTournament, setNewTournament] = useState({
    name: '',
    game: 'Senet',
    type: 'elimination' as const,
    maxPlayers: 16,
    entryFee: 0,
    prizePool: 1000,
  });

  const navigation = useNavigation();

  const games = [
    { name: 'Senet', icon: '🏺' },
    { name: 'Go', icon: '⚫' },
    { name: 'Mancala', icon: '🌰' },
    { name: 'Chaturanga', icon: '♛' },
    { name: 'Patolli', icon: '🎲' },
    { name: 'Hanafuda', icon: '🌸' },
    { name: 'NineMensMorris', icon: '⚪' },
    { name: 'Hnefatafl', icon: '⚔️' },
    { name: 'Pachisi', icon: '🎯' },
  ];

  const tournamentTypes = [
    { value: 'elimination', label: 'Eliminação', description: 'Mata-mata tradicional' },
    { value: 'round_robin', label: 'Todos contra Todos', description: 'Cada jogador enfrenta todos os outros' },
    { value: 'swiss', label: 'Sistema Suíço', description: 'Emparelhamento baseado em pontuação' },
  ];

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      // Simulação de dados - em produção seria uma chamada à API
      const mockTournaments: Tournament[] = [
        {
          id: '1',
          name: 'Copa dos Faraós',
          game: 'Senet',
          type: 'elimination',
          maxPlayers: 16,
          currentPlayers: 12,
          entryFee: 0,
          prizePool: 5000,
          startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'registration',
          participants: [],
          createdBy: 'admin',
        },
        {
          id: '2',
          name: 'Torneio dos Mestres Go',
          game: 'Go',
          type: 'swiss',
          maxPlayers: 32,
          currentPlayers: 28,
          entryFee: 100,
          prizePool: 10000,
          startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'registration',
          participants: [],
          createdBy: 'admin',
        },
        {
          id: '3',
          name: 'Liga Africana Mancala',
          game: 'Mancala',
          type: 'round_robin',
          maxPlayers: 8,
          currentPlayers: 8,
          entryFee: 50,
          prizePool: 2000,
          startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          participants: [],
          createdBy: 'player123',
        },
        {
          id: '4',
          name: 'Campeonato Mundial Chaturanga',
          game: 'Chaturanga',
          type: 'elimination',
          maxPlayers: 64,
          currentPlayers: 64,
          entryFee: 200,
          prizePool: 50000,
          startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          participants: [],
          createdBy: 'admin',
        },
      ];

      setTournaments(mockTournaments);
    } catch (error) {
      console.error('Erro ao carregar torneios:', error);
      Alert.alert('Erro', 'Não foi possível carregar os torneios.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTournaments();
    setRefreshing(false);
  };

  const getFilteredTournaments = () => {
    switch (activeTab) {
      case 'active':
        return tournaments.filter(t => t.status === 'registration' || t.status === 'active');
      case 'my':
        // Em produção, filtrar por torneios do usuário atual
        return tournaments.filter(t => t.createdBy === 'player123');
      case 'completed':
        return tournaments.filter(t => t.status === 'completed');
      default:
        return tournaments;
    }
  };

  const joinTournament = (tournament: Tournament) => {
    if (tournament.currentPlayers >= tournament.maxPlayers) {
      Alert.alert('Torneio Lotado', 'Este torneio já atingiu o número máximo de participantes.');
      return;
    }

    if (tournament.status !== 'registration') {
      Alert.alert('Inscrições Encerradas', 'As inscrições para este torneio já foram encerradas.');
      return;
    }

    Alert.alert(
      'Confirmar Inscrição',
      `Deseja se inscrever no torneio "${tournament.name}"?${tournament.entryFee > 0 ? `\n\nTaxa de inscrição: ${tournament.entryFee} moedas` : ''}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            // Simular inscrição
            const updatedTournaments = tournaments.map(t => 
              t.id === tournament.id 
                ? { ...t, currentPlayers: t.currentPlayers + 1 }
                : t
            );
            setTournaments(updatedTournaments);
            Alert.alert('Sucesso', 'Inscrição realizada com sucesso!');
          },
        },
      ]
    );
  };

  const createTournament = async () => {
    if (!newTournament.name.trim()) {
      Alert.alert('Erro', 'Nome do torneio é obrigatório.');
      return;
    }

    try {
      // Simular criação de torneio
      const tournament: Tournament = {
        id: Date.now().toString(),
        ...newTournament,
        currentPlayers: 1, // Criador já está inscrito
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'registration',
        participants: [],
        createdBy: 'current_user',
      };

      setTournaments([tournament, ...tournaments]);
      setCreateModalVisible(false);
      setNewTournament({
        name: '',
        game: 'Senet',
        type: 'elimination',
        maxPlayers: 16,
        entryFee: 0,
        prizePool: 1000,
      });

      Alert.alert('Sucesso', 'Torneio criado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o torneio.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registration': return '#4CAF50';
      case 'active': return '#FF9800';
      case 'completed': return '#9E9E9E';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'registration': return 'Inscrições Abertas';
      case 'active': return 'Em Andamento';
      case 'completed': return 'Finalizado';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    const typeObj = tournamentTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderTournamentCard = (tournament: Tournament) => (
    <View key={tournament.id} style={styles.tournamentCard}>
      <View style={styles.tournamentHeader}>
        <View style={styles.tournamentInfo}>
          <Text style={styles.tournamentName}>{tournament.name}</Text>
          <View style={styles.gameInfo}>
            <Text style={styles.gameIcon}>
              {games.find(g => g.name === tournament.game)?.icon || '🎮'}
            </Text>
            <Text style={styles.gameName}>{tournament.game}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tournament.status) }]}>
          <Text style={styles.statusText}>{getStatusText(tournament.status)}</Text>
        </View>
      </View>

      <View style={styles.tournamentDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tipo:</Text>
          <Text style={styles.detailValue}>{getTypeText(tournament.type)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Participantes:</Text>
          <Text style={styles.detailValue}>
            {tournament.currentPlayers}/{tournament.maxPlayers}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Prêmio:</Text>
          <Text style={styles.prizeValue}>{tournament.prizePool} moedas</Text>
        </View>
        {tournament.entryFee > 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Taxa:</Text>
            <Text style={styles.detailValue}>{tournament.entryFee} moedas</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Início:</Text>
          <Text style={styles.detailValue}>{formatDate(tournament.startDate)}</Text>
        </View>
      </View>

      {tournament.status === 'registration' && (
        <TouchableOpacity
          style={[
            styles.joinButton,
            tournament.currentPlayers >= tournament.maxPlayers && styles.joinButtonDisabled
          ]}
          onPress={() => joinTournament(tournament)}
          disabled={tournament.currentPlayers >= tournament.maxPlayers}
        >
          <Text style={styles.joinButtonText}>
            {tournament.currentPlayers >= tournament.maxPlayers ? 'Lotado' : 'Participar'}
          </Text>
        </TouchableOpacity>
      )}

      {tournament.status === 'active' && (
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>Ver Progresso</Text>
        </TouchableOpacity>
      )}

      {tournament.status === 'completed' && (
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>Ver Resultados</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Torneios</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setCreateModalVisible(true)}
        >
          <Text style={styles.createButtonText}>+ Criar</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Ativos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my' && styles.activeTab]}
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>
            Meus
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Finalizados
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tournament List */}
      <ScrollView
        style={styles.tournamentList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFD700"
            colors={['#FFD700']}
          />
        }
      >
        {getFilteredTournaments().length > 0 ? (
          getFilteredTournaments().map(renderTournamentCard)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏆</Text>
            <Text style={styles.emptyTitle}>Nenhum torneio encontrado</Text>
            <Text style={styles.emptyText}>
              {activeTab === 'active' && 'Não há torneios ativos no momento.'}
              {activeTab === 'my' && 'Você ainda não criou nenhum torneio.'}
              {activeTab === 'completed' && 'Nenhum torneio finalizado.'}
            </Text>
          </View>
        )}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Create Tournament Modal */}
      <Modal
        visible={createModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Criar Torneio</Text>
            
            <ScrollView style={styles.modalForm}>
              <Text style={styles.inputLabel}>Nome do Torneio</Text>
              <TextInput
                style={styles.textInput}
                value={newTournament.name}
                onChangeText={(text) => setNewTournament({...newTournament, name: text})}
                placeholder="Digite o nome do torneio"
                placeholderTextColor="#666"
              />

              <Text style={styles.inputLabel}>Jogo</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gameSelector}>
                {games.map((game) => (
                  <TouchableOpacity
                    key={game.name}
                    style={[
                      styles.gameOption,
                      newTournament.game === game.name && styles.selectedGameOption
                    ]}
                    onPress={() => setNewTournament({...newTournament, game: game.name})}
                  >
                    <Text style={styles.gameOptionIcon}>{game.icon}</Text>
                    <Text style={styles.gameOptionText}>{game.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.inputLabel}>Tipo de Torneio</Text>
              {tournamentTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeOption,
                    newTournament.type === type.value && styles.selectedTypeOption
                  ]}
                  onPress={() => setNewTournament({...newTournament, type: type.value as any})}
                >
                  <Text style={styles.typeOptionTitle}>{type.label}</Text>
                  <Text style={styles.typeOptionDescription}>{type.description}</Text>
                </TouchableOpacity>
              ))}

              <Text style={styles.inputLabel}>Máximo de Jogadores</Text>
              <View style={styles.numberSelector}>
                {[8, 16, 32, 64].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.numberOption,
                      newTournament.maxPlayers === num && styles.selectedNumberOption
                    ]}
                    onPress={() => setNewTournament({...newTournament, maxPlayers: num})}
                  >
                    <Text style={styles.numberOptionText}>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setCreateModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCreateButton}
                onPress={createTournament}
              >
                <Text style={styles.modalCreateText}>Criar Torneio</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  header: {
    backgroundColor: '#16213E',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  createButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#1A1A2E',
    fontWeight: 'bold',
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
  tournamentList: {
    flex: 1,
    padding: 15,
  },
  tournamentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  tournamentInfo: {
    flex: 1,
  },
  tournamentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  gameInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  gameName: {
    fontSize: 14,
    color: '#CCC',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold',
  },
  tournamentDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: '#CCC',
  },
  detailValue: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: 'bold',
  },
  prizeValue: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonDisabled: {
    backgroundColor: '#666',
  },
  joinButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  viewButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#CCC',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#16213E',
    borderRadius: 15,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalForm: {
    maxHeight: 400,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
    marginTop: 15,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFF',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  gameSelector: {
    marginBottom: 10,
  },
  gameOption: {
    alignItems: 'center',
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 80,
  },
  selectedGameOption: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  gameOptionIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  gameOptionText: {
    fontSize: 12,
    color: '#FFF',
    textAlign: 'center',
  },
  typeOption: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedTypeOption: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  typeOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  typeOptionDescription: {
    fontSize: 14,
    color: '#CCC',
  },
  numberSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  numberOption: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  selectedNumberOption: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  numberOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalCancelButton: {
    backgroundColor: '#666',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  modalCancelText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalCreateButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  modalCreateText: {
    color: '#1A1A2E',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default TournamentsScreen;

