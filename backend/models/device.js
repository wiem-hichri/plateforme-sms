// models/device.js - Update with new method to get ENUM values
const db = require('../config/dbConnect').promise();

const Device = {
    create: async (device) => {
        const query = `INSERT INTO devices (nom, proprietaire, type) VALUES (?, ?, ?)`;
        const values = [device.nom, device.proprietaire, device.type];
        const [result] = await db.query(query, values);
        return result;
    },

    getAll: async () => {
        const [results] = await db.query("SELECT * FROM devices");
        return results;
    },

    update: async (id, device) => {
        const query = `UPDATE devices SET nom = ?, proprietaire = ?, type = ? WHERE id = ?`;
        const values = [device.nom, device.proprietaire, device.type, id];
        const [result] = await db.query(query, values);
        return result;
    },

    delete: async (id) => {
        const [result] = await db.query("DELETE FROM devices WHERE id = ?", [id]);
        return result;
    },

    // New method to get device types from ENUM
    getTypes: async () => {
        const query = `
            SELECT COLUMN_TYPE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'devices' 
            AND COLUMN_NAME = 'type' 
            AND TABLE_SCHEMA = DATABASE()
        `;
        const [result] = await db.query(query);
        
        if (result.length > 0) {
            // Parse ENUM values from something like: enum('float','ORfloat','MIX')
            const enumString = result[0].COLUMN_TYPE;
            const matches = enumString.match(/enum\((.+)\)/i);
            
            if (matches && matches[1]) {
                // Split the values and remove the quotes
                return matches[1].split(',').map(type => type.replace(/'/g, ''));
            }
        }
        
        return []; // Return empty array if no types found
    }
};

module.exports = Device;