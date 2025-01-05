import React, { useState, useEffect, useContext } from 'react';
import Disjuntor from './Disjuntor';
import Barra from './Barra';
import JanelaComando from './JanelaComando';
import { SistemaContext } from '../ContextoSistema';
import '../assets/css/painel.css';

const Painel = ({ id, nome, altura, largura, topo, esquerda, numDisjuntores, escalaDisjuntores, barra }) => {
    const { modo } = useContext(SistemaContext);
    const [position, setPosition] = useState({ top: topo, left: esquerda });
    const [size, setSize] = useState({ width: largura, height: altura });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [disjuntores, setDisjuntores] = useState([]);
    const [disjuntorSelecionado, setDisjuntorSelecionado] = useState(null);

    useEffect(() => {
        // Calcula as posições iniciais dos disjuntores
        const espacamentoX = largura / (numDisjuntores + 1);
        const centroY = altura / 2;
        const initialDisjuntores = Array.from({ length: numDisjuntores }, (_, i) => ({
            id: `${id}-disjuntor-${i}`,
            name: `Disjuntor ${i + 1}`,
            position: { x: espacamentoX * (i + 1), y: centroY },
            estado: 'aberto',
        }));
        setDisjuntores(initialDisjuntores);
        logPainelInfo('Inicialização dos disjuntores');
    }, [id, largura, altura, numDisjuntores]);

    const logPainelInfo = (action) => {
        console.log(
            `[${nome}] ${action}: Position -> top: ${position.top}, left: ${position.left}, Size -> width: ${size.width}, height: ${size.height}`
        );
        console.log(`[${nome}] Disjuntores:`, disjuntores.map((d) => ({ id: d.id, name: d.name, position: d.position })));
    };

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
        logPainelInfo('Início do drag');
    };

    const handleMouseMoveDrag = (e) => {
        if (!isDragging) return;
        const newPosition = {
            top: e.clientY - dragOffset.y,
            left: Math.min(Math.max(e.clientX - dragOffset.x, 0), window.innerWidth - size.width),
        };
        setPosition(newPosition);
        logPainelInfo('Movimento durante drag');
    };

    const handleMouseUpDrag = () => {
        if (isDragging) {
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMoveDrag);
            document.removeEventListener('mouseup', handleMouseUpDrag);
            logPainelInfo('Final do drag');
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
            if (direction.includes('left')) {
                newWidth = Math.max(initialWidth - deltaX, 100);
                newLeft = Math.min(initialLeft + deltaX, window.innerWidth - newWidth);
            }
            if (direction.includes('bottom')) {
                newHeight = Math.max(initialHeight + deltaY, 100);
            }
            if (direction.includes('top')) {
                newHeight = Math.max(initialHeight - deltaY, 100);
                newTop = Math.max(initialTop + deltaY, 0);
            }

            if (isResizeValid(newWidth, newHeight)) {
                setSize({ width: newWidth, height: newHeight });
                setPosition({ top: newTop, left: newLeft });
                logPainelInfo('Ajuste durante redimensionamento');
            } else {
                console.log(`[${nome}] Redimensionamento bloqueado: filhos fora dos limites.`);
            }
        };

        const handleMouseUpResize = () => {
            document.removeEventListener('mousemove', handleMouseMoveResize);
            document.removeEventListener('mouseup', handleMouseUpResize);
            logPainelInfo('Final do redimensionamento');
        };

        document.addEventListener('mousemove', handleMouseMoveResize);
        document.addEventListener('mouseup', handleMouseUpResize);
    };

    const isResizeValid = (newWidth, newHeight) => {
        const childDimensions = calculateChildDimensions();
        return childDimensions.every((child) => {
            const childRight = child.x + (child.width || 0);
            const childBottom = child.y + (child.height || 0);
            return (
                child.x >= position.left &&
                childRight <= position.left + newWidth &&
                child.y >= position.top &&
                childBottom <= position.top + newHeight
            );
        });
    };

    const calculateChildDimensions = () => {
        return disjuntores.map((disjuntor) => ({
            id: disjuntor.id,
            x: position.left + disjuntor.position.x,
            y: position.top + disjuntor.position.y,
            width: escalaDisjuntores * 100, // Largura do disjuntor (por exemplo)
            height: escalaDisjuntores * 100, // Altura do disjuntor (por exemplo)
        }));
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
            <Barra
                tag={barra?.tag || 'Barra Principal'}
                numNos={1}
                estado={barra?.estado || 'desativado'}
                orientacao={barra?.orientacao || 'horizontal'}
                escala={barra?.escala || 1}
                posicao={{ topo: '50%', esquerda: '0%' }}
            />
            {disjuntores.map((disjuntor) => (
                <Disjuntor
                    key={disjuntor.id}
                    id={disjuntor.id}
                    name={disjuntor.name}
                    estado={disjuntor.estado}
                    position={disjuntor.position}
                    escala={escalaDisjuntores}
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
