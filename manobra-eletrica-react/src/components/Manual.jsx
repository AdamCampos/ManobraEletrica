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

            <h2>Glossário</h2>
            <dl>
                <dt><strong>CDC</strong></dt>
                <dd>Centro de Controle de Distribuição, responsável pela gestão e controle de energia em uma instalação elétrica.</dd>

                <dt><strong>Carga</strong></dt>
                <dd>Equipamentos ou sistemas que consomem energia elétrica em uma instalação.</dd>

                <dt><strong>Demarrador</strong></dt>
                <dd>Dispositivo usado para controlar a partida de motores elétricos, reduzindo tensões e correntes excessivas no momento da inicialização.</dd>

                <dt><strong>Disjuntor</strong></dt>
                <dd>Equipamento de proteção que desliga automaticamente o circuito em casos de sobrecarga ou curto-circuito.</dd>

                <dt><strong>Gerador</strong></dt>
                <dd>Equipamento que converte energia mecânica em energia elétrica, geralmente utilizado como fonte principal ou de emergência.</dd>

                <dt><strong>Paralelismo</strong></dt>
                <dd>Processo de conectar duas ou mais fontes de energia, como geradores, para operarem simultaneamente em um sistema elétrico.</dd>

                <dt><strong>Sincronismo</strong></dt>
                <dd>Ajuste das características de frequência, tensão e fase entre fontes de energia antes de conectá-las ao mesmo sistema.</dd>

                <dt><strong>Switchgear</strong></dt>
                <dd>Equipamento que agrupa dispositivos de proteção, controle e medição de circuitos elétricos em um único painel.</dd>

                <dt><strong>Barra</strong></dt>
                <dd>Conexão elétrica que distribui energia entre diferentes circuitos em uma instalação.</dd>

                <dt><strong>CCM</strong></dt>
                <dd>Centro de Controle de Motores, um painel que centraliza os controles e proteções de motores elétricos.</dd>

                <dt><strong>Contactor</strong></dt>
                <dd>Dispositivo eletromecânico utilizado para conectar e desconectar circuitos elétricos de forma remota.</dd>
            </dl>

            <h2>Notas Gerais</h2>
            <ol>
                <li>Operação paralela entre enrolamentos secundários e/ou terciários de transformadores só é permitida para transferência momentânea de carga, com intertravamentos para evitar operação contínua.</li>
                <li>O intertravamento permite apenas dois disjuntores (52-A, 52-B ou 52-C) fechados simultaneamente, exceto em operações momentâneas.</li>
                <li>Operação contínua entre geradores auxiliares e principais é permitida somente com sincronismo garantido.</li>
                <li>Geradores de emergência podem operar continuamente com transformadores secundários/terciários sob regras específicas.</li>
                <li>Operação paralela entre geradores auxiliares e de emergência é permitida somente para transferência momentânea de carga.</li>
                <li>Disjuntores secundários e terciários de transformadores principais abrem automaticamente quando os primários abrem.</li>
                <li>Critério de dimensionamento para reatores limitadores é de 25kA simétrico.</li>
                <li>Tolerâncias específicas para reatâncias transitórias saturadas e curtas em geradores principais e auxiliares.</li>
                <li>Configurações de disjuntores para diferentes condições de operação, com lógica de restauração manual ou automática.</li>
                <li>Disjuntores devem possuir relés de verificação de sincronismo para evitar fechamentos fora de sincronia.</li>
                <li>Todos os MCCs de baixa tensão devem ter dispositivos de monitoramento de isolamento (IMD).</li>
                <li>Sistema de aterramento para diferentes tensões especificado por normas internacionais.</li>
                <li>Limitações de curto-circuito devem ser respeitadas para painéis e MCCs.</li>
                <li>Os transformadores devem ser equipados com sistemas de pré-magnetização para reduzir correntes de partida.</li>
                <li>Geradores auxiliares podem operar continuamente sob baixa demanda de energia.</li>
                <li>Painéis de distribuição devem incluir ventilação forçada para transformadores com resfriamento a ar (AF).</li>
                <li>Testes de sincronismo devem ser realizados antes de qualquer operação de paralelismo contínuo.</li>
                <li>Relés de proteção devem ser configurados de acordo com a norma IEC 61850.</li>
                <li>Transformadores devem operar dentro das tolerâncias especificadas para evitar sobreaquecimento.</li>
                <li>Sistemas de proteção contra surto devem ser instalados em todas as entradas de alimentação.</li>
                <li>Equipamentos críticos devem ser protegidos contra falhas de isolamento.</li>
                <li>Intertravamentos manuais e automáticos devem ser testados periodicamente.</li>
                <li>Aterramento redundante deve ser aplicado em áreas de alta sensibilidade elétrica.</li>
                <li>Disjuntores de baixa tensão devem ser equipados com relés de proteção contra sobrecarga.</li>
                <li>Reatores limitadores devem ser inspecionados para desgastes a cada seis meses.</li>
                <li>Sistemas de backup de energia devem ser testados semanalmente para garantir confiabilidade.</li>
                <li>Transformadores com resfriamento a óleo devem ser equipados com sensores de temperatura para evitar falhas térmicas.</li>
                <li>Painéis de controle devem ser acessíveis apenas a pessoal autorizado.</li>
                <li>Relatórios de manutenção devem ser arquivados por pelo menos cinco anos.</li>
                <li>Sistemas de alarme devem ser configurados para alertar falhas antes de interrupções críticas.</li>
                <li>Manutenções preventivas devem seguir o cronograma estabelecido pelo fabricante.</li>
                <li>Qualquer modificação no sistema deve ser aprovada por engenheiros responsáveis.</li>
                <li>Os protocolos de segurança elétrica devem ser atualizados anualmente.</li>
                <li>Todos os funcionários devem receber treinamento anual em operação e manutenção do sistema.</li>
            </ol>
        </div>
    );
};

export default Manual;
