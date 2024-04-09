const { BotService } = require('./services/BotService');

(async () => {
    const botService = new BotService(); // Создание экземпляра BotService
    botService.init(); // Инициализация команд и обработчиков
})();