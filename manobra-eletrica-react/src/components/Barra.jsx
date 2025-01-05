import React, { useState, useEffect, useContext } from 'react';
import { SistemaContext } from '../ContextoSistema';
import '../assets/css/barra.css';

const Barra = ({ tag, numNos, orientacao, escala, posicao, painelWidth }) => {
    const { modo } = useContext(SistemaContext); // Obtém o estado do contexto
    const [barraPosition, setBarraPosition] = useState({ top: posicao?.topo || 0, left: posicao?.esquerda || 0 });
    const [barraSize, setBarraSize] = useState({
        width: orientacao === 'horizontal' && painelWidth ? painelWidth * 0.9 : 10 * escala,
        height: orientacao === 'horizontal' ? 10 * escala : painelWidth ? painelWidth * 0.9 : 800,
    });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (painelWidth && !isNaN(painelWidth)) {
            setBarraSize((prevSize) => ({
                ...prevSize,
                width: orientacao === 'horizontal' ? painelWidth * 0.9 : prevSize.width,
                height: orientacao === 'vertical' ? painelWidth * 0.9 : prevSize.height,
            }));
        } else {
            console.warn('Valor inválido para painelWidth:', painelWidth);
        }
    }, [painelWidth, orientacao]);

    const getCorEstado = (modo) => {
        switch (modo) {
            case 'Operação':
                return 'red';
            case 'Edição':
                return 'gray';
            default:
                return 'green';
        }
    };

    const handleMouseDownDrag = (e) => {
        if (modo !== 'Edição') return;
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - barraPosition.left,
            y: e.clientY - barraPosition.top,
        });

        document.addEventListener('mousemove', handleMouseMoveDrag);
        document.addEventListener('mouseup', handleMouseUpDrag);
    };

    const handleMouseMoveDrag = (e) => {
        if (!isDragging) return;
        setBarraPosition({
            top: e.clientY - dragOffset.y,
            left: e.clientX - dragOffset.x,
        });
    };

    const handleMouseUpDrag = () => {
        if (isDragging) {
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMoveDrag);
            document.removeEventListener('mouseup', handleMouseUpDrag);
        }
    };

    const calcularPontos = (numNos, orientacao, largura, altura) => {
        if (!numNos || numNos < 1 || isNaN(largura) || isNaN(altura)) {
            console.warn('Valores inválidos para numNos, largura ou altura:', numNos, largura, altura);
            return [];
        }

        const pontos = [];
        for (let i = 0; i < numNos; i++) {
            const posicao = (100 / (numNos - 1)) * i;
            if (orientacao === 'horizontal') {
                pontos.push({ x: (largura * posicao) / 100, y: altura / 2 });
            } else {
                pontos.push({ x: largura / 2, y: (altura * posicao) / 100 });
            }
        }
        return pontos;
    };

    const pontos = calcularPontos(numNos, orientacao, barraSize.width || 0, barraSize.height || 0);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="barra-svg"
            style={{
                top: `${barraPosition.top}px`,
                left: `${barraPosition.left}px`,
                width: `${barraSize.width || 100}px`,
                height: `${barraSize.height || 100}px`,
                position: 'absolute',
                cursor: modo === 'Edição' ? 'move' : 'default',
            }}
            onMouseDown={handleMouseDownDrag}
        >
            {/* Nome da barra */}
            <text
                className="barra-nome"
                x={orientacao === 'horizontal' ? barraSize.width / 2 || 10 : 10}
                y={-10} // Um pouco acima do ponto mais à esquerda
            >
                {tag}
            </text>
            {/* Linha principal */}
            <line
                className="barra-linha"
                x1={orientacao === 'horizontal' ? 0 : barraSize.width / 2 || 0}
                y1={orientacao === 'horizontal' ? barraSize.height / 2 || 0 : 0}
                x2={orientacao === 'horizontal' ? barraSize.width || 0 : barraSize.width / 2 || 0}
                y2={orientacao === 'horizontal' ? barraSize.height / 2 || 0 : barraSize.height || 0}
                stroke={getCorEstado(modo)}
                strokeWidth={10 * escala}
            />
            {/* Pontos de ancoragem */}
            {pontos.map((ponto, index) => (
                <circle
                    key={index}
                    cx={ponto.x || 0}
                    cy={ponto.y || 0}
                    r={3}
                    fill="blue"
                    className="barra-ponto"
                />
            ))}
        </svg>
    );
};

export default Barra;
