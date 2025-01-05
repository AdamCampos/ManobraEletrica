import React from 'react';

const Barra = ({ tag, numNos, estado, orientacao, escala, posicao }) => {
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

    // Calcula os pontos de ancoragem
    const calcularPontos = (numNos, orientacao, largura, altura) => {
        const pontos = [];
        if (numNos > 1) {
            for (let i = 0; i < numNos; i++) {
                const posicao = (100 / (numNos - 1)) * i; // Equidistante entre 0% e 100%
                if (orientacao === 'horizontal') {
                    pontos.push({ x: (largura * posicao) / 100, y: altura / 2 });
                } else {
                    pontos.push({ x: largura / 2, y: (altura * posicao) / 100 });
                }
            }
        }
        return pontos;
    };

    const largura = orientacao === 'horizontal' ? 800 : 10 * escala;
    const altura = orientacao === 'horizontal' ? 10 * escala : 800;
    const strokeWidth = 10 * escala; // Espessura da barra principal
    const tamanhoCruz = Math.max(20 * escala, strokeWidth * 2); // Garantir que a cruz ultrapasse a barra

    // Ajuste o espaço total do SVG para considerar a altura e largura da cruz
    const svgLargura = largura + tamanhoCruz;
    const svgAltura = altura + tamanhoCruz;

    const pontos = calcularPontos(numNos, orientacao, largura, altura);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={`${svgLargura}px`}
            height={`${svgAltura}px`}
            style={{
                position: 'absolute',
                top: posicao.topo,
                left: posicao.esquerda,
            }}
        >
            {/* Linha principal */}
            <line
                x1={orientacao === 'horizontal' ? tamanhoCruz / 2 : svgLargura / 2}
                y1={orientacao === 'horizontal' ? svgAltura / 2 : tamanhoCruz / 2}
                x2={orientacao === 'horizontal' ? largura + tamanhoCruz / 2 : svgLargura / 2}
                y2={orientacao === 'horizontal' ? svgAltura / 2 : altura + tamanhoCruz / 2}
                stroke={getCorEstado(estado)}
                strokeWidth={strokeWidth}
            />
            {/* Pontos de ancoragem como cruz */}
            {pontos.map((ponto, index) => (
                <g key={index}>
                    {/* Linha horizontal da cruz */}
                    <line
                        x1={ponto.x - tamanhoCruz / 2 + tamanhoCruz / 2}
                        y1={ponto.y + tamanhoCruz / 2}
                        x2={ponto.x + tamanhoCruz / 2 + tamanhoCruz / 2}
                        y2={ponto.y + tamanhoCruz / 2}
                        stroke="blue"
                        strokeWidth={2}
                    />
                    {/* Linha vertical da cruz */}
                    <line
                        x1={ponto.x + tamanhoCruz / 2}
                        y1={ponto.y - tamanhoCruz / 2 + tamanhoCruz / 2}
                        x2={ponto.x + tamanhoCruz / 2}
                        y2={ponto.y + tamanhoCruz / 2 + tamanhoCruz / 2}
                        stroke="blue"
                        strokeWidth={2}
                    />
                </g>
            ))}
            {/* Tag */}
            <text
                x={orientacao === 'horizontal' ? svgLargura / 2 : tamanhoCruz / 2}
                y={orientacao === 'horizontal' ? tamanhoCruz / 2 : svgAltura / 2}
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