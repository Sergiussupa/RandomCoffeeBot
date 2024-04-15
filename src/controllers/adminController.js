class Admin {
    constructor(bot, depMan) {
        this.bot = bot;
        this.depMan = depMan; // Сохранение ссылки на менеджер зависимостей
        this.userRep = this.depMan.getUserRep();
        this.userCofRep = this.depMan.getUserCofRep(); // Получение репозитория пользователя через менеджер
    }
    async getMsg(text, userId, state) {
        try {
            switch (state) {
                case 90:
                    let greeting = 'Посмотреть конкретных пользователей: <b>1</b>\n' +
                    'Посмотреть количество активных комнат: <b>2</b>\n' +
                    'Собрать активных пользователей в комнаты комнаты <b>3</b>';

                    this.bot.send(userId, greeting, [['1', '2', '3']], "HTML");
                    await this.userRep.updateAtr(userId, 'currState', 91);
                    break;
                case 91:
                    switch (text) {
                        case '1':
                            let usersInfoStates = 'Пользователи без имени: <b>1</b>\n' +
                                          'Пользователи с именем: <b>2</b>\n' +
                                          'Пользователи ждут комнат: <b>3</b>\n' +
                                          'Вернуться назад: <b>4</b>';

                            this.bot.send(userId, usersInfoStates, [['1', '2'], ['3', '4']], "HTML");
                            await this.userRep.updateAtr(userId, 'currState', 92);
                            break;
                        case '2':
                            let result2 = await this.userCofRep.getMaxRoomId();
                            this.bot.sendMessage(userId, result2 + ' количество активных комнат');
                            break;
                        case '3':
                            this.pairUsers(userId);
                            this.bot.sendMessage(userId, 'Готово');
                            break;
                        default:
                            this.getMsg(text, userId, state - 1);
                            break;

                    }
                    break;
                case 92:
                    switch (text) {
                        case '1':
                            let result1 = await this.userCofRep.showStateUsers(1);
                            this.bot.sendMessage(userId, result1.length + ' пользователя без имени');
                            break;
                        case '2':
                            let result2 = await this.userCofRep.showStateUsers(2);
                            this.bot.sendMessage(userId, result2.length + ' пользователей с именем\n')
                            break;
                        case '3':
                            let result3 = await this.userCofRep.showStateUsers(3);
                            this.bot.sendMessage(userId, result3.length + ' пользователя ждут комнату');
                            break;
                        case '4':
                            this.getMsg(text, userId, state - 2);
                            break;
                        default:
                            this.getMsg(text, userId, state - 1);
                            break;
                    }
                    break;
                default:
                    this.getMsg(text, userId, 90);
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    }
    async pairUsers(userId) {
        try {
            // Шаг 1: Получение списка готовых к общению пользователей
            let usersReady = await this.userCofRep.showStateUsers(3);

            usersReady = this.shuffleArray(usersReady);
            let count = 1;
            
            // Шаг 2: Создание пар пользователей
            for (let i = 0; i < usersReady.length; i += 2) {
                // Проверка на нечетное количество пользователей
                if (i + 1 === usersReady.length) {
                    this.bot.sendMessage(userId, `Пользователь ${usersReady[i].name} остается без пары`);
                    break; // или обработайте последнего пользователя отдельно
                }
    
                let user1 = usersReady[i];
                let user2 = usersReady[i + 1];
                
                // Обновляем roomId для обоих пользователей в базе данных
                await this.userCofRep.updateAtr(user1.telegramId, 'roomId', count);
                await this.userCofRep.updateAtr(user2.telegramId, 'roomId', count);
                await this.userCofRep.updateAtr(user1.telegramId, 'currState', 4);
                await this.userCofRep.updateAtr(user2.telegramId, 'currState', 4);
                count++;
    
            }
        } catch (err) {
            console.log(err);
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // обмен элементами
        }
        return array;
    }
    
}

module.exports = Admin;