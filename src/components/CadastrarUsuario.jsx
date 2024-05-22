import React, { useState } from 'react';

const Formulario = ({ usuarios, setUsuarios, setExibirFormulario }) => {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (nome && senha) {
      const novoUsuario = { nome, senha };
      setUsuarios([...usuarios, novoUsuario]);
      setNome('');
      setSenha('');
      setExibirFormulario(false);
    } else {
      alert('Preencha os campos nome e senha');
    }
  };

  return (
    <div>
      <h2>Cadastro de Usuários</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input type="text" value={nome} onChange={(event) => setNome(event.target.value)} />
        <label>Senha:</label>
        <input type="password" value={senha} onChange={(event) => setSenha(event.target.value)} />
        <button type="submit">Cadastrar</button>
        <button type="button" onClick={() => setExibirFormulario(false)}>Voltar</button>
      </form>
    </div>
  );
};

export default Formulario;