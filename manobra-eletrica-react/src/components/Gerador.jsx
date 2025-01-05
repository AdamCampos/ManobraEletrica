// src/components/Generator.jsx
import React from 'react';

const Gerador = ({ name }) => {
    return (
        <div style={{ marginBottom: '20px' }}>
            <h3>{name}</h3>
            <p>Estado: Operando</p>
        </div>
    );
};

export default Gerador;
