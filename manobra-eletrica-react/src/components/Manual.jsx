// src/components/Manual.js
import React from 'react';

const Manual = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Manual do Sistema</h1>
            <p><strong>1. Inicialização da Planilha:</strong> O sistema executa a macro <code>Load_Var</code> ao abrir o arquivo, inicializando variáveis e configurações.</p>
            <p><strong>2. Gerenciamento de Formulários:</strong></p>
            <ul>
                <li><strong>Form_DJIN:</strong> Gerencia disjuntores, permitindo abri-los ou fechá-los e exibindo informações relevantes.</li>
                <li><strong>Form_Fonte:</strong> Controla fontes de energia, permitindo ligá-las ou desligá-las.</li>
                <li><strong>Form_PM:</strong> Gerencia permissivos de paralelismo momentâneo.</li>
            </ul>
            <p><strong>3. Controle de Operações:</strong></p>
            <ul>
                <li>Abrir/Fechar disjuntores com atualizações visuais e validações específicas.</li>
                <li>Ligar/Desligar fontes com atualização de status e cores.</li>
                <li>Gerenciamento de paralelismo para sincronismo entre elementos.</li>
            </ul>
            <p><strong>4. Atualização de Estado:</strong> A função <code>AtualizaDesign</code> gerencia a aparência visual de disjuntores e barras.</p>
            <p><strong>5. Lógica por Barras (PN):</strong> Cada módulo (e.g., PN3001) controla estados de sincronismo e paralelismo.</p>
        </div>
    );
};

export default Manual;
