import React, { useState, useEffect } from 'react';

const Disjuntor = ({ id, name, estado, escala = 1, initialPosition, onDragEnd }) => {
    const [position, setPosition] = useState(initialPosition || { x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (initialPosition) {
            setPosition(initialPosition);
        }
    }, [initialPosition]);

    const handleMouseDown = (e) => {
        e.stopPropagation(); // Evita que o evento atinja o painel
        setIsDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - offset.x,
            y: e.clientY - offset.y,
        });
    };

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
            if (onDragEnd) {
                onDragEnd(id, position);
            }
        }

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const tamanho = 100 * escala;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={`${tamanho}px`}
            height={`${tamanho}px`}
            style={{
                position: 'absolute',
                top: `${position.y}px`,
                left: `${position.x}px`,
                cursor: isDragging ? 'grabbing' : 'grab',
                zIndex: 2, // Garantir que o disjuntor esteja acima do painel
            }}
            onMouseDown={handleMouseDown}
        >
            <rect
                x={10 * escala}
                y={10 * escala}
                width={80 * escala}
                height={80 * escala}
                fill={estado === 'aberto' ? 'green' : 'red'}
                stroke="black"
                strokeWidth={2 * escala}
            />
            <line
                x1={10 * escala}
                y1={50 * escala}
                x2={90 * escala}
                y2={50 * escala}
                stroke="gray"
                strokeWidth={2 * escala}
            />
            <circle cx={10 * escala} cy={50 * escala} r={5 * escala} fill="blue" />
            <circle cx={90 * escala} cy={50 * escala} r={5 * escala} fill="blue" />
            <text
                x={50 * escala}
                y={95 * escala}
                fontSize={12 * escala}
                textAnchor="middle"
            >
                {name}
            </text>
        </svg>
    );
};

export default Disjuntor;
