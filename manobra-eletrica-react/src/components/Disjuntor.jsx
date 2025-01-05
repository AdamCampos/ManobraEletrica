import React, { useState } from 'react';
import '../assets/css/disjuntor.css';

const Disjuntor = ({ id, name, estado = 'inativo', position, escala, onDragEnd, onClick }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    // Garantir que a posição seja válida
    const { x = 0, y = 0 } = position || {};

    const handleMouseDown = (e) => {
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
            x: e.clientX - offset.x,
            y: e.clientY - offset.y,
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
        if (!isDragging && onClick) {
            onClick(id);
        }
    };

    const tamanho = 59.5; // Tamanho ajustado

    const estadoClass = `disjuntor-${estado}`;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={`${tamanho}px`}
            height={`${tamanho}px`}
            className={`disjuntor ${estadoClass}`}
            style={{
                position: 'absolute',
                top: `${y}px`,
                left: `${x}px`,
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={handleClick}
        >
            <rect x="5" y="5" width="50" height="50" />
            <line x1="5" y1="30" x2="55" y2="30" stroke="gray" strokeWidth="2" />
            <text x="30" y="55">{name}</text>
        </svg>
    );
};

export default Disjuntor;
