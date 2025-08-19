import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="/logo-TheOdysseyofGames.png" className="App-logo" alt="The Odyssey of Games" />
        <h1>The Odyssey of Games</h1>
        <p>
          Uma jornada épica através dos jogos clássicos das civilizações antigas
        </p>
        
        <div className="features">
          <div className="feature">
            <h3>🎮 Jogos Clássicos</h3>
            <p>Descubra jogos milenares de diferentes culturas</p>
          </div>
          <div className="feature">
            <h3>📚 Aprenda História</h3>
            <p>Mergulhe na rica história por trás de cada jogo</p>
          </div>
          <div className="feature">
            <h3>🌍 Conecte-se</h3>
            <p>Jogue com pessoas do mundo todo</p>
          </div>
        </div>

        <div className="games-grid">
          <h2>Civilizações Disponíveis</h2>
          <div className="civilizations">
            <div className="civilization">
              <h4>🏺 Egito Antigo</h4>
              <p>Senet - O jogo dos mortos</p>
            </div>
            <div className="civilization">
              <h4>🌸 Japão</h4>
              <p>Hanafuda - Cartas florais</p>
            </div>
            <div className="civilization">
              <h4>🏛️ Grécia</h4>
              <p>Petteia - Estratégia clássica</p>
            </div>
            <div className="civilization">
              <h4>🗿 Asteca</h4>
              <p>Patolli - Jogo sagrado</p>
            </div>
            <div className="civilization">
              <h4>🐘 Índia</h4>
              <p>Chaturanga - Ancestral do xadrez</p>
            </div>
            <div className="civilization">
              <h4>⚔️ Vikings</h4>
              <p>Hnefatafl - Defesa do rei</p>
            </div>
          </div>
        </div>

        <div className="download-section">
          <h2>Baixe Agora</h2>
          <div className="download-buttons">
            <button className="download-btn ios">📱 App Store</button>
            <button className="download-btn android">🤖 Google Play</button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
