import React, { createContext, useState } from 'react';

// Criando o contexto
export const SistemaContext = createContext();

// Provedor do contexto
export const SistemaProvider = ({ children }) => {
    const [modo, setModo] = useState('Operação');

    return (
        <SistemaContext.Provider value={{ modo, setModo }}>
            {children}
        </SistemaContext.Provider>
    );
};
