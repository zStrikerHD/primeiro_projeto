require('dotenv').config();
const express = require('express');
const axios = require('./node_modules/axios/index.d.cts');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Rota principal para verificar se a API está rodando
app.get('/', (req, res) => {
    res.send('🚀 API rodando no Vercel! Use /auth para autenticação.');
});

// ✅ Redireciona para a autenticação no Bling
app.get('/auth', (req, res) => {
    const authUrl = `https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&state=12345`;
    res.redirect(authUrl);
});

// ✅ Callback para capturar o código de autorização
app.get('/auth/callback', async (req, res) => {
    const authCode = req.query.code;

    if (!authCode) {
        return res.status(400).send('⚠️ Código de autorização não encontrado!');
    }

    console.log(`🔑 Código de autorização recebido: ${authCode}`);

    try {
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

        console.log('✅ Token gerado com sucesso:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('❌ Erro ao obter o token:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

module.exports = app;
