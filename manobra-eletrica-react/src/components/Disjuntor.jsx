import React, { useState } from 'react';

const Disjuntor = ({ id, name, estado, onAcaoSelecionada }) => {
    const [mostrarJanela, setMostrarJanela] = useState(false);
    const [janelaPosition, setJanelaPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleClick = (e) => {
        setJanelaPosition({ x: e.clientX, y: e.clientY });
        setMostrarJanela(true);
    };

    const fecharJanela = () => {
        setMostrarJanela(false);
    };

    const getFillColor = (estado) => {
        switch (estado) {
            case 'aberto':
                return 'green';
            case 'fechado':
                return 'red';
            case 'falha':
                return 'yellow';
            default:
                return 'white';
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setOffset({
            x: e.clientX - janelaPosition.x,
            y: e.clientY - janelaPosition.y,
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setJanelaPosition({
            x: e.clientX - offset.x,
            y: e.clientY - offset.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100"
                height="100"
                onClick={handleClick}
                style={{ cursor: 'pointer' }}
            >
                {/* Corpo do disjuntor */}
                <rect
                    x="10"
                    y="10"
                    width="80"
                    height="80"
                    fill={getFillColor(estado)}
                    stroke="black"
                    strokeWidth="2"
                />
                {/* Linha central */}
                <line x1="10" y1="50" x2="90" y2="50" stroke="gray" strokeWidth="2" />
                {/* Pontos de ancoragem */}
                <circle cx="10" cy="50" r="5" fill="blue" />
                <circle cx="90" cy="50" r="5" fill="blue" />
                {/* Nome do disjuntor */}
                <text
                    x="50"
                    y="95"
                    fontSize="12"
                    textAnchor="middle"
                >
                    {name}
                </text>
            </svg>
            {mostrarJanela && (
                <div
                    style={{
                        position: 'absolute',
                        top: `${janelaPosition.y}px`,
                        left: `${janelaPosition.x}px`,
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
                    <h3>Controle do {name}</h3>
                    <p>Status Atual: <strong>{estado}</strong></p>
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
                            onClick={() => {
                                onAcaoSelecionada('abrir');
                                fecharJanela();
                            }}
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
                            onClick={() => {
                                onAcaoSelecionada('fechar');
                                fecharJanela();
                            }}
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
                            onClick={fecharJanela}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Disjuntor;
