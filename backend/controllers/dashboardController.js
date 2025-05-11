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

const getTauxStats = async (req, res) => {
  try {
    const sql = `
      SELECT 
        DATE_FORMAT(SendingDateTime, '%Y-%m') AS mois,
        SUM(CASE WHEN status = 'SendingOK' THEN 1 ELSE 0 END) AS success_count,
        SUM(CASE WHEN status = 'SendingErr' THEN 1 ELSE 0 END) AS fail_count
      FROM sentitems
      GROUP BY mois
      ORDER BY mois ASC
    `;

    const [rows] = await db.query(sql);

    // Calculer les taux (pourcentage) pour chaque mois
    const tauxMensuels = rows.map(row => {
      const total = row.success_count + row.fail_count;
      return {
        mois: row.mois,
        taux_success: total > 0 ? Math.round((row.success_count / total) * 100) : 0,
        taux_fail: total > 0 ? Math.round((row.fail_count / total) * 100) : 0
      };
    });

    res.json({ tauxMensuels });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


module.exports = {
  getDashboardStats,
  getTauxStats
};
