const db = require('../config/dbConnect').promise();

const SMS = {

  smsCount: () => {
    return db.query('SELECT COUNT(*) as count FROM outbox');
  },

  insertSMS: (destinationNumber, textDecoded, senderID) => {
    return db.query(
      `INSERT INTO outbox (DestinationNumber, TextDecoded, SenderID) VALUES (?, ?, ?)`,
      [destinationNumber, textDecoded, senderID]
    );
  },



  getSMS: () => {
    return db.query(`SELECT * FROM outbox ORDER BY SendingDateTime ASC LIMIT 1`);
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