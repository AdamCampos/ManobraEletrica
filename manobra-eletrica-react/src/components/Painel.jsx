import React from 'react';
import Disjuntor from './Disjuntor';
import Barra from './Barra';

const Painel = ({ id, nome, altura, largura, topo, esquerda, disjuntores, barra }) => {
    return (
        <div
            id={id}
            style={{
                position: 'absolute',
                top: topo,
                left: esquerda,
                width: largura,
                height: altura,
                backgroundColor: '#f5f5f5',
                border: '2px dashed gray',
                zIndex: 1,
            }}
        >
            <h3 style={{ textAlign: 'center', margin: '10px 0' }}>{nome}</h3>
            <Barra
                tag={barra.tag}
                pontos={barra.pontos}
                estado={barra.estado}
            />
            {disjuntores.map((disjuntor, index) => (
                <Disjuntor
                    key={index}
                    id={disjuntor.id}
                    name={disjuntor.name}
                    estado={disjuntor.estado}
                    onAcaoSelecionada={(acao) => disjuntor.onAcaoSelecionada(acao)}
                />
            ))}
        </div>
    );
};

export default Painel;
