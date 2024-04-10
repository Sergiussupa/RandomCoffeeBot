const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

class BotSingleton {
    static instance;

    constructor() {
        throw new Error("Use BotSingleton.getInstance()");
    }

    static async send(id, text, keyboard, parseMode) {
        try {
            const options = {
                ...BotSingleton.addKeyboard(keyboard),
                ...(parseMode && { parse_mode: parseMode }) // Добавление parse_mode если параметр parseMode задан
            };
            // Использование await для асинхронного вызова sendMessage с новыми опциями
            await BotSingleton.getInstance().sendMessage(id, text, options);
        } catch (error) {
            console.error("Error in sending message:", error);
        }
    }

    static addKeyboard(keyboard) {
        if (!keyboard || keyboard === -1) {
            return {
                reply_markup: {
                    remove_keyboard: true
                }
            };
        } else {
            return {
                reply_markup: {
                    keyboard
                }
            };
        }
    }
    
    static getInstance() {
        if (!BotSingleton.instance) {
            BotSingleton.instance = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});
            // Wrap the static send method in an instance method
            BotSingleton.instance.send = function(id, text, keyboard, parseMode) {
                return BotSingleton.send(id, text, keyboard, parseMode);
            };
        }
        return BotSingleton.instance;
    }
}

module.exports = BotSingleton;