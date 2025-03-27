const db = require('../config/dbConnect').promise();

const ContactGroupe = {
    // Associer un contact à un groupe
    associateContactToGroup: async (contactId, groupId) => {
        const query = `INSERT INTO contact_groupe (contact_id, groupe_id) VALUES (?, ?)`;
        const [result] = await db.query(query, [contactId, groupId]);
        return result;
    },

    // Récupérer les groupes associés à un contact
    getGroupsByContact: async (contactId) => {
        const query = `
            SELECT g.* FROM groupes g
            JOIN contact_groupe cg ON g.id = cg.groupe_id
            WHERE cg.contact_id = ?`;
        const [results] = await db.query(query, [contactId]);
        return results;
    },

    // Récupérer les contacts associés à un groupe
    getContactsByGroup: async (groupId) => {
        const query = `
            SELECT c.* FROM contacts c
            JOIN contact_groupe cg ON c.id = cg.contact_id
            WHERE cg.groupe_id = ?`;
        const [results] = await db.query(query, [groupId]);
        return results;
    },

    // Supprimer une association entre un contact et un groupe
    deleteAssociation: async (contactId, groupId) => {
        const query = `DELETE FROM contact_groupe WHERE contact_id = ? AND groupe_id = ?`;
        const [result] = await db.query(query, [contactId, groupId]);
        return result;
    }
};

module.exports = ContactGroupe;
