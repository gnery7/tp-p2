import React, { useState } from 'react';
import UsuarioSelect from './components/UsuarioSelect';
import EmprestimoList from './components/EmprestimoList';
import PagarEmprestimo from './components/PagarEmprestimo';

const sistema = {
  juros: 0.1,
  usuarios: [
    { nome: "Joao", senha: "123" },
    { nome: "Maria", senha: "456" },
    { nome: "Antonio", senha: "789" },
    { nome: "Jose", senha: "321" }
  ],
  emprestimos: [
    { valor: 10, data: new Date("2024-04-15"), credor: "Joao", devedor: "Maria", valorAtualizado: 10 },
    { valor: 12, data: new Date("2024-04-15"), credor: "Antonio", devedor: "Maria", valorAtualizado: 12 },
    { valor: 5, data: new Date("2024-04-15"), credor: "Antonio", devedor: "Jose", valorAtualizado: 5 },
    { valor: 3, data: new Date("2024-04-15"), credor: "Antonio", devedor: "Maria", valorAtualizado: 3 },
    { valor: 18, data: new Date("2024-04-15"), credor: "Joao", devedor: "Maria", valorAtualizado: 18 }
  ],
  obterEmprestimos(nomeCredor, nomeDevedor) {
    return this.emprestimos
      .filter(e => e.credor === nomeCredor && e.devedor === nomeDevedor)
      .map(e => ({ ...e, valorAtualizado: this.obterValorAtualizado(e) }));
  },
  obterValorAtualizado(emprestimo) {
    let dataAtual = new Date();
    let diferencaMs = dataAtual - emprestimo.data;
    let diferencaDias = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));
    return emprestimo.valor * Math.pow(1 + this.juros, diferencaDias);
  },
  pagarEmprestimo(emprestimo, senhaCredor) {
    let credor = this.usuarios.find(usuario => usuario.nome === emprestimo.credor);
    if (credor && credor.senha === senhaCredor) {
      let index = this.emprestimos.indexOf(emprestimo);
      if (index !== -1) {
        this.emprestimos.splice(index, 1);
        return `Empréstimo de ${emprestimo.valorAtualizado.toFixed(2)} entre ${emprestimo.credor} e ${emprestimo.devedor} foi pago.`;
      } else {
        return "Empréstimo não encontrado.";
      }
    } else {
      return "Senha incorreta ou credor não encontrado.";
    }
  }
};

const App = () => {
  const [nomeCredor, setNomeCredor] = useState('');
  const [nomeDevedor, setNomeDevedor] = useState('');
  const [emprestimos, setEmprestimos] = useState([]);
  const [emprestimoSelecionado, setEmprestimoSelecionado] = useState(null);
  const [mensagem, setMensagem] = useState('');

  const handleCredorChange = (e) => {
    setNomeCredor(e.target.value);
    setEmprestimos(sistema.obterEmprestimos(e.target.value, nomeDevedor));
  };

  const handleDevedorChange = (e) => {
    setNomeDevedor(e.target.value);
    setEmprestimos(sistema.obterEmprestimos(nomeCredor, e.target.value));
  };

  const handlePagar = (index) => {
    setEmprestimoSelecionado(emprestimos[index]);
  };

  const handleConfirmarPagamento = (senha) => {
    const mensagem = sistema.pagarEmprestimo(emprestimoSelecionado, senha);
    setMensagem(mensagem);
    setEmprestimos(sistema.obterEmprestimos(nomeCredor, nomeDevedor));
    setEmprestimoSelecionado(null);
  };

  return (
    <div>
      <h1>Sistema de Empréstimos</h1>
      <UsuarioSelect
        usuarios={sistema.usuarios}
        selecionado={nomeCredor}
        onChange={handleCredorChange}
        tipo="Credor"
      />
      <UsuarioSelect
        usuarios={sistema.usuarios}
        selecionado={nomeDevedor}
        onChange={handleDevedorChange}
        tipo="Devedor"
      />
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
