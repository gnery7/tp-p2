// src/components/PagarEmprestimo.js
import React, { useState } from 'react';

const PagarEmprestimo = ({ emprestimo, onConfirmar }) => {
  const [senha, setSenha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmar(senha);
  };

  return (
    <div>
      <h2>Pagar Empréstimo</h2>
      <p>Valor original: {emprestimo.valor.toFixed(2)}</p>
      <p>Valor atualizado: {emprestimo.valorAtualizado.toFixed(2)}</p>
      <form onSubmit={handleSubmit}>
        <label>
          Senha do credor:
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        </label>
        <button type="submit">Confirmar Pagamento</button>
      </form>
    </div>
  );
};

export default PagarEmprestimo;