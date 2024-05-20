import React from 'react';

const UsuarioSelect = ({ usuarios, selecionado, onChange, tipo }) => {
  return (
    <div>
      <label>{tipo}:</label>
      <select value={selecionado} onChange={onChange}>
        <option value="">Selecione um {tipo}</option>
        {usuarios.map(usuario => (
          <option key={usuario.nome} value={usuario.nome}>{usuario.nome}</option>
        ))}
      </select>
    </div>
  );
};

export default UsuarioSelect;