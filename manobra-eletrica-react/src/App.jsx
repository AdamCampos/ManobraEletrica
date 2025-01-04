// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Manual from './components/Manual';
import Sistema from './components/Sistema';

const App = () => {
    return (
        <Router>
            <nav style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <Link to="/manual" style={{ margin: '10px' }}>Manual</Link>
                <Link to="/sistema" style={{ margin: '10px' }}>Sistema</Link>
            </nav>
            <Routes>
                <Route path="/manual" element={<Manual />} />
                <Route path="/sistema" element={<Sistema />} />
                <Route path="*" element={<div><h2>Página não encontrada</h2></div>} />
            </Routes>
        </Router>
    );
};

export default App;