import React, { useContext } from 'react';
import { SistemaContext } from '../ContextoSistema';
import Painel from './Painel';
import '../assets/css/sistema.css';

const Sistema = () => {
    const { modo, setModo } = useContext(SistemaContext);

    // Alterna o modo entre "Edição" e "Operação"
    const alternarModo = () => {
        setModo((prevModo) => (prevModo === 'Edição' ? 'Operação' : 'Edição'));
    };

    return (
        <div className="sistema-container">
            {/* Botão de alternar modo sempre acessível */}
            <div className="modo-toggle-container">
                <button
                    onClick={alternarModo}
                    className={`modo-toggle ${modo.toLowerCase()}`} // Classes dinâmicas baseadas no modo
                >
                    Modo: {modo}
                </button>
            </div>
            <header className="sistema-header">
                <h1>Sistema de Disjuntores</h1>
            </header>
            <main className="sistema-main">
                <Painel
                    id="painel-secao-a"
                    nome="PN-5143001 SEC A"
                    altura={400}
                    largura={800}
                    topo={20}
                    esquerda={50}
                    numDisjuntores={8}
                    escalaDisjuntores={1}
                    barra={{
                        tag: 'Barra Energizada',
                        estado: modo === 'Edição' ? 'energizado' : 'desativado', // Ajuste do estado da barra
                        orientacao: 'horizontal',
                        escala: 1,
                    }}
                />
                <Painel
                    id="painel-secao-b"
                    nome="PN-5143001 SEC B"
                    altura={400}
                    largura={800}
                    topo={450}
                    esquerda={50}
                    numDisjuntores={10}
                    escalaDisjuntores={1}
                    barra={{
                        tag: 'Barra Desenergizada',
                        estado: modo === 'Edição' ? 'energizado' : 'desativado', // Ajuste do estado da barra
                        orientacao: 'horizontal',
                        escala: 1,
                    }}
                />
            </main>
        </div>
    );
};

export default Sistema;
