import React, { useState } from 'react';
import Disjuntor from './Disjuntor';
import Barra from './Barra';

const Painel = ({ id, nome, altura, largura, topo, esquerda, numDisjuntores, escalaDisjuntores, barra }) => {
    const [position, setPosition] = useState({ top: topo, left: esquerda });
    const [size, setSize] = useState({ width: largura, height: altura });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleMouseDownDrag = (e) => {
        e.stopPropagation(); // Impede que clique no disjuntor inicie drag do painel
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
        setPosition({
            top: e.clientY - dragOffset.y,
            left: e.clientX - dragOffset.x,
        });
    };

    const handleMouseUpDrag = () => {
        if (isDragging) {
            console.log(`Painel ${id} movido para:`, position);
            setIsDragging(false);
        }
        document.removeEventListener('mousemove', handleMouseMoveDrag);
        document.removeEventListener('mouseup', handleMouseUpDrag);
    };

    const handleMouseDownResize = (e, direction) => {
        e.stopPropagation();
        setIsResizing(direction);

        document.addEventListener('mousemove', handleMouseMoveResize);
        document.addEventListener('mouseup', handleMouseUpResize);
    };

    const handleMouseMoveResize = (e) => {
        if (!isResizing) return;

        const newSize = { ...size };
        if (isResizing.includes('right')) {
            newSize.width = e.clientX - position.left;
        }
        if (isResizing.includes('bottom')) {
            newSize.height = e.clientY - position.top;
        }
        setSize(newSize);
    };

    const handleMouseUpResize = () => {
        if (isResizing) {
            console.log(`Painel ${id} redimensionado para:`, size);
            setIsResizing(false);
        }
        document.removeEventListener('mousemove', handleMouseMoveResize);
        document.removeEventListener('mouseup', handleMouseUpResize);
    };

    const calcularPosicoesIniciais = (numDisjuntores, largura, altura) => {
        const espacamentoX = largura / (numDisjuntores + 1);
        const centroY = altura / 2;
        return Array.from({ length: numDisjuntores }, (_, i) => ({
            x: espacamentoX * (i + 1),
            y: centroY,
        }));
    };

    const disjuntores = calcularPosicoesIniciais(numDisjuntores, size.width, size.height);

    return (
        <div
            id={id}
            style={{
                position: 'absolute',
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${size.width}px`,
                height: `${size.height}px`,
                border: '2px dashed gray',
                backgroundColor: '#f5f5f5',
                zIndex: 1,
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDownDrag}
        >
            <h3 style={{ textAlign: 'center', margin: '10px 0' }}>{nome}</h3>
            <Barra
                tag={barra?.tag || 'Barra Principal'}
                numNos={numDisjuntores + 2}
                estado={barra?.estado || 'desativado'}
                orientacao={barra?.orientacao || 'horizontal'}
                escala={barra?.escala || 1}
                posicao={{ topo: '50%', esquerda: '0%' }}
            />
            {disjuntores.map((posicao, index) => (
                <Disjuntor
                    key={`${id}-disjuntor-${index}`}
                    id={`${id}-disjuntor-${index}`}
                    name={`Disjuntor ${index + 1}`}
                    estado="aberto"
                    escala={escalaDisjuntores}
                    initialPosition={posicao}
                    onDragEnd={(id, novaPosicao) =>
                        console.log(`Disjuntor ${id} movido para:`, novaPosicao)
                    }
                />
            ))}

            {/* Alças de redimensionamento */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '10px',
                    height: '10px',
                    backgroundColor: 'blue',
                    zIndex: 2,
                    cursor: 'nwse-resize',
                }}
                onMouseDown={(e) => handleMouseDownResize(e, 'bottom-right')}
            ></div>
        </div>
    );
};

export default Painel;
