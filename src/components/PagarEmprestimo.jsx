import React, { useState } from 'react';

const PagarEmprestimo = ({ emprestimo, onConfirmar }) => {
  const [senha, setSenha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmar(senha);
  };

  if (!emprestimo || emprestimo.valor === undefined || emprestimo.valorAtualizado === undefined) {
    return <div>Carregando informações do empréstimo...</div>;
  }
  
  return (
    <div>
      <h2>Pagar Empréstimo</h2>
      <p>Valor original: R$ {emprestimo.valor.toFixed(2)}</p>
      <p>Valor atualizado: R$ {emprestimo.valorAtualizado.toFixed(2)}</p>
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
