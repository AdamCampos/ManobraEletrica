// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Manual from './components/Manual';
import Sistema from './components/Sistema';
import './assets/css/styles.css';

const App = () => {
    return (
        <Router>
            <nav className="app-nav">
                <Link to="/manual" className="app-link">Manual</Link>
                <Link to="/sistema" className="app-link">Sistema</Link>
            </nav>
            <Routes>
                <Route path="/manual" element={<Manual />} />
                <Route path="/sistema" element={<Sistema />} />
                <Route path="*" element={<div className="not-found"><h2>Página não encontrada</h2></div>} />
            </Routes>
        </Router>
    );
};

export default App;