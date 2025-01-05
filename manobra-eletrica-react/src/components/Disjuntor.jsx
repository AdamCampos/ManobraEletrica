import React, { useState, useContext, useEffect } from 'react';
import { SistemaContext } from '../ContextoSistema';
import JanelaComando from './JanelaComando'; // Certifique-se de que a JanelaComando esteja importada
import '../assets/css/disjuntor.css';

const Disjuntor = ({ id, name, estado = 'inativo', position, escala = 1, onDragEnd, painelSize }) => {
    const { modo } = useContext(SistemaContext); // Verifica o modo atual (Edição/Operação)
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Estado para o deslocamento do drag
    const [showComando, setShowComando] = useState(false); // Controla a exibição do painel de comandos

    const { x = 0, y = 0 } = position || {};
    const tamanho = 59.5 * 0.5 * escala; // Dimensões ajustadas pela escala

    const [dragLimits, setDragLimits] = useState({
        maxX: painelSize?.width - tamanho,
        maxY: painelSize?.height - tamanho,
    });

    // Atualiza os limites de drag ao redimensionar o painel
    useEffect(() => {
        setDragLimits({
            maxX: painelSize?.width - tamanho,
            maxY: painelSize?.height - tamanho,
        });
    }, [painelSize, tamanho]);

    // Início do drag
    const handleMouseDown = (e) => {
        if (modo !== 'Edição') return; // Drag permitido apenas em modo Edição
        e.stopPropagation();
        setIsDragging(true); // Inicia o estado de drag
        setDragOffset({
            x: e.clientX - x,
            y: e.clientY - y, // Calcula o deslocamento inicial
        });

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        console.log(`[Disjuntor - ${id}] Início do drag.`);
    };

    // Durante o drag
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const newPosition = {
            x: Math.max(0, Math.min(e.clientX - dragOffset.x, dragLimits.maxX)), // Limita o movimento à direita
            y: Math.max(0, Math.min(e.clientY - dragOffset.y, dragLimits.maxY)), // Limita o movimento para baixo
        };

        console.log(`[Disjuntor - ${id}] Durante o drag. Nova posição: ${JSON.stringify(newPosition)}`);
        if (onDragEnd) onDragEnd(id, newPosition); // Notifica o pai sobre a nova posição
    };

    // Fim do drag
    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false); // Finaliza o estado de drag
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            console.log(`[Disjuntor - ${id}] Fim do drag.`);
        }
    };

    // Clique no disjuntor
    const handleClick = (e) => {
        e.stopPropagation();
        if (!isDragging && modo === 'Operação') {
            console.log(`[Disjuntor - ${id}] Clique capturado. Abrindo JanelaComando.`);
            setShowComando(true); // Abre o painel de comandos
        }
    };

    // Fechar o painel de comandos
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
                    zIndex: 10, // Garante prioridade no clique
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

            {/* JanelaComando */}
            {showComando && (
                <JanelaComando
                    nome={name}
                    onFechar={handleCloseComando} // Fecha o painel de comandos
                />
            )}
        </>
    );
};

export default Disjuntor;
