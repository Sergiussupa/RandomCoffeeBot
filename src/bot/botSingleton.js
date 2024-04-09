const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

class BotSingleton {
    constructor() {
        if (!BotSingleton.instance) {
            BotSingleton.instance = new TelegramBot(process.env.TELEGRAM_TOKEN,
                {polling: true});
        }
    }
    
    getInstance() {
        return BotSingleton.instance;
    }
}

module.exports = new BotSingleton();
