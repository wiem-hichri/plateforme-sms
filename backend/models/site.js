const db = require('../config/dbConnect').promise();

const Site = {
    create: async (site) => {
        const query = `INSERT INTO sites (site_name) VALUES (?)`;
        const values = [site.site_name];

        const [result] = await db.query(query, values);
        return result;
    },

    getAll: async () => {
        const [results] = await db.query("SELECT * FROM sites");
        return results;
    },

    update: async (id, site) => {
        const query = `UPDATE sites SET site_name = ? WHERE site_id = ?`;
        const values = [site.site_name, id];
        const [result] = await db.query(query, values);
        return result;
    },

    delete: async (id) => {
        const [result] = await db.query("DELETE FROM sites WHERE site_id = ?", [id]);
        return result;
    },
};

module.exports = Site;
