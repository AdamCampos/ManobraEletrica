import React, { useContext } from 'react';
import { SistemaContext } from '../ContextoSistema';
import Painel from './Painel';
import '../assets/css/sistema.css';

const Sistema = () => {
    const { modo, setModo } = useContext(SistemaContext);

    const alternarModo = () => {
        setModo((prevModo) => (prevModo === 'Edição' ? 'Operação' : 'Edição'));
    };

    return (
        <div className="sistema-container">
            <div className="modo-toggle-container">
                <button
                    onClick={alternarModo}
                    className={`modo-toggle ${modo.toLowerCase()}`}
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
                    nome="PN-5143001 A"
                    altura={100}
                    largura={800}
                    topo={100}
                    esquerda={1}
                    numDisjuntores={17}
                    escalaDisjuntores={1}
                    barra={{
                        tag: 'Barra Energizada',
                        estado: modo === 'Edição' ? 'energizado' : 'desativado',
                        orientacao: 'horizontal',
                        escala: 1,
                    }}
                />
                <Painel
                    id="painel-secao-b"
                    nome="PN-5143001 B"
                    altura={100}
                    largura={800}
                    topo={100}
                    esquerda={810}
                    numDisjuntores={16}
                    escalaDisjuntores={1}
                    barra={{
                        tag: 'Barra Desenergizada',
                        estado: modo === 'Edição' ? 'energizado' : 'desativado',
                        orientacao: 'horizontal',
                        escala: 1,
                    }}
                />
            </main>
        </div>
    );
};

export default Sistema;
