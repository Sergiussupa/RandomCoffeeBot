const mysql = require('mysql2/promise');
require('dotenv').config();


class DBSingleton {
    constructor() {
        if (!DBSingleton.instance) {
            DBSingleton.instance = mysql.createPool({
                host: process.env.HOST,
                user: process.env.USERR,
                password: process.env.PASSWORD,
                database: process.env.DATABASE,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
        }
    }

    getInstance() {
        return DBSingleton.instance;
    }
}

module.exports = new DBSingleton();