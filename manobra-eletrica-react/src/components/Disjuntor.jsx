import React, { useState, useContext } from 'react';
import { SistemaContext } from '../ContextoSistema'; // Importa o contexto para verificar o modo atual
import JanelaComando from './JanelaComando'; // Importa a janela de comando
import '../assets/css/disjuntor.css';

const Disjuntor = ({ id, name, estado = 'inativo', position, escala = 1, onDragEnd }) => {
    const { modo } = useContext(SistemaContext); // Verifica o modo atual (Edição/Operação)
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [showComando, setShowComando] = useState(false); // Controla exibição da janela de comando

    // Garantir que a posição seja válida
    const { x = 0, y = 0 } = position || {};

    const handleMouseDown = (e) => {
        if (modo !== 'Edição') return; // Drag permitido apenas em modo Edição
        e.stopPropagation();
        setIsDragging(true);
        setOffset({
            x: e.clientX - x,
            y: e.clientY - y,
        });

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const newPosition = {
            x: Math.max(0, e.clientX - offset.x), // Limite à esquerda
            y: Math.max(0, e.clientY - offset.y), // Limite ao topo
        };
        if (onDragEnd) onDragEnd(id, newPosition);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleClick = (e) => {
        e.stopPropagation();
        if (!isDragging && modo === 'Operação') {
            console.log(`[Disjuntor - ${name}] Clique capturado`);
            setShowComando(true); // Abre a janela de comando
        }
    };

    const tamanho = 59.5 * 0.5 * escala; // Dimensões ajustadas para 50%

    const estadoAtual = modo === 'Edição' ? 'edicao' : estado;
    const estadoClass = `disjuntor-${estadoAtual}`;

    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={`${tamanho}px`}
                height={`${tamanho}px`}
                className={`disjuntor ${estadoClass}`}
                style={{
                    position: 'absolute',
                    top: `${y}px`,
                    left: `${x}px`,
                    cursor: modo === 'Edição' ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
                    zIndex: 10, // Garante que o disjuntor esteja acima de outros elementos
                }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onClick={handleClick}
            >
                <rect
                    x={tamanho * 0.1}
                    y={tamanho * 0.1}
                    width={tamanho * 0.8}
                    height={tamanho * 0.8}
                    rx={tamanho * 0.03} // Redução adicional do arredondamento
                    ry={tamanho * 0.03}
                />
                <line
                    x1={tamanho * 0.1}
                    y1={tamanho * 0.5}
                    x2={tamanho * 0.9}
                    y2={tamanho * 0.5}
                    stroke="gray"
                    strokeWidth={tamanho * 0.02} // Linha menos espessa
                />
                <text
                    x={tamanho * 0.5}
                    y={tamanho * 0.85}
                    fontSize={tamanho * 0.15} // Tamanho visível do texto
                    textAnchor="middle"
                    fill="black" // Cor do texto
                    pointerEvents="none"
                >
                    {name}
                </text>
            </svg>
            {showComando && (
                <JanelaComando
                    nome={name}
                    onFechar={() => setShowComando(false)} // Fecha a janela de comando
                />
            )}
        </>
    );
};

export default Disjuntor;
