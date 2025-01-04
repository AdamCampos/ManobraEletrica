const express = require('express');
const app = express();
const PORT = 8400;

// Middleware para contexto específico
app.use('/ManobraEletrica', (req, res, next) => {
    res.send('Bem-vindo ao contexto /ManobraEletrica');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando no contexto /ManobraEletrica na porta ${PORT}`);
});
