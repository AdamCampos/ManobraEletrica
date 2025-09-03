import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SistemaProvider } from './ContextoSistema'; // Certifique-se que a importação é nomeada
import Manual from './components/Manual';
import Sistema from './components/Sistema';
import Diagrama from './components/Diagrama'

const App = () => {
    return (
        <SistemaProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Sistema />} />
                    <Route path="/manual" element={<Manual />} />
                    <Route path="/diagrama" element={<Diagrama />} />
                </Routes>
            </Router>
        </SistemaProvider>
    );
};

export default App;
