const axios = require("axios");
require("dotenv").config();

async function genererSMS(req, res) {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Tu es un assistant qui génère des modèles de SMS professionnels et courts.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const message = response.data.choices[0].message.content.trim();
    res.json({ message });
  } catch (error) {
    console.error("Erreur OpenAI:", error.response?.data || error.message);
    res.status(500).json({ error: "Erreur de génération IA" });
  }
}

module.exports = { genererSMS };
