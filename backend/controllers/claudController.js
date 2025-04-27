const axios = require("axios");
require("dotenv").config();

// Stockage de l'historique en mémoire (reset quand serveur redémarre)
let conversationHistory = [];

async function genererSMS(req, res) {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt requis" });
  }

  try {
    // Ajouter la question de l'utilisateur à l'historique
    conversationHistory.push({
      role: "user",
      content: prompt,
    });

    // Préparation du contexte pour l'API
    const messages = [
      {
        role: "system",
        content: "Tu es un assistant qui génère des modèles de SMS professionnels et courts.",
      },
      ...conversationHistory,
    ];

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "anthropic/claude-3-sonnet-20240229", // Remplacer selon ton modèle
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://tonsite.com", // Personnalise
          "X-Title": "NomDeTonProjet", // Personnalise
        },
      }
    );

    const message = response.data.choices[0].message.content.trim();

    // Ajouter la réponse IA à l'historique
    conversationHistory.push({
      role: "assistant",
      content: message,
    });

    // Limiter à 3 derniers échanges maximum
    if (conversationHistory.length > 6) {
      conversationHistory = conversationHistory.slice(-6);
    }

    // Renvoyer uniquement le message et l'historique
    res.json({ message, conversationHistory });
  } catch (error) {
    console.error("Erreur Claude API:", error.response?.data || error.message);
    res.status(500).json({ error: "Erreur de génération IA" });
  }
}

module.exports = { genererSMS };
