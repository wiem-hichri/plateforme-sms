const db = require('../config/dbConnect').promise();

const getDashboardStats = async (req, res) => {
  try {
    const queries = [
      'SELECT COUNT(*) as total FROM users',
      'SELECT COUNT(*) as total FROM sentitems WHERE status = "SendingOK"',
      'SELECT COUNT(*) as total FROM sentitems WHERE status = "SendingErr"',
      'SELECT COUNT(*) as total FROM groupes',
      'SELECT COUNT(*) as total FROM sim_cards',
      'SELECT COUNT(*) as total FROM model_sms',
      'SELECT COUNT(*) as total FROM contacts',
      `SELECT 
          DATE_FORMAT(SendingDateTime, '%Y') AS annee,
          DATE_FORMAT(SendingDateTime, '%m') AS mois,
          COUNT(*) AS total_sms
       FROM sentitems
       WHERE status = "SendingOK"
       GROUP BY annee, mois
       ORDER BY annee ASC, mois ASC`
    ];

    const results = await Promise.all(queries.map(sql => db.query(sql)));

    const [
      usersRows,
      smsSentRows,
      smsFailedRows,
      groupsRows,
      pucesRows,
      modelsRows,
      contactsRows,
      evolutionRows
    ] = results.map(([rows]) => rows);

    res.json({
      totalUsers: usersRows[0]?.total ?? 0,
      totalSmsSent: smsSentRows[0]?.total ?? 0,
      totalSmsFailed: smsFailedRows[0]?.total ?? 0,
      totalGroups: groupsRows[0]?.total ?? 0,
      totalPuces: pucesRows[0]?.total ?? 0,
      totalModels: modelsRows[0]?.total ?? 0,
      totalContacts: contactsRows[0]?.total ?? 0,
      smsEvolution: evolutionRows.map(row => ({
        annee: row.annee,
        mois: row.mois,
        total_sms: row.total_sms
      }))
    });

  } catch (err) {
    console.error('Erreur SQL :', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
};

module.exports = {
  getDashboardStats
};
