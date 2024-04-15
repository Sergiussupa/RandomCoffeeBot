class LeaveController {
    constructor(bot, depMan) {
        this.bot = bot;
        this.depMan = depMan; // Сохранение ссылки на менеджер зависимостей
        this.userRep = this.depMan.getUserRep();
        this.userCofRep = this.depMan.getUserCofRep(); // Получение репозитория пользователя через менеджер
    }
    async getMsg(msg, roomId) {
        try {
            if (roomId === null) {
                this.bot.send(msg.from.id, 'Чтобы выйти из чата, сначала нужно в него войти');
            } else {
                let res = await this.userCofRep.clearRoomAndReturnUsers(roomId);
                res.forEach((item) => {
                    this.bot.send(item.telegramId, 'Кто то вышел из чата, чата больше нет');
                })
                console.log(res);
            }
            
        } catch (error) {
            console.log(error);
        }
    }
    
}

module.exports = LeaveController;