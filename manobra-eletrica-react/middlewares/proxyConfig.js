const { createProxyMiddleware } = require('http-proxy-middleware');

const configureProxy = (app) => {
    app.use(
        '/Controllogix', // Todas as requisições que começam com /Controllogix serão redirecionadas
        createProxyMiddleware({
            target: 'https://localhost:8385', // URL do backend Tomcat
            changeOrigin: true, // Necessário para CORS
            pathRewrite: { '^/Controllogix': '' }, // Remove o prefixo da rota antes de passar para o backend
            secure: false, // Aceita certificados autoassinados
        })
    );
};

module.exports = configureProxy;
