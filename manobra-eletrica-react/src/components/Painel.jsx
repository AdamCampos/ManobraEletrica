import React, { useState, useEffect, useContext } from 'react';
import Disjuntor from './Disjuntor';
import Barra from './Barra';
import { SistemaContext } from '../ContextoSistema';
import '../assets/css/painel.css';

const Painel = ({ id, nome, altura, largura, topo, esquerda, numDisjuntores, escalaDisjuntores, barra }) => {
    const { modo } = useContext(SistemaContext);
    const [position, setPosition] = useState({ top: topo || 0, left: esquerda || 0 });
    const [size, setSize] = useState({ width: largura || 100, height: altura || 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [disjuntores, setDisjuntores] = useState([]);

    useEffect(() => {
        const espacamentoX = largura / (numDisjuntores + 1);
        const centroY = altura / 2;
        const initialDisjuntores = Array.from({ length: numDisjuntores }, (_, i) => ({
            id: `${id}-disjuntor-${i}`,
            name: `Disjuntor ${i + 1}`,
            position: { x: espacamentoX * (i + 1), y: centroY },
            estado: 'aberto',
        }));
        setDisjuntores(initialDisjuntores);
        console.log(`[Painel ${id}] Disjuntores inicializados.`);
    }, [id, largura, altura, numDisjuntores]);

    const handleMouseDownDrag = (e) => {
        if (modo !== 'Edição') return;
        if (e.target.closest('.disjuntor') || e.target.closest('.resize-handle')) return;
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - position.left,
            y: e.clientY - position.top,
        });
        document.addEventListener('mousemove', handleMouseMoveDrag);
        document.addEventListener('mouseup', handleMouseUpDrag);
    };

    const handleMouseMoveDrag = (e) => {
        if (!isDragging) return;
        const newPosition = {
            top: Math.max(0, e.clientY - dragOffset.y),
            left: Math.max(0, e.clientX - dragOffset.x),
        };
        setPosition(newPosition);
        console.log(`[Painel ${id}] Movendo: nova posição -> top: ${newPosition.top}, left: ${newPosition.left}`);
    };

    const handleMouseUpDrag = () => {
        if (isDragging) {
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMoveDrag);
            document.removeEventListener('mouseup', handleMouseUpDrag);
            console.log(`[Painel ${id}] Movimento finalizado.`);
        }
    };

    const handleMouseDownResize = (e, direction) => {
        if (modo !== 'Edição') return;
        e.stopPropagation();

        const initialWidth = size.width;
        const initialHeight = size.height;
        const initialLeft = position.left;
        const initialTop = position.top;

        const handleMouseMoveResize = (event) => {
            const deltaX = event.clientX - e.clientX;
            const deltaY = event.clientY - e.clientY;

            let newWidth = initialWidth;
            let newHeight = initialHeight;
            let newLeft = initialLeft;
            let newTop = initialTop;

            if (direction.includes('right')) {
                newWidth = Math.max(initialWidth + deltaX, 100);
            }
            if (direction.includes('bottom')) {
                newHeight = Math.max(initialHeight + deltaY, 100);
            }
            if (direction.includes('left')) {
                const adjustedDeltaX = Math.min(deltaX, initialWidth - 100);
                newWidth = initialWidth - adjustedDeltaX;
                newLeft = initialLeft + adjustedDeltaX;
                newLeft = Math.max(newLeft, 0);
            }
            if (direction.includes('top')) {
                const adjustedDeltaY = Math.min(deltaY, initialHeight - 100);
                newHeight = initialHeight - adjustedDeltaY;
                newTop = initialTop + adjustedDeltaY;
                newTop = Math.max(newTop, 0);
            }

            if (isResizeValid(newWidth, newHeight, newLeft, newTop)) {
                setSize({ width: newWidth, height: newHeight });
                setPosition({ top: newTop, left: newLeft });
                console.log(`[Painel ${id}] Redimensionando -> Nova posição: top=${newTop}, left=${newLeft}, width=${newWidth}, height=${newHeight}`);
            } else {
                console.log(`[Painel ${id}] Redimensionamento bloqueado: filhos fora dos limites.`);
            }
        };

        const handleMouseUpResize = () => {
            document.removeEventListener('mousemove', handleMouseMoveResize);
            document.removeEventListener('mouseup', handleMouseUpResize);
        };

        document.addEventListener('mousemove', handleMouseMoveResize);
        document.addEventListener('mouseup', handleMouseUpResize);
    };

    const isResizeValid = (newWidth, newHeight, newLeft, newTop) => {
        return disjuntores.every((disjuntor) => {
            const disjuntorX = newLeft + disjuntor.position.x;
            const disjuntorY = newTop + disjuntor.position.y;

            // Verifica se os disjuntores estão dentro dos novos limites
            return (
                disjuntorX >= newLeft &&
                disjuntorX + escalaDisjuntores * 50 <= newLeft + newWidth &&
                disjuntorY >= newTop &&
                disjuntorY + escalaDisjuntores * 50 <= newTop + newHeight
            );
        });
    };

    return (
        <div
            id={id}
            className={`painel-container ${modo === 'Edição' ? 'edicao' : 'operacao'}`}
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${size.width}px`,
                height: `${size.height}px`,
            }}
            onMouseDown={handleMouseDownDrag}
        >
            <h3 className="painel-titulo">{nome}</h3>
            {disjuntores.map((disjuntor) => (
                <Disjuntor
                    key={disjuntor.id}
                    id={disjuntor.id}
                    name={disjuntor.name}
                    estado={disjuntor.estado}
                    position={disjuntor.position}
                    escala={escalaDisjuntores}
                    onDragEnd={(id, newPosition) =>
                        setDisjuntores((prev) =>
                            prev.map((d) => (d.id === id ? { ...d, position: newPosition } : d))
                        )
                    }
                />
            ))}
            {modo === 'Edição' &&
                ['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
                    <div
                        key={corner}
                        className={`resize-handle ${corner}`}
                        onMouseDown={(e) => handleMouseDownResize(e, corner)}
                    ></div>
                ))}
        </div>
    );
};

export default Painel;
