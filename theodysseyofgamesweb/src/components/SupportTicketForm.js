import React from "react";

function SupportTicketForm() {
  return (
    <div className="support-ticket-form">
      <h3>Abrir um Ticket de Suporte</h3>
      <p>Preencha o formulário abaixo para entrar em contato com nossa equipe de suporte.</p>
      {/* Futuramente: formulário de ticket */}
      <form>
        <input type="text" placeholder="Assunto" />
        <textarea placeholder="Descreva seu problema"></textarea>
        <button type="submit">Enviar Ticket</button>
      </form>
    </div>
  );
}

export default SupportTicketForm;

