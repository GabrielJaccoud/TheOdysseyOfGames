import React from 'react';
import NewsletterSignup from '../components/NewsletterSignup';
import SocialShare from '../components/SocialShare';

function Home() {
  return (
    <div>
      <h2>Bem-vindo à Odisseia dos Jogos</h2>
      <p>Explore a rica história dos jogos clássicos de diferentes civilizações.</p>
      <NewsletterSignup />
      <SocialShare />
    </div>
  );
}

export default Home;

