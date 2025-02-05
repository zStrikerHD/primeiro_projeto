require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("🚀 API rodando! Use /auth para autenticar.");
});

// 🔗 **Redireciona para a URL de autorização do Bling**
app.get('/auth', (req, res) => {
    const authUrl = `https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&state=12345`;
    res.redirect(authUrl);
});

// 🔄 **Recebe o código de autorização (auth_code)**
app.get('/auth/callback', async (req, res) => {
    const authCode = req.query.code;

    if (!authCode) {
        return res.status(400).send("⚠️ Código de autorização não encontrado!");
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

        console.log('✅ Token gerado:', response.data);
        res.json(response.data);  // Mostra o token no navegador
    } catch (error) {
        console.error('❌ Erro ao obter o token:', error.response?.data || error);
        res.status(500).json({ error: error.response?.data || error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
