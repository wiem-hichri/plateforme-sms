const db = require('../config/dbConnect').promise();

const SMS = {
  smsCount: () => {
    return db.query('SELECT COUNT(*) as count FROM outbox');
  },

  insertSMS: (destinationNumber, textDecoded, creatorId) => {
    return db.query(
      `INSERT INTO outbox (DestinationNumber, TextDecoded, CreatorID) VALUES (?, ?, ?)`,
      [destinationNumber, textDecoded, creatorId]
    );
  },

  getSMS: () => {
    return db.query(`SELECT * FROM outbox ORDER BY SendingDateTime DESC LIMIT 1`);
  },

  deleteSMS: (id) => {
    return db.query(`
        DELETE FROM outbox
        WHERE ID = (
            SELECT ID FROM outbox ORDER BY SendingDateTime DESC LIMIT 1
        )
    `);
},


smsSent: async () => {
  const [rows] = await db.query(`SELECT * FROM outbox ORDER BY SendingDateTime DESC LIMIT 1`);
  
  if (rows.length === 0) {
      throw new Error('No message found in outbox.');
  }

  const message = rows[0];

  // Insert into sentitems with only DestinationNumber, TextDecoded, and CreatorID
  await db.query(
      `INSERT INTO sentitems 
      (DestinationNumber, TextDecoded, CreatorID)
      VALUES (?, ?, ?)`,
      [
          message.DestinationNumber,
          message.TextDecoded,
          message.CreatorID
      ]
  );

  // Delete from outbox after inserting into sentitems
  await db.query(`
      DELETE FROM outbox WHERE ID = (
          SELECT ID FROM (
              SELECT ID FROM outbox ORDER BY SendingDateTime DESC LIMIT 1
          ) AS temp
      )
  `);

  return message;
}


};
module.exports = SMS;