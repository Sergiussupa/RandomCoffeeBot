class CoffeController {
    constructor(bot, depMan) {
        this.bot = bot;
        this.depMan = depMan; // Сохранение ссылки на менеджер зависимостей
        this.userRep = this.depMan.getUserRep(); // Получение репозитория пользователя через менеджер
    }
    async getMsg(msg) {
        try {
            // Логика обработки сообщений...
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = CoffeController;
