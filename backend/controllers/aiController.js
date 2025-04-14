const axios = require('axios');

exports.generateSMS = async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validation stricte
    if (!prompt || typeof prompt !== 'string' || prompt.length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Le prompt doit être une chaîne de caractères d\'au moins 3 caractères'
      });
    }

    // Prompt optimisé avec exemples
    const optimizedPrompt = `Tu es un assistant qui génère EXCLUSIVEMENT des SMS professionnels en français.
Règles strictes :
- 1 phrase maximum
- Pas de salutations (ni "Bonjour" ni "Cordialement")
- Uniquement le message principal
- Ton professionnel et concis

Exemple pour "rappel paiement" : "Rappel : votre paiement est attendu avant le 30/06."
Exemple pour "annulation rdv" : "Votre rendez-vous du 15/06 est annulé, nous vous recontacterons."

Message à générer : ${prompt}`;

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        inputs: optimizedPrompt,
        parameters: {
          max_new_tokens: 50,
          temperature: 0.2,  // Réduit la créativité pour plus de cohérence
          top_k: 40,
          do_sample: false
        }
      },
      {
        headers: { 'Authorization': `Bearer ${process.env.HF_API_KEY}` },
        timeout: 15000
      }
    );

    // Nettoyage en profondeur
    let smsText = response.data[0]?.generated_text
      .replace(/.*Message à générer[^\n]*/s, '')  // Supprime tout le prompt
      .replace(/["\n\r\[\]{}]/g, ' ')             // Supprime caractères spéciaux
      .replace(/\b(exemple|voir|ci-joint).*/gi, '') // Supprime les références
      .replace(/\s+/g, ' ')                        // Espaces simples
      .trim()
      .replace(/^[^a-zà-œ0-9]*/i, '')             // Supprime les préfixes indésirables
      .replace(/[.!?,;:]$/, '') + '.';             // Force un point final

    // Validation du contenu
    if (smsText.length < 5 || 
        smsText.toLowerCase().includes('exemple') || 
        smsText.includes('...')) {
      throw new Error('Résultat de génération invalide');
    }

    // Troncature et réponse
    smsText = smsText.substring(0, 160);
    
    res.json({
      success: true,
      sms: smsText,
      length: smsText.length,
      debug: process.env.NODE_ENV === 'development' ? {
        original: response.data[0]?.generated_text,
        prompt: optimizedPrompt
      } : undefined
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Échec de la génération du SMS',
      ...(process.env.NODE_ENV === 'development' && {
        details: error.message,
        stack: error.stack
      })
    });
  }
};