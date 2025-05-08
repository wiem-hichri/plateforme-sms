const db = require('../config/dbConnect').promise();
const bcrypt = require('bcrypt');


const SMS = {
  smsCount: () => {
    return db.query('SELECT COUNT(*) as count FROM outbox');
  },

  insertSMS: async (destinationNumber, textDecoded, senderID, modeleId = null) => {
    const [rows] = await db.query(
      'SELECT 1 FROM sim_cards WHERE numero = ? LIMIT 1',
      [destinationNumber]
    );

    const type_envoi = rows.length > 0 ? 'float' : 'ORfloat';

    return db.query(
      'INSERT INTO outbox (DestinationNumber, TextDecoded, SenderID, type_envoi, model_id) VALUES (?, ?, ?, ?, ?)',
      [destinationNumber, textDecoded, senderID, type_envoi, modeleId]
    );
  },

  getSMSFloat: () => {
    return db.query('SELECT * FROM outbox WHERE type_envoi = "float" ORDER BY SendingDateTime ASC LIMIT 1');
  },

  getSMSORFloat: () => {
    return db.query('SELECT * FROM outbox WHERE type_envoi = "ORfloat" ORDER BY SendingDateTime ASC LIMIT 1');
  },

  deleteSMS: (id) => {
    return db.query('DELETE FROM outbox WHERE ID = ?', [id]);
  },

  // Updated to ensure consistent lowercase status comparison
  smsSent: async (status, deviceName, messageId) => {
    try {
      console.log(`Processing SMS status update: ID=${messageId}, status=${status}, device=${deviceName}`);
      
      // First retrieve the message that was sent
      const [rows] = await db.query('SELECT * FROM outbox WHERE ID = ?', [messageId]);

      if (rows.length === 0) {
        console.error(`Message ID ${messageId} not found in outbox.`);
        throw new Error('Message not found in outbox.');
      }

      const message = rows[0];
      console.log(`Found message in outbox: ${JSON.stringify(message)}`);

      // Normalize status to lowercase for consistent comparison
      const statusLower = String(status).toLowerCase();
      
      // Check for success status - using lowercase comparison only
      const isSuccess = (statusLower === 'success');
      
      if (isSuccess) {
        console.log(`Message ID ${messageId} sent successfully, moving to sentitems...`);
        
        try {
          let contenu = message.TextDecoded;
        
          if (message.model_id !== null && message.model_id !== undefined) {
            const [rows] = await db.query(
              'SELECT is_confidential FROM model_sms WHERE id = ?',
              [message.model_id]
            );
        
            if (rows.length > 0) {
              const isConfidential = rows[0].is_confidential;
        
              if (isConfidential) {
                const saltRounds = 10;
                contenu = await bcrypt.hash(contenu, saltRounds);
              }
            } else {
              console.warn(`⚠️ Modèle avec ID ${message.model_id} non trouvé. Enregistrement sans hachage.`);
            }
          }
        
          await db.query(
            'INSERT INTO sentitems (DestinationNumber, TextDecoded, SenderID, SentBy) VALUES (?, ?, ?, ?)',
            [
              message.DestinationNumber,
              contenu,
              message.SenderID,
              deviceName || 'Unknown Device'
            ]
          );
          console.log(`✅ Message ID ${messageId} inséré dans sentitems`);
          await db.query('DELETE FROM outbox WHERE ID = ?', [messageId]);
          console.log(`🗑️ Message ID ${messageId} supprimé de outbox`);
        }
         catch (dbError) {
          console.error(`Database error processing message ID ${messageId}:`, dbError);
          throw dbError;
        }
      } else {
        console.log(`Message ID ${messageId} failed to send (status=${status}), keeping in outbox for retry`);
      }

      return message;
    } catch (error) {
      console.error('Error in smsSent function:', error);
      throw error;
    }
  }
};

module.exports = SMS;