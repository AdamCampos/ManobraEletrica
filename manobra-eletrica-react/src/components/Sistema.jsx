import React from 'react';
import Painel from './Painel';

const Sistema = () => {
    return (
        <div>
            <h1>Sistema de Disjuntores</h1>
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
                    estado: 'energizado',
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
                    estado: 'desativado',
                    orientacao: 'horizontal',
                    escala: 1,
                }}
            />
        </div>
    );
};

export default Sistema;
