const axios = require("./node_modules/axios/index.d.cts");

module.exports = async (req, res) => {
    const authCode = req.query.code;

    if (!authCode) {
        return res.status(400).json({ error: "Código de autorização não encontrado!" });
    }

    try {
        const response = await axios.post("https://www.bling.com.br/Api/v3/oauth/token", new URLSearchParams({
            grant_type: "authorization_code",
            code: authCode,
            redirect_uri: process.env.REDIRECT_URI
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64")
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};
