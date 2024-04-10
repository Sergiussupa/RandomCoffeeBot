const DependencyManager = require('../managers/dependencyManager');
const mainController    = require('../controllers/mainController');

class BotService {
    constructor() {
        const bot = DependencyManager.getBot(); // Получаем экземпляр бота через DependencyManager
        this.bot = bot;
        this.mainController = new mainController(this.bot);
    }

    async init() {
        const commands = [
            { command: "start", description: "Запуск бота" },
            { command: "profile", description: "Полюбоваться красавчиком" },
            { command: "clear", description: "Заполнить профайл заново" },
            { command: "likes", description: "Проверить количество лайков" }
        ];

        this.bot.setMyCommands(commands);
        this.bot.on('message', (msg) => this.handleMessage(msg));
    }
    
        

    async handleMessage(msg) {
        this.mainController.getMsg(msg);
    }

    // Метод handlePhoto предполагается оставить без изменений
}

module.exports = { BotService };
