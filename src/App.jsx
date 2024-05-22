import React, { useState } from 'react';
import UsuarioSelect from './components/UsuarioSelect';
import EmprestimoList from './components/EmprestimoList';
import PagarEmprestimo from './components/PagarEmprestimo';
import Formulario from './components/CadastrarUsuario';

const sistema = {
  juros: 0.1,
  usuarios: [
    { nome: "Joao", senha: "123" },
    { nome: "Maria", senha: "456" },
    { nome: "Antonio", senha: "789" },
    { nome: "Jose", senha: "321" }
  ],
  emprestimos: [
    { id: 'id-1', valor: 10, data: new Date("2024-04-15"), credor: "Joao", devedor: "Maria", valorAtualizado: 10 },
    { id: 'id-2', valor: 12, data: new Date("2024-04-15"), credor: "Antonio", devedor: "Maria", valorAtualizado: 12 },
    { id: 'id-3', valor: 5, data: new Date("2024-04-15"), credor: "Antonio", devedor: "Jose", valorAtualizado: 5 },
    { id: 'id-4', valor: 3, data: new Date("2024-04-15"), credor: "Antonio", devedor: "Maria", valorAtualizado: 3 },
    { id: 'id-5', valor: 18, data: new Date("2024-04-15"), credor: "Joao", devedor: "Maria", valorAtualizado: 18 }
  ],
  obterEmprestimos(nomeCredor, nomeDevedor) {
    return this.emprestimos.filter(e => e.credor === nomeCredor && e.devedor === nomeDevedor);
  }
};

const App = () => {
  const [usuarios, setUsuarios] = useState(sistema.usuarios);
  const [nomeCredor, setNomeCredor] = useState('');
  const [nomeDevedor, setNomeDevedor] = useState('');
  const [emprestimos, setEmprestimos] = useState([]);
  const [emprestimoSelecionado, setEmprestimoSelecionado] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [exibirFormulario, setExibirFormulario] = useState(false);

  const handleCredorChange = (e) => {
    const novoCredor = e.target.value;
    setNomeCredor(novoCredor);
    if (nomeDevedor) {
      setEmprestimos(sistema.obterEmprestimos(novoCredor, nomeDevedor));
    }
  };

  const handleDevedorChange = (e) => {
    const novoDevedor = e.target.value;
    setNomeDevedor(novoDevedor);
    if (nomeCredor) {
      setEmprestimos(sistema.obterEmprestimos(nomeCredor, novoDevedor));
    }
  };

  const handlePagar = (index) => {
    const emprestimo = emprestimos[index];
    setEmprestimoSelecionado(emprestimo);
  };

  const handleConfirmarPagamento = (senha) => {
    if (!emprestimoSelecionado) {
      setMensagem("Nenhum empréstimo selecionado.");
      return;
    }
    const usuarioCredor = usuarios.find(u => u.nome === emprestimoSelecionado.credor);
    if (usuarioCredor && usuarioCredor.senha === senha) {
      const novosEmprestimos = emprestimos.filter(emp => emp.id !== emprestimoSelecionado.id);
      setEmprestimos(novosEmprestimos);
      setMensagem(`Empréstimo de ${emprestimoSelecionado.valorAtualizado.toFixed(2)} pago com sucesso.`);
      setEmprestimoSelecionado(null);
    } else {
      setMensagem("Senha incorreta ou credor não encontrado.");
    }
  };

  return (
    <div>
      <h1>Sistema de Empréstimos</h1>
      <UsuarioSelect
        usuarios={usuarios}
        selecionado={nomeCredor}
        onChange={handleCredorChange}
        tipo="Credor"
      />
      <UsuarioSelect
        usuarios={usuarios}
        selecionado={nomeDevedor}
        onChange={handleDevedorChange}
        tipo="Devedor"
      />

      {exibirFormulario ? (
        <Formulario usuarios={usuarios} setUsuarios={setUsuarios} setExibirFormulario={setExibirFormulario} />
      ) : (
        <button onClick={() => setExibirFormulario(true)}>Não está cadastrado? Cadastre-se</button>
      )}

      <EmprestimoList emprestimos={emprestimos} onPagar={handlePagar} />
      {emprestimoSelecionado && (
        <PagarEmprestimo
          emprestimo={emprestimoSelecionado}
          onConfirmar={handleConfirmarPagamento}
        />
      )}
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
};

export default App;
