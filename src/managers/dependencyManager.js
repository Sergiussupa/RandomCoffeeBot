const BotSingleton = require('../bot/botSingleton');
const DBSingleton = require('../database/dbSingleton');
const UserRepository = require('../database/userRepository');
const UserCofResp = require('../database/userCofResp');
const MessagesRep = require('../database/messagesRep');
const PollsRep = require('../database/pollsRep');
const ResponsRep = require('../database/responsRep');
const CoffeController = require('../controllers/coffeController');
const adminController = require('../controllers/adminController');
const leaveController = require('../controllers/leaveController');

class DependencyManager {
    constructor() {
        this.bot = BotSingleton.getInstance();
        this.db = DBSingleton.getInstance();
        this.userRep = new UserRepository(this.getDB());
        this.userCofRep = new UserCofResp(this.getDB());
        this.mesRep = new MessagesRep(this.getDB());
        this.pollsRep = new PollsRep(this.getDB());
        this.responsRep = new ResponsRep(this.getDB());
        this.coffeController = new CoffeController(this.getBot(), this); // Создание экземпляра с передачей бота и самого менеджера зависимостей
        this.adminController = new adminController(this.getBot(), this);
        this.leaveController = new leaveController(this.getBot(), this);
    }

    getBot() {
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
    getMesfRep() {
        return this.mesRep;
    }
    getPollsRep() {
        return this.pollsRep;
    }
    getResponsRep() {
        return this.responsRep;
    }
    getCoffeController() { // Метод для получения экземпляра coffeController
        return this.coffeController;
    }
    getAdminController() {
        return this.adminController;
    }
    getLeaveController() {
        console.log('LOH');
        return this.leaveController;
    }

    // Остальная часть класса...
}

module.exports = new DependencyManager();
