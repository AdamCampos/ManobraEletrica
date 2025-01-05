import React, { useState, useContext, useEffect } from 'react';
import { SistemaContext } from '../ContextoSistema';
import JanelaComando from './JanelaComando';
import '../assets/css/disjuntor.css';

const Disjuntor = ({
    id,
    name,
    estado = 'inativo',
    position,
    escala = 1,
    onDragEnd,
    painelSize,
    orientacao = 'horizontal',
    onEstadoAlterado,
}) => {
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
        }
    }, [painelSize, tamanho]);

    const handleMouseDown = (e) => {
        if (modo !== 'Edição') return;
        e.stopPropagation();

        const offset = {
            x: e.clientX - x,
            y: e.clientY - y,
        };

        setIsDragging(true);
        setDragOffset(offset);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, dragLimits.maxX));
        const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, dragLimits.maxY));

        const newPosition = { x: newX, y: newY };

        if (onDragEnd) {
            onDragEnd(id, newPosition); // Notifica o Painel sobre a nova posição
        }
    };

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            console.log(`[Disjuntor - ${id}] Final do drag -> top: ${y}, left: ${x}`);
        }
    };

    const handleClick = (e) => {
        e.stopPropagation();
        if (!isDragging && modo === 'Operação') {
            setShowComando(true);
        }
    };

    const handleCloseComando = () => {
        setShowComando(false);
    };

    const isVerticalLine =
        (orientacao === 'horizontal' && (estado === 'aberto' || estado === 'inativo')) ||
        (orientacao === 'vertical' && estado === 'fechado');

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
                    x1={isVerticalLine ? tamanho * 0.5 : tamanho * 0.1}
                    y1={isVerticalLine ? tamanho * 0.1 : tamanho * 0.5}
                    x2={isVerticalLine ? tamanho * 0.5 : tamanho * 0.9}
                    y2={isVerticalLine ? tamanho * 0.9 : tamanho * 0.5}
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
                    status={estado}
                    position={{ x: x + 20, y: y + 20 }}
                    onEstadoAlterado={(novoEstado) => {
                        if (onEstadoAlterado) onEstadoAlterado(novoEstado);
                        setShowComando(false);
                    }}
                    onFechar={handleCloseComando}
                />
            )}
        </>
    );
};

export default Disjuntor;
