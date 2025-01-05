import React, { useState } from 'react';

const JanelaComando = ({ nome, status, position, onAcaoSelecionada, onFechar }) => {
    const [dragPosition, setDragPosition] = useState(position || { x: 100, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

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
            <p>Status Atual: <strong>{status}</strong></p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button
                    style={{
                        backgroundColor: 'green',
                        color: '#fff',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                    onClick={() => onAcaoSelecionada('abrir')}
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
                        cursor: 'pointer',
                    }}
                    onClick={() => onAcaoSelecionada('fechar')}
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
