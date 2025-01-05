import React, { useState, useEffect, useContext } from 'react';
import Disjuntor from './Disjuntor';
import Barra from './Barra';
import { SistemaContext } from '../ContextoSistema';
import '../assets/css/painel.css';

const Painel = ({ id, nome, altura, largura, topo, esquerda, numDisjuntores, escalaDisjuntores, barra }) => {
    const { modo } = useContext(SistemaContext);
    const [position, setPosition] = useState({ top: topo, left: esquerda });
    const [size, setSize] = useState({ width: largura, height: altura });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [disjuntores, setDisjuntores] = useState([]);

    useEffect(() => {
        const espacamentoX = largura / (numDisjuntores + 1);
        const centroY = altura / 2;
        const initialDisjuntores = Array.from({ length: numDisjuntores }, (_, i) => ({
            id: `${id}-disjuntor-${i}`,
            name: `Disjuntor ${i + 1}`,
            position: { x: espacamentoX * (i + 1), y: centroY },
            estado: 'aberto',
        }));
        setDisjuntores(initialDisjuntores);
    }, [id, largura, altura, numDisjuntores]);

    return (
        <div
            id={id}
            className={`painel-container ${modo === 'Edição' ? 'edicao' : 'operacao'}`}
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${size.width}px`,
                height: `${size.height}px`,
            }}
        >
            <h3 className="painel-titulo">{nome}</h3>
            <Barra
                tag={barra?.tag || 'Barra Principal'}
                numNos={1}
                estado={barra?.estado || 'desativado'}
                orientacao={barra?.orientacao || 'horizontal'}
                escala={barra?.escala || 1}
                posicao={{ topo: '50%', esquerda: '0%' }}
            />
            {disjuntores.map((disjuntor) => (
                <Disjuntor
                    key={disjuntor.id}
                    id={disjuntor.id}
                    name={disjuntor.name}
                    estado={disjuntor.estado}
                    position={disjuntor.position}
                    escala={escalaDisjuntores}
                />
            ))}
        </div>
    );
};

export default Painel;
