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

    const messages = [
      {
        role: "system",
        content: `Tu es un assistant dédié à l'entreprise Lumière, spécialisée dans le domaine de la logistique et du transport. 
    Ta seule mission est de générer des SMS professionnels courts et des modèles de SMS contenant des variables dynamiques au format {{variable}}.
    Tu ne dois en aucun cas répondre à des questions ou demandes qui ne concernent pas la génération de SMS. 
    Si quelqu’un te pose une question hors sujet, tu dois répondre : 
    "Je suis un assistant dédié exclusivement à la génération de SMS professionnels et de modèles dynamiques pour l'entreprise Lumière. Je ne peux pas répondre à d'autres types de demandes."`,
      },
      ...conversationHistory,
    ];
    
    

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "anthropic/claude-3-sonnet-20240229", 
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://tonsite.com", 
          "X-Title": "Lumière messagerie", 
        },
      }
    );

    const message = response.data.choices[0].message.content.trim();

    conversationHistory.push({
      role: "assistant",
      content: message,
    });

    if (conversationHistory.length > 10) {
      conversationHistory = conversationHistory.slice(-10);
    }

    res.json({ message, conversationHistory });
  } catch (error) {
    console.error("Erreur Claude API:", error.response?.data || error.message);
    res.status(500).json({ error: "Erreur de génération IA" });
  }
}

module.exports = { genererSMS };
