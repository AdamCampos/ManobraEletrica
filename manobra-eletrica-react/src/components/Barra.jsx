import React from 'react';

const Barra = ({ tag, pontos, estado }) => {
    const getCorEstado = (estado) => {
        switch (estado) {
            case 'energizado':
                return 'red';
            case 'desenergizado':
                return 'green';
            case 'desativado':
                return 'gray';
            default:
                return 'black';
        }
    };

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="50"
            style={{ position: 'absolute', top: '250px' }}
        >
            {/* Linha principal da barra */}
            <line
                x1="10"
                y1="25"
                x2="90%"
                y2="25"
                stroke={getCorEstado(estado)}
                strokeWidth="10"
            />
            {/* Pontos de ancoragem */}
            {pontos.map((ponto, index) => (
                <circle
                    key={index}
                    cx={ponto.x}
                    cy={ponto.y}
                    r="5"
                    fill="blue"
                />
            ))}
            {/* Tag da barra */}
            <text
                x="50%"
                y="10"
                fontSize="14"
                textAnchor="middle"
                fill="black"
            >
                {tag}
            </text>
        </svg>
    );
};

export default Barra;
