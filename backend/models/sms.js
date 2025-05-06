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

  // Fixed to properly handle successful/failed sending status
  smsSent: async (status, deviceName, messageId) => {
    try {
      // First retrieve the message that was sent
      const [rows] = await db.query('SELECT * FROM outbox WHERE ID = ?', [messageId]);

      if (rows.length === 0) {
        throw new Error('Message not found in outbox.');
      }

      const message = rows[0];

      // Only move to sentitems if status is success
      if (status === 'success') {
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

        // Delete from outbox after inserting into sentitems
        await db.query('DELETE FROM outbox WHERE ID = ?', [messageId]);
        
        console.log(`Message ID ${messageId} moved to sentitems and deleted from outbox`);
      } else {
        console.log(`Message ID ${messageId} failed to send, keeping in outbox for retry`);
      }

      return message;
    } catch (error) {
      console.error('Error in smsSent function:', error);
      throw error;
    }
  }
};

module.exports = SMS;