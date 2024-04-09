const BotSingleton = require('../bot/botSingleton');
const DBSingleton = require('../database/dbSingleton');
const UserRepository = require('../database/userRepository');
const UserCofResp = require('./database/userCofResp');
const coffeController = require('./controllers/coffeController');
//require('dotenv').config();

class DependencyManager {
    constructor() {
        this.bot = BotSingleton.getInstance();
        this.db = DBSingleton.getInstance();
        this.userRep = new UserRepository(this.getDB());
        this.userCofRep = new UserCofResp(this.getDB());
        //this.userRepository = new UserRepository(this.db);
    }

    getBot() {
	    //console.log(process.env.TELEGRAM_TOKEN);
	    return this.bot;
    }
    getDB() {
        return this.db;
    }
    getUserRep() {
        return this.userRep;
    }
    getUserCofRep() {
        return this.userCofRep;
    }

    test() {
        console.log('AAAAAAAAAAAAA');
    }

    // Методы для получения экземпляров классов
}

module.exports = new DependencyManager();