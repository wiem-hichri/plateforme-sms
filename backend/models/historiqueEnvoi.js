
const db = require('../config/dbConnect').promise();

const Historique = {

    getHistoriqueMessages: async (userID, isSuperAdmin) => {
        const query = `
            SELECT 
                u.nom AS user_name,  
                si.SendingDateTime,  
                si.DestinationNumber, 
                si.TextDecoded,      
                si.Status            
            FROM 
                users u
            JOIN 
                sentitems si ON u.id = si.SenderID
            WHERE 
                (? = 'super-administrateur' OR u.id = ?)  -- Superadmin peut voir tous les messages
            ORDER BY 
                si.SendingDateTime DESC;
        `;

        const [results] = await db.query(query, [isSuperAdmin ? 'super-administrateur' : 'user', userID]);
        return results;
    }
};

module.exports = Historique;
