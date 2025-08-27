import React, { useState, useEffect } from 'react';
import NewsletterSignup from '../components/NewsletterSignup';
import SocialShare from '../components/SocialShare';
import '../styles/animations.css';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);

  const games = [
    { name: 'Senet', origin: 'Egito Antigo', icon: '🏺', color: '#FFD700' },
    { name: 'Go', origin: 'China', icon: '⚫', color: '#FF6B6B' },
    { name: 'Mancala', origin: 'África', icon: '🌰', color: '#8B4513' },
    { name: 'Chaturanga', origin: 'Índia', icon: '♛', color: '#FF8C00' },
    { name: 'Patolli', origin: 'Asteca', icon: '🎲', color: '#DC143C' },
    { name: 'Hanafuda', origin: 'Japão', icon: '🌸', color: '#FF69B4' },
    { name: 'Nine Men\'s Morris', origin: 'Medieval', icon: '⚪', color: '#4682B4' },
    { name: 'Hnefatafl', origin: 'Viking', icon: '⚔️', color: '#2F4F4F' },
    { name: 'Pachisi', origin: 'Índia', icon: '🎯', color: '#DAA520' },
  ];

  useEffect(() => {
    setIsLoaded(true);
    
    // Rotação automática dos jogos em destaque
    const interval = setInterval(() => {
      setCurrentGameIndex((prev) => (prev + 1) % games.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [games.length]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-container" style={homeStyles.container}>
      {/* Hero Section */}
      <section className="hero-section" style={homeStyles.heroSection}>
        <div className="hero-background" style={homeStyles.heroBackground}>
          <div className="animated-gradient" style={homeStyles.animatedGradient}></div>
          <div className="particles-container" style={homeStyles.particlesContainer}>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  ...homeStyles.particle,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  fontSize: `${Math.random() * 20 + 10}px`,
                }}
              >
                ✨
              </div>
            ))}
          </div>
        </div>
        
        <div className={`hero-content ${isLoaded ? 'animate-fade-in-up' : ''}`} style={homeStyles.heroContent}>
          <h1 className="hero-title" style={homeStyles.heroTitle}>
            The Odyssey of Games
          </h1>
          <p className={`hero-subtitle ${isLoaded ? 'animate-fade-in-up delay-300' : ''}`} style={homeStyles.heroSubtitle}>
            Embarque numa jornada épica através dos jogos mais antigos da humanidade
          </p>
          <p className={`hero-description ${isLoaded ? 'animate-fade-in-up delay-500' : ''}`} style={homeStyles.heroDescription}>
            Descubra a rica história dos jogos de tabuleiro que moldaram civilizações, 
            desde o antigo Egito até os vikings nórdicos. Cada jogo conta uma história, 
            cada partida é uma aventura através do tempo.
          </p>
          
          <div className={`hero-buttons ${isLoaded ? 'animate-fade-in-up delay-700' : ''}`} style={homeStyles.heroButtons}>
            <button 
              className="cta-button primary hover-lift smooth-transition"
              style={homeStyles.ctaButtonPrimary}
              onClick={() => scrollToSection('games')}
            >
              <span>🎮 Explorar Jogos</span>
            </button>
            <button 
              className="cta-button secondary hover-glow smooth-transition"
              style={homeStyles.ctaButtonSecondary}
              onClick={() => scrollToSection('about')}
            >
              <span>📚 Nossa História</span>
            </button>
          </div>
        </div>

        {/* Game Showcase Carousel */}
        <div className={`game-showcase ${isLoaded ? 'animate-scale-in delay-900' : ''}`} style={homeStyles.gameShowcase}>
          <div className="showcase-card hover-lift smooth-transition" style={homeStyles.showcaseCard}>
            <div 
              className="game-icon animate-float"
              style={{ ...homeStyles.gameIcon, color: games[currentGameIndex].color }}
            >
              {games[currentGameIndex].icon}
            </div>
            <h3 className="game-name" style={homeStyles.gameName}>{games[currentGameIndex].name}</h3>
            <p className="game-origin" style={homeStyles.gameOrigin}>{games[currentGameIndex].origin}</p>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="games-section" style={homeStyles.gamesSection}>
        <div className="container" style={homeStyles.container}>
          <h2 className="section-title animate-on-scroll" style={homeStyles.sectionTitle}>
            🏛️ Jogos Clássicos da Humanidade
          </h2>
          <p className="section-subtitle animate-on-scroll" style={homeStyles.sectionSubtitle}>
            Cada jogo representa uma civilização, uma cultura, uma época única na história
          </p>
          
          <div className="games-grid stagger-children" style={homeStyles.gamesGrid}>
            {games.map((game, index) => (
              <div 
                key={index}
                className="game-card hover-lift smooth-transition ripple-effect"
                style={homeStyles.gameCard}
              >
                <div className="game-card-header" style={homeStyles.gameCardHeader}>
                  <span className="game-card-icon animate-pulse" style={homeStyles.gameCardIcon}>{game.icon}</span>
                  <div className="game-card-info">
                    <h3 className="game-card-title" style={homeStyles.gameCardTitle}>{game.name}</h3>
                    <p className="game-card-origin" style={homeStyles.gameCardOrigin}>{game.origin}</p>
                  </div>
                </div>
                <div className="game-card-content" style={homeStyles.gameCardContent}>
                  <p className="game-card-description" style={homeStyles.gameCardDescription}>
                    Descubra as regras ancestrais e a rica história por trás deste jogo milenar.
                  </p>
                  <button className="game-card-button hover-scale smooth-transition" style={homeStyles.gameCardButton}>
                    Jogar Agora
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" style={homeStyles.featuresSection}>
        <div className="container" style={homeStyles.container}>
          <h2 className="section-title animate-on-scroll" style={homeStyles.sectionTitle}>
            ⚡ Recursos Únicos
          </h2>
          
          <div className="features-grid" style={homeStyles.featuresGrid}>
            <div className="feature-card animate-on-scroll hover-glow smooth-transition" style={homeStyles.featureCard}>
              <div className="feature-icon" style={homeStyles.featureIcon}>🎯</div>
              <h3 style={homeStyles.featureTitle}>IA Adaptativa</h3>
              <p style={homeStyles.featureDescription}>Nossa inteligência artificial se adapta ao seu nível de habilidade, proporcionando desafios equilibrados.</p>
            </div>
            
            <div className="feature-card animate-on-scroll hover-glow smooth-transition" style={homeStyles.featureCard}>
              <div className="feature-icon" style={homeStyles.featureIcon}>📊</div>
              <h3 style={homeStyles.featureTitle}>Estatísticas Detalhadas</h3>
              <p style={homeStyles.featureDescription}>Acompanhe seu progresso, conquistas e melhore suas habilidades com análises profundas.</p>
            </div>
            
            <div className="feature-card animate-on-scroll hover-glow smooth-transition" style={homeStyles.featureCard}>
              <div className="feature-icon" style={homeStyles.featureIcon}>🏆</div>
              <h3 style={homeStyles.featureTitle}>Sistema de Conquistas</h3>
              <p style={homeStyles.featureDescription}>Desbloqueie conquistas únicas e suba de nível enquanto domina os jogos ancestrais.</p>
            </div>
            
            <div className="feature-card animate-on-scroll hover-glow smooth-transition" style={homeStyles.featureCard}>
              <div className="feature-icon" style={homeStyles.featureIcon}>💾</div>
              <h3 style={homeStyles.featureTitle}>Salvamento Automático</h3>
              <p style={homeStyles.featureDescription}>Nunca perca seu progresso com nosso sistema inteligente de salvamento de partidas.</p>
            </div>
            
            <div className="feature-card animate-on-scroll hover-glow smooth-transition" style={homeStyles.featureCard}>
              <div className="feature-icon" style={homeStyles.featureIcon}>🌍</div>
              <h3 style={homeStyles.featureTitle}>Contexto Histórico</h3>
              <p style={homeStyles.featureDescription}>Aprenda sobre as civilizações e culturas que criaram estes jogos fascinantes.</p>
            </div>
            
            <div className="feature-card animate-on-scroll hover-glow smooth-transition" style={homeStyles.featureCard}>
              <div className="feature-icon" style={homeStyles.featureIcon}>📱</div>
              <h3 style={homeStyles.featureTitle}>Multiplataforma</h3>
              <p style={homeStyles.featureDescription}>Jogue em qualquer dispositivo - web, mobile ou desktop - com sincronização automática.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter and Social */}
      <section style={homeStyles.newsletterSection}>
        <div className="container" style={homeStyles.container}>
          <NewsletterSignup />
          <SocialShare />
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" style={homeStyles.ctaSection}>
        <div className="container" style={homeStyles.container}>
          <div className="cta-content animate-on-scroll" style={homeStyles.ctaContent}>
            <h2 className="cta-title" style={homeStyles.ctaTitle}>Pronto para Sua Odyssey?</h2>
            <p className="cta-description" style={homeStyles.ctaDescription}>
              Junte-se a milhares de jogadores que já descobriram a magia dos jogos ancestrais.
              Sua jornada através da história começa agora!
            </p>
            <div className="cta-buttons" style={homeStyles.ctaButtons}>
              <button className="cta-button primary large hover-lift smooth-transition gold-shimmer" style={homeStyles.ctaButtonLarge}>
                🚀 Começar Aventura
              </button>
              <button className="cta-button secondary large hover-scale smooth-transition" style={homeStyles.ctaButtonSecondaryLarge}>
                📱 Baixar App
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const homeStyles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  heroSection: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    overflow: 'hidden',
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  animatedGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(-45deg, #FFD700, #FFA500, #FF6347, #FF1493)',
    backgroundSize: '400% 400%',
    animation: 'gradient-shift 15s ease infinite',
    opacity: 0.1,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    animation: 'particle-float 4s ease-in-out infinite',
  },
  heroContent: {
    zIndex: 1,
    maxWidth: '800px',
    padding: '0 20px',
  },
  heroTitle: {
    fontSize: '4rem',
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: '1rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '1.5rem',
  },
  heroDescription: {
    fontSize: '1.1rem',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaButtonPrimary: {
    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
    border: 'none',
    padding: '15px 30px',
    fontSize: '1.1rem',
    borderRadius: '25px',
    cursor: 'pointer',
    color: '#333',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  ctaButtonSecondary: {
    background: 'transparent',
    border: '2px solid #FFD700',
    color: '#FFD700',
    padding: '15px 30px',
    fontSize: '1.1rem',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  gameShowcase: {
    marginTop: '3rem',
  },
  showcaseCard: {
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
  },
  gameIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  gameName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '0.5rem',
  },
  gameOrigin: {
    color: '#666',
    fontSize: '1rem',
  },
  gamesSection: {
    padding: '5rem 0',
    background: '#f8f9fa',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  sectionSubtitle: {
    fontSize: '1.2rem',
    color: '#666',
    textAlign: 'center',
    marginBottom: '3rem',
  },
  gamesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  gameCard: {
    background: 'white',
    borderRadius: '15px',
    padding: '1.5rem',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
  },
  gameCardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  gameCardIcon: {
    fontSize: '2rem',
    marginRight: '1rem',
  },
  gameCardTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '0.25rem',
  },
  gameCardOrigin: {
    color: '#666',
    fontSize: '0.9rem',
  },
  gameCardContent: {
    textAlign: 'left',
  },
  gameCardDescription: {
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '1rem',
  },
  gameCardButton: {
    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    color: '#333',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  featuresSection: {
    padding: '5rem 0',
    background: 'white',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  },
  featureCard: {
    textAlign: 'center',
    padding: '2rem',
    borderRadius: '15px',
    background: '#f8f9fa',
    transition: 'all 0.3s ease',
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  featureTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '1rem',
  },
  featureDescription: {
    color: '#666',
    lineHeight: '1.5',
  },
  newsletterSection: {
    padding: '3rem 0',
    background: '#f8f9fa',
  },
  ctaSection: {
    padding: '5rem 0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    textAlign: 'center',
  },
  ctaContent: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  ctaDescription: {
    fontSize: '1.2rem',
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  ctaButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaButtonLarge: {
    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
    border: 'none',
    padding: '18px 36px',
    fontSize: '1.2rem',
    borderRadius: '30px',
    cursor: 'pointer',
    color: '#333',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  ctaButtonSecondaryLarge: {
    background: 'transparent',
    border: '2px solid white',
    color: 'white',
    padding: '18px 36px',
    fontSize: '1.2rem',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
};

export default Home;

