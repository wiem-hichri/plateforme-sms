const db = require('../config/dbConnect').promise();

const SMS = {

  smsCount: () => {
    return db.query('SELECT COUNT(*) as count FROM outbox');
  },

  insertSMS: async (destinationNumber, textDecoded, senderID) => {
    const [rows] = await db.query(
      `SELECT 1 FROM sim_cards WHERE numero = ? LIMIT 1`,
      [destinationNumber]
    );
  
    const type_envoi = rows.length > 0 ? 'float' : 'ORfloat';
  
    return db.query(
      `INSERT INTO outbox (DestinationNumber, TextDecoded, SenderID, type_envoi) VALUES (?, ?, ?, ?)`,
      [destinationNumber, textDecoded, senderID, type_envoi]
    );
  },
  



  getSMSFloat: () => {
    return db.query(`SELECT * FROM outbox  WHERE type_envoi = "float" ORDER BY SendingDateTime ASC LIMIT 1`);
  },

  getSMSORFloat: () => {
    return db.query(`SELECT * FROM outbox  WHERE type_envoi = "ORfloat" ORDER BY SendingDateTime ASC LIMIT 1`);
  },

  deleteSMS: (id) => {
    return db.query(`
        DELETE FROM outbox
        WHERE ID = (
            SELECT ID FROM outbox ORDER BY SendingDateTime ASC LIMIT 1
        )
    `);
},

smsSent: async () => {
  const [rows] = await db.query(`SELECT * FROM outbox ORDER BY SendingDateTime ASC LIMIT 1`);
  
  if (rows.length === 0) {
      throw new Error('No message found in outbox.');
  }

  const message = rows[0];

  // Insert into sentitems with only DestinationNumber, TextDecoded, and CreatorID
  await db.query(
      `INSERT INTO sentitems 
      (DestinationNumber, TextDecoded, SenderID)
      VALUES (?, ?, ?)`,
      [
          message.DestinationNumber,
          message.TextDecoded,
          message.SenderID
      ]
  );

  // Delete from outbox after inserting into sentitems
  await db.query(`
      DELETE FROM outbox
        WHERE ID = (
            SELECT ID FROM outbox ORDER BY SendingDateTime ASC LIMIT 1
        )
  `);

  return message;
}


};
module.exports = SMS;