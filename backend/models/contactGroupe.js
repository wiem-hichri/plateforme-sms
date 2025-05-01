const db = require('../config/dbConnect').promise();

const ContactGroupe = {
        associateContactsToGroup: async (contactIds, groupId) => {
            if (!Array.isArray(contactIds)) {
                throw new Error("contactIds must be an array");
            }
        
            const values = contactIds.map(contactId => [contactId, groupId]);
            const query = `INSERT IGNORE INTO contact_groupe (contact_id, groupe_id) VALUES ?`;
            const [result] = await db.query(query, [values]);
            return result;
        },
        
    getGroupsByContact: async (contactId) => {
        const query = `
            SELECT g.* FROM groupes g
            JOIN contact_groupe cg ON g.id = cg.groupe_id
            WHERE cg.contact_id = ?`;
        const [results] = await db.query(query, [contactId]);
        return results;
    },

    getContactsByGroup: async (groupId) => {
        const query = `
            SELECT c.* FROM contacts c
            JOIN contact_groupe cg ON c.id = cg.contact_id
            WHERE cg.groupe_id = ?`;
        const [results] = await db.query(query, [groupId]);
        return results;
    },

    disassociateContactsFromGroup: async (contactIds, groupId) => {
        if (!Array.isArray(contactIds)) {
            throw new Error("contactIds must be an array");
        }
    
        const placeholders = contactIds.map(() => '?').join(',');
        const query = `DELETE FROM contact_groupe WHERE groupe_id = ? AND contact_id IN (${placeholders})`;
        const [result] = await db.query(query, [groupId, ...contactIds]);
        return result;
    }
    
};

module.exports = ContactGroupe;
