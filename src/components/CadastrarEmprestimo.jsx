import React, { useState } from 'react';

function ListaDeItens() {
    const [itens, setItens] = useState([]);
    const [novoItem, setNovoItem] = useState('');

    const adicionarItem = () => {
        if (novoItem) {
            setItens([...itens, novoItem]);
            setNovoItem('');
        }
    };

    const handleChange = (event) => {
        setNovoItem(event.target.value);
    };

    return (
        <div>
            <input
                type="text"
                value={novoItem}
                onChange={handleChange}
                placeholder="Digite um item"
            />
            <button onClick={adicionarItem}>Adicionar</button>
            <ul>
                {itens.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
}

export default ListaDeItens;
