import React, { useState, useEffect } from 'react';
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
    { id: 'id-1', valor: 10, data: new Date("2024-04-15"), credor: "Joao", devedor: "Maria", valorAtualizado: 10 },
    { id: 'id-2', valor: 12, data: new Date("2024-04-15"), credor: "Antonio", devedor: "Maria", valorAtualizado: 12 },
    { id: 'id-3', valor: 5, data: new Date("2024-04-15"), credor: "Antonio", devedor: "Jose", valorAtualizado: 5 },
    { id: 'id-4', valor: 3, data: new Date("2024-04-15"), credor: "Antonio", devedor: "Maria", valorAtualizado: 3 },
    { id: 'id-5', valor: 18, data: new Date("2024-04-15"), credor: "Joao", devedor: "Maria", valorAtualizado: 18 }
  ],
  cadastrarEmprestimos(valor, nomeCredor, nomeDevedor) {
    const novoEmprestimo = {
      id: `id-${Date.now()}`,
      valor: parseFloat(valor),
      data: new Date(),
      credor: nomeCredor,
      devedor: nomeDevedor,
      valorAtualizado: parseFloat(valor)
    };
    this.emprestimos.push(novoEmprestimo);
  },  
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
  pagarEmprestimo(idEmprestimo, senhaCredor) {
    let emprestimo = this.emprestimos.find(e => e.id === idEmprestimo);
    if (!emprestimo) {
      return "Empréstimo não encontrado.";
    }
    let credor = this.usuarios.find(usuario => usuario.nome === emprestimo.credor);
    if (credor && credor.senha === senhaCredor) {
      let index = this.emprestimos.indexOf(emprestimo);
      this.emprestimos.splice(index, 1);
      return `Empréstimo de ${emprestimo.valorAtualizado.toFixed(2)} entre ${emprestimo.credor} e ${emprestimo.devedor} foi pago.`;
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

    useEffect(() => {
      console.log("Emprestimo selecionado:", emprestimoSelecionado);
  }, [emprestimoSelecionado]);

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
  if (!emprestimoSelecionado) {
      setMensagem("Nenhum empréstimo selecionado.");
      return;
  }
  const mensagem = sistema.pagarEmprestimo(emprestimoSelecionado.id, senha);
  setMensagem(mensagem);
  setEmprestimos(sistema.obterEmprestimos(nomeCredor, nomeDevedor));
  setEmprestimoSelecionado(null);
};  

  const [valorEmprestimo, setValorEmprestimo] = useState('');

  const handleNovoEmprestimo = () => {
    if (!nomeCredor || !nomeDevedor || !valorEmprestimo) {
      setMensagem('Por favor, preencha todos os campos necessários.');
      return;
    }
    sistema.cadastrarEmprestimos(valorEmprestimo, nomeCredor, nomeDevedor);
    setEmprestimos(sistema.obterEmprestimos(nomeCredor, nomeDevedor));
    setValorEmprestimo('');
    setMensagem('Empréstimo cadastrado com sucesso!');
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
      <input
        type="number"
        value={valorEmprestimo}
        onChange={(e) => setValorEmprestimo(e.target.value)}
        placeholder="Valor do Empréstimo"
      />
      <button onClick={handleNovoEmprestimo}>Cadastrar Empréstimo</button>
      {/* se deus quiser aparece a lista de emprestimos aqui */}
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
};

    

export default App;
