import React from 'react';

function NewsletterSignup() {
  return (
    <div className="newsletter-signup">
      <h3>Assine nossa Newsletter</h3>
      <p>Receba as últimas notícias e atualizações diretamente na sua caixa de entrada.</p>
      {/* Futuramente: formulário de inscrição */}
      <form>
        <input type="email" placeholder="Seu e-mail" />
        <button type="submit">Assinar</button>
      </form>
    </div>
  );
}

export default NewsletterSignup;

