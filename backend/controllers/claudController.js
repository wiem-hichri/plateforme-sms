const axios = require("axios");
require("dotenv").config();

let conversationHistory = [];

async function genererSMS(req, res) {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt requis" });
  }

  try {
    conversationHistory.push({
      role: "user",
      content: prompt,
    });

    const messages = [
  {
    role: "system",
    content: `Tu es un assistant IA spécialisé dans la génération de SMS professionnels pour l'entreprise Lumière, dans le secteur logistique et transport.

    Règles strictes :
    1. Si l'utilisateur demande un **SMS simple**, réponds par un texte court, professionnel, sans variable.
    2. Si l'utilisateur demande un **modèle de SMS**, utilise des **variables dynamiques** au format exact : double accolades, exemple : {{ nom }}, {{ date }}, {{ site }}.
    3. Si l’utilisateur demande explicitement une réponse **en arabe**, tu dois répondre en arabe, quelle que soit la langue utilisée dans la question.
    4. Sinon, réponds dans la même langue que la question.
    5. Si l’utilisateur pose une question hors sujet (pas liée à un SMS), réponds : "Je suis un assistant dédié exclusivement à la génération de SMS professionnels et de modèles dynamiques pour l'entreprise Lumière. Je ne peux pas répondre à d'autres types de demandes.".

    Tu dois toujours rester dans le cadre de ta mission.`,
      },
      ...conversationHistory,
    ];


        
    

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "anthropic/claude-3-sonnet-20240229", 
        messages: messages,
        max_tokens: 450,
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
