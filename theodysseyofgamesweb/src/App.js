import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import About from './pages/About';
import Games from './pages/Games';
import Blog from './pages/Blog';
import Community from './pages/Community';
import Support from './pages/Support';
import Shop from './pages/Shop';
import Download from './pages/Download';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src="/logo-TheOdysseyofGames.png" className="App-logo" alt="The Odyssey of Games" />
          <h1>The Odyssey of Games</h1>
          <p>
            Uma jornada épica através dos jogos clássicos das civilizações antigas
          </p>
          <nav>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">Sobre</Link></li>
              <li><Link to="/games">Jogos</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/community">Comunidade</Link></li>
              <li><Link to="/support">Suporte</Link></li>
              <li><Link to="/shop">Loja</Link></li>
              <li><Link to="/download">Download</Link></li>
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/games" element={<Games />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/community" element={<Community />} />
            <Route path="/support" element={<Support />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/download" element={<Download />} />
          </Routes>
        </main>

        <footer className="App-footer">
          <p>&copy; 2025 The Odyssey of Games. Todos os direitos reservados.</p>
        </footer>
      </div>
    </Router>


export default App;

