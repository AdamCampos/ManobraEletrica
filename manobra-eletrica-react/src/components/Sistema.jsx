import React from 'react';
import Painel from './Painel';

const Sistema = () => {
    const handleAcaoSelecionada = (id, acao) => {
        console.log(`Ação "${acao}" realizada no Disjuntor ${id}`);
    };

    return (
        <div>
            <h1>Sistema de Disjuntores</h1>
            <Painel
                id="painel-1"
                nome="Painel Principal"
                altura="500px"
                largura="800px"
                topo="50px"
                esquerda="50px"
                disjuntores={[
                    {
                        id: 1,
                        name: "Disjuntor 1",
                        estado: "aberto",
                        onAcaoSelecionada: (acao) => handleAcaoSelecionada(1, acao),
                    },
                    {
                        id: 2,
                        name: "Disjuntor 2",
                        estado: "fechado",
                        onAcaoSelecionada: (acao) => handleAcaoSelecionada(2, acao),
                    },
                ]}
                barra={{
                    tag: "Barra Principal",
                    pontos: [
                        { x: 50, y: 250 },
                        { x: 150, y: 250 },
                        { x: 250, y: 250 },
                    ],
                    estado: "energizado",
                }}
            />
        </div>
    );
};

export default Sistema;
