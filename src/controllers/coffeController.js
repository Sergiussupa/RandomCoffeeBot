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
                switch (result.currState) {
                    case 1:
                        await this.userCofRep.updateAtr(userId, 'name', text);
                        await this.userCofRep.updateAtr(userId, 'currState', 2);
                        this.bot.send(userId, `То есть ты у нас <b>${text}</b>, верно?\n` +
                                              'Отправь 1, если да', [['1']], "HTML");
                        break;
                    case 2:
                        if (text == 1) {
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