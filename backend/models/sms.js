const db = require('../config/dbConnect').promise();

const SMS = {
  smsCount: () => {
    return db.query('SELECT COUNT(*) as count FROM outbox');
  },

  insertSMS: async (destinationNumber, textDecoded, senderID) => {
    const [rows] = await db.query(
      'SELECT 1 FROM sim_cards WHERE numero = ? LIMIT 1',
      [destinationNumber]
    );

    const type_envoi = rows.length > 0 ? 'float' : 'ORfloat';

    return db.query(
      'INSERT INTO outbox (DestinationNumber, TextDecoded, SenderID, type_envoi) VALUES (?, ?, ?, ?)',
      [destinationNumber, textDecoded, senderID, type_envoi]
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
          // Insert into sentitems
          await db.query(
            'INSERT INTO sentitems (DestinationNumber, TextDecoded, SenderID, SentBy) VALUES (?, ?, ?, ?)',
            [
              message.DestinationNumber,
              message.TextDecoded,
              message.SenderID,
              deviceName || 'Unknown Device'
            ]
          );
          console.log(`Message ID ${messageId} inserted into sentitems`);
          
          // Delete from outbox after inserting into sentitems
          await db.query('DELETE FROM outbox WHERE ID = ?', [messageId]);
          console.log(`Message ID ${messageId} deleted from outbox`);
        } catch (dbError) {
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