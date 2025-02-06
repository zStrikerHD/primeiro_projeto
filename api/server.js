require('dotenv').config();
const express = require('express');
const axios = require('axios').default;

const app = express();
const PORT = process.env.PORT || 3000;

console.log("🚀 Servidor iniciando...");
console.log("✅ PORT:", process.env.PORT);
console.log("✅ CLIENT_ID:", process.env.CLIENT_ID || "⚠️ Não definido!");
console.log("✅ CLIENT_SECRET:", process.env.CLIENT_SECRET ? "Definido" : "⚠️ Não definido!");
console.log("✅ REDIRECT_URI:", process.env.REDIRECT_URI || "⚠️ Não definido!");

app.get('/', (req, res) => {
    res.send('🚀 API rodando no Vercel! Use /auth para autenticação.');
});

// ✅ Redireciona para a autenticação no Bling
app.get('/auth', (req, res) => {
    const authUrl = `https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&state=12345`;
    console.log(`🔄 Redirecionando para autenticação no Bling...`);
    console.log(`🔗 URL de autenticação: ${authUrl}`);
    res.redirect(authUrl);
});

// ✅ Redireciona para a autenticação no Bling
app.get('/auth', (req, res) => {
    const authUrl = `https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&state=12345`;
    res.redirect(authUrl);
});

// ✅ Callback para capturar o código de autorização
app.get('/auth/callback', async (req, res) => {
    const authCode = req.query.code;
    console.log(`🔑 Código de autorização recebido: ${authCode || "⚠️ Não recebido!"}`);

    if (!authCode) {
        console.log("⚠️ Código de autorização ausente!");
        return res.status(400).send("⚠️ Código de autorização não encontrado!");
    }

    try {
        console.log("🔄 Solicitando token ao Bling...");
        const response = await axios.post('https://www.bling.com.br/Api/v3/oauth/token', new URLSearchParams({
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: process.env.REDIRECT_URI
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')
            }
        });

        console.log("✅ Token gerado:", response.data);
        res.json(response.data);
    } catch (error) {
        console.error("❌ Erro ao obter o token:", error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
});


app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

module.exports = app;
