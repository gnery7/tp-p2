import React, { useState, useEffect } from 'react';
import './App.css'; // Assegure-se que os estilos estão sendo importados
import './components.css';
import UsuarioSelect from './components/UsuarioSelect';
import EmprestimoList from './components/EmprestimoList';
import PagarEmprestimo from './components/PagarEmprestimo';
import Formulario from './components/CadastrarUsuario';

const sistema = {
  juros: 0.01, // 10% ao dia
  usuarios: [
    { nome: "Joao", senha: "123" },
    { nome: "Maria", senha: "456" },
    { nome: "Antonio", senha: "789" },
    { nome: "Jose", senha: "321" }
  ],
  emprestimos: [
    { id: 'id-1', valor: 10, data: new Date("2024-04-15"), credor: "Joao", devedor: "Maria", valorAtualizado: 11 },
    { id: 'id-2', valor: 12, data: new Date("2024-04-15"), credor: "Antonio", devedor: "Maria", valorAtualizado: 13.2 },
    { id: 'id-3', valor: 5, data: new Date("2024-04-15"), credor: "Antonio", devedor: "Jose", valorAtualizado: 5.5 },
    { id: 'id-4', valor: 3, data: new Date("2024-04-15"), credor: "Antonio", devedor: "Maria", valorAtualizado: 3.3 },
    { id: 'id-5', valor: 18, data: new Date("2024-04-15"), credor: "Joao", devedor: "Maria", valorAtualizado: 19.8 }
  ],
  obterValorAtualizado: function(emprestimo) {
    const hoje = new Date();
    const dataEmprestimo = new Date(emprestimo.data);
    const diferencaTempo = hoje.getTime() - dataEmprestimo.getTime();
    const diferencaDias = Math.ceil(diferencaTempo / (1000 * 3600 * 24));
    return emprestimo.valor * Math.pow(1 + this.juros, diferencaDias);
  },
  obterEmprestimos: function(nomeCredor, nomeDevedor) {
    return this.emprestimos
      .filter(e => e.credor === nomeCredor && e.devedor === nomeDevedor)
      .map(e => ({
        ...e,
        valorAtualizado: this.obterValorAtualizado(e)
      }));
  }
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [usuarios, setUsuarios] = useState(sistema.usuarios);
  const [nomeCredor, setNomeCredor] = useState('');
  const [nomeDevedor, setNomeDevedor] = useState('');
  const [emprestimos, setEmprestimos] = useState([]);
  const [emprestimoSelecionado, setEmprestimoSelecionado] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [exibirFormulario, setExibirFormulario] = useState(false);
  const [valorEmprestimo, setValorEmprestimo] = useState('');
  const [dataEmprestimo, setDataEmprestimo] = useState(new Date().toISOString().substring(0, 10));

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleCredorChange = (e) => {
    const selectedCredor = e.target.value;
    setNomeCredor(selectedCredor);
    if (selectedCredor && nomeDevedor) {
      setEmprestimos(sistema.obterEmprestimos(selectedCredor, nomeDevedor));
    } else {
      setEmprestimos([]);
    }
  };

  const handleDevedorChange = (e) => {
    const selectedDevedor = e.target.value;
    setNomeDevedor(selectedDevedor);
    if (nomeCredor && selectedDevedor) {
      setEmprestimos(sistema.obterEmprestimos(nomeCredor, selectedDevedor));
    } else {
      setEmprestimos([]);
    }
  };

  const handlePagar = (index) => {
    setEmprestimoSelecionado(emprestimos[index]);
  };

  const handleConfirmarPagamento = (senha) => {
    if (!emprestimoSelecionado) {
      setMensagem("Nenhum empréstimo selecionado.");
      return;
    }
    const credor = usuarios.find(u => u.nome === emprestimoSelecionado.credor);
    if (credor && credor.senha === senha) {
      const novosEmprestimos = emprestimos.filter(emp => emp.id !== emprestimoSelecionado.id);
      setEmprestimos(novosEmprestimos);
      setMensagem(`Empréstimo de ${emprestimoSelecionado.valorAtualizado.toFixed(2)} pago com sucesso.`);
      setEmprestimoSelecionado(null);
    } else {
      setMensagem("Senha incorreta ou credor não encontrado.");
    }
  };

  const handleNovoEmprestimo = () => {
    if (!nomeCredor || !nomeDevedor || !valorEmprestimo || !dataEmprestimo) {
      setMensagem('Por favor, preencha todos os campos necessários.');
      return;
    }
    if (nomeCredor === nomeDevedor) {
      setMensagem('Não é possível fazer um empréstimo para si mesmo.');
      return;
    }
    const novoEmprestimo = {
      id: `id-${Date.now()}`,
      valor: parseFloat(valorEmprestimo),
      data: new Date(dataEmprestimo),
      credor: nomeCredor,
      devedor: nomeDevedor,
      valorAtualizado: sistema.obterValorAtualizado({ valor: parseFloat(valorEmprestimo), data: new Date(dataEmprestimo) })
    };
    sistema.emprestimos.push(novoEmprestimo);
    setEmprestimos(sistema.obterEmprestimos(nomeCredor, nomeDevedor));
    setValorEmprestimo('');
    setDataEmprestimo(new Date().toISOString().substring(0, 10)); // Resetar a data para a atual
    setMensagem('Empréstimo cadastrado com sucesso!');
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Sistema de Empréstimos</h1>
        <button className="button toggle-theme" onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
        </button>
      </div>
  
      <div className="user-selects">
        <UsuarioSelect usuarios={usuarios} selecionado={nomeCredor} onChange={handleCredorChange} tipo="Credor" />
        <UsuarioSelect usuarios={usuarios} selecionado={nomeDevedor} onChange={handleDevedorChange} tipo="Devedor" />
      </div>
  
      {exibirFormulario ? (
        <Formulario usuarios={usuarios} setUsuarios={setUsuarios} setExibirFormulario={setExibirFormulario} />
      ) : (
        <button onClick={() => setExibirFormulario(true)} className="button add-user">Adicionar Novo Usuário</button>
      )}
  
      {nomeCredor && nomeDevedor && (
        <>
          <div className="loan-details">
            <input
              type="number"
              className="input"
              value={valorEmprestimo}
              onChange={(e) => setValorEmprestimo(e.target.value)}
              placeholder="Valor do Empréstimo"
            />
            <input
              type="date"
              className="input"
              value={dataEmprestimo}
              onChange={(e) => setDataEmprestimo(e.target.value)}
            />
            <button className="button" onClick={handleNovoEmprestimo}>Cadastrar Empréstimo</button>
          </div>
  
          <EmprestimoList emprestimos={emprestimos} onPagar={handlePagar} />
  
          {emprestimoSelecionado && (
            <PagarEmprestimo emprestimo={emprestimoSelecionado} onConfirmar={handleConfirmarPagamento} />
          )}
        </>
      )}
  
      {mensagem && <p>{mensagem}</p>}
    </div>
  );  
}

export default App;
