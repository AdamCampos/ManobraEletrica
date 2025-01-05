import React, { useState, useContext, useEffect } from 'react';
import { SistemaContext } from '../ContextoSistema';
import JanelaComando from './JanelaComando';
import '../assets/css/disjuntor.css';

const Disjuntor = ({ id, name, estado = 'inativo', position, escala = 1, onDragEnd, painelSize }) => {
    const { modo } = useContext(SistemaContext);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [showComando, setShowComando] = useState(false);

    const { x = 0, y = 0 } = position || {};
    const tamanho = 59.5 * 0.5 * escala;

    const [dragLimits, setDragLimits] = useState({ maxX: 0, maxY: 0 });

    useEffect(() => {
        if (painelSize && painelSize.width && painelSize.height) {
            setDragLimits({
                maxX: painelSize.width - tamanho,
                maxY: painelSize.height - tamanho,
            });
            console.log(`[Disjuntor - ${id}] Limites atualizados: ${JSON.stringify({
                maxX: painelSize.width - tamanho,
                maxY: painelSize.height - tamanho,
            })}`);
        } else {
            console.warn(`[Disjuntor - ${id}] painelSize inválido: ${JSON.stringify(painelSize)}`);
        }
    }, [painelSize, tamanho]);

    const handleMouseDown = (e) => {
        if (modo !== 'Edição') return;
        e.stopPropagation();

        const offset = {
            x: e.clientX - x,
            y: e.clientY - y,
        };

        console.log(`[Disjuntor - ${id}] Início do drag. Offset: ${JSON.stringify(offset)}`);

        setIsDragging(true);
        setDragOffset(offset);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const newX = Math.max(0, Math.min(mouseX - dragOffset.x, dragLimits.maxX));
        const newY = Math.max(0, Math.min(mouseY - dragOffset.y, dragLimits.maxY));

        const newPosition = { x: newX, y: newY };

        console.log(`[Disjuntor - ${id}] Durante o drag. Nova posição: ${JSON.stringify(newPosition)}`);

        if (onDragEnd) {
            onDragEnd(id, newPosition); // Notifica o Painel sobre a nova posição
        }
    };

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            console.log(`[Disjuntor - ${id}] Fim do drag.`);
        }
    };

    const handleClick = (e) => {
        e.stopPropagation();
        if (!isDragging && modo === 'Operação') {
            console.log(`[Disjuntor - ${id}] Clique capturado. Abrindo JanelaComando.`);
            setShowComando(true);
        }
    };

    const handleCloseComando = () => {
        console.log(`[Disjuntor - ${id}] Fechando JanelaComando.`);
        setShowComando(false);
    };

    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={`${tamanho}px`}
                height={`${tamanho}px`}
                className={`disjuntor disjuntor-${modo === 'Edição' ? 'edicao' : estado}`}
                style={{
                    position: 'absolute',
                    top: `${y}px`,
                    left: `${x}px`,
                    cursor: modo === 'Edição' ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
                    zIndex: 10,
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
                    rx={tamanho * 0.03}
                    ry={tamanho * 0.03}
                />
                <line
                    x1={tamanho * 0.1}
                    y1={tamanho * 0.5}
                    x2={tamanho * 0.9}
                    y2={tamanho * 0.5}
                    stroke="gray"
                    strokeWidth={tamanho * 0.02}
                />
                <text
                    x={tamanho * 0.5}
                    y={tamanho * 0.85}
                    fontSize={tamanho * 0.15}
                    textAnchor="middle"
                    fill="black"
                >
                    {name}
                </text>
            </svg>

            {showComando && (
                <JanelaComando
                    nome={name}
                    onFechar={handleCloseComando}
                />
            )}
        </>
    );
};

export default Disjuntor;
