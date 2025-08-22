import React from 'react';
import CommentsSection from '../components/CommentsSection';

function Blog() {
  return (
    <div>
      <h2>Nosso Blog</h2>
      <p>Leia artigos fascinantes sobre a história, cultura e curiosidades dos jogos.</p>
      {/* Aqui você pode listar posts do blog */}
      <CommentsSection />
    </div>
  );
}

export default Blog;

