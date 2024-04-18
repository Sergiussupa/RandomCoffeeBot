class CoffeController {
    constructor(bot, depMan) {
        this.bot = bot;
        this.depMan = depMan; // Сохранение ссылки на менеджер зависимостей
        this.userCofRep = this.depMan.getUserCofRep(); // Получение репозитория пользователя через менеджер
    }
    async getMsg(msg) {
        try {
            let userId = msg.from.id;
            let text = msg.text;

            let flag = 0;
            let result = await this.userCofRep.showUser(userId);
            if (result == undefined) {
                this.userCofRep.createUser(userId);
                this.bot.sendMessage(userId, 'Вижу, тебя еще нет в моих заметках.\n' +
                                      'Нужно с тобой познакомиться, как тебя зовут?');
            } else {
                if (msg.text == '/leave' || msg.text == '/rename') {
                    switch (msg.text) {
                        case '/leave':
                            this.depMan.getLeaveController().getMsg(msg, result.roomId);
                            break;
                    }
                } else {
                    switch (result.currState) {
                        case 1:
                            await this.userCofRep.updateAtr(userId, 'name', text);
                            await this.userCofRep.updateAtr(userId, 'currState', 2);
                            this.bot.send(userId, `То есть ты у нас <b>${text}</b>, верно?\n` +
                                                  'Отправь да, если все правильно', [['да']], "HTML");
                            break;
                        case 2:
                            if (text == 'да') {
                                await this.userCofRep.updateAtr(userId, 'currState', 3);
                                this.bot.send(userId, 'Все сделанно. Осталось ждать часа кХм...');
                            } else {
                                this.bot.send(userId, 'Как же к тебе обращаться?');
                                await this.userCofRep.updateAtr(userId, 'currState', 1);
                            }
                            break;
                        case 3:
                            this.bot.send(userId, 'Еще ничего не произошло. \nЖдем-с...');
                            //await this.userCofRep.updateAtr(userId, 'currState', 4);
                            break;
                        case 4:
                            // Получаем информацию о собеседнике в той же комнате
                            let roommate = await this.userCofRep.getRoommate(userId, result.roomId);
                            if (roommate) {
                                // Пересылаем сообщение собеседнику
                                this.bot.sendMessage(roommate.telegramId, `Сообщение от ${result.name || 'анонима'}:\n ${text}`);
                            } else {
                                this.bot.sendMessage(userId, 'У вас нет собеседника в комнате.');
                            }
                            break;
                    }
                }

            }
            // Логика обработки сообщений...
            return flag;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = CoffeController;