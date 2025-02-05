require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./api/auth'); // Certifique-se de que este arquivo existe

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('🚀 API rodando!');
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
