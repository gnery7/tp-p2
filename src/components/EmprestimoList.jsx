import React from 'react';

const EmprestimoList = ({ emprestimos, onPagar }) => {
  return (
    <div>
      <h2>Empréstimos</h2>
      {emprestimos.length === 0 ? (
        <p>Nenhum empréstimo encontrado.</p>
      ) : (
        <ul>
          {emprestimos.map((emprestimo, index) => (
            <li key={index}>
              Valor original: R$ {emprestimo.valor.toFixed(2)}, 
              Valor atualizado: R$ {emprestimo.valorAtualizado.toFixed(2)}, 
              Data: {emprestimo.data.toLocaleDateString()}
              <view> </view> 
              <button onClick={() => onPagar(index)}>Pagar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmprestimoList;