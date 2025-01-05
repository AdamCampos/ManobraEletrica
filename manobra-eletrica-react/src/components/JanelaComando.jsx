import React, { useState, useEffect } from 'react';

const JanelaComando = ({ nome, status, position, onEstadoAlterado, onFechar }) => {
    const [dragPosition, setDragPosition] = useState(position || { x: 100, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [estadoAtual, setEstadoAtual] = useState(status);

    useEffect(() => {
        setEstadoAtual(status);
    }, [status]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setOffset({
            x: e.clientX - dragPosition.x,
            y: e.clientY - dragPosition.y,
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setDragPosition({
            x: e.clientX - offset.x,
            y: e.clientY - offset.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleComando = (comando) => {
        const novoEstado = comando === 'abrir' ? 'aberto' : 'fechado';
        setEstadoAtual(novoEstado);
        if (onEstadoAlterado) onEstadoAlterado(novoEstado);
    };

    return (
        <div
            style={{
                position: 'absolute',
                top: `${dragPosition.y}px`,
                left: `${dragPosition.x}px`,
                backgroundColor: '#fff',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                borderRadius: '10px',
                padding: '20px',
                zIndex: 1000,
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <h3>Controle do {nome}</h3>
            <p>Status Atual: <strong>{estadoAtual}</strong></p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button
                    style={{
                        backgroundColor: 'green',
                        color: '#fff',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: estadoAtual === 'fechado' ? 'pointer' : 'not-allowed',
                        opacity: estadoAtual === 'fechado' ? 1 : 0.5,
                    }}
                    disabled={estadoAtual !== 'fechado'}
                    onClick={() => handleComando('abrir')}
                >
                    Abrir
                </button>
                <button
                    style={{
                        backgroundColor: 'red',
                        color: '#fff',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: estadoAtual === 'aberto' ? 'pointer' : 'not-allowed',
                        opacity: estadoAtual === 'aberto' ? 1 : 0.5,
                    }}
                    disabled={estadoAtual !== 'aberto'}
                    onClick={() => handleComando('fechar')}
                >
                    Fechar
                </button>
                <button
                    style={{
                        backgroundColor: '#ccc',
                        color: '#000',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                    onClick={onFechar}
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default JanelaComando;
