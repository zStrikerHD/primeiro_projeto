import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(req, res) {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: "Código de autorização não encontrado!" });
    }

    try {
        const response = await axios.post(
            "https://www.bling.com.br/Api/v3/oauth/token",
            new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: process.env.REDIRECT_URI
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Basic " + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64")
                }
            }
        );

        return res.json(response.data);
    } catch (error) {
        return res.status(500).json({ error: error.response?.data || error.message });
    }
}
