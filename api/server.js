require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

console.log("✅ Servidor iniciando...");

// Rota principal
app.get('/', (req, res) => {
    console.log("✅ Rota '/' acessada");
    res.send('🚀 API rodando no Railway! Use /auth para autenticação.');
});

// Rota de autenticação
app.get('/auth', (req, res) => {
    console.log("✅ Rota '/auth' acessada");
    const authUrl = `https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&state=12345`;
    res.redirect(authUrl);
});

// Callback do Bling
app.get('/auth/callback', async (req, res) => {
    console.log("✅ Rota '/auth/callback' acessada");
    res.send("Callback recebido!");
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

module.exports = app;
