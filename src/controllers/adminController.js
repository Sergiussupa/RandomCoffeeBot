class Admin {
    constructor(bot, depMan) {
        this.bot = bot;
        this.depMan = depMan; // Сохранение ссылки на менеджер зависимостей
        this.userRep = this.depMan.getUserRep();
        this.userCofRep = this.depMan.getUserCofRep(); // Получение репозитория пользователя через менеджер
        this.mesRep = this.depMan.getMesfRep();
        this.pollsRep = this.depMan.getPollsRep();
        this.responsRep = this.depMan.getResponsRep();
        this.count = 1;
        this.respId;
    }
    async getMsg(text, userId, state) {
        try {
            switch (state) {
                case 90:
                    let greeting = 'Посмотреть пользователей: <b>1</b>\n' +
                    'Посмотреть количество активных комнат: <b>2</b>\n' +
                    'Собрать активных пользователей в комнаты комнаты <b>3</b>\n' +
                    'Посмотреть количество фидбеков <b>4</b>\n' +
                    'Отправить сообщение для всех <b>5</b>\n' +
                    'Создать пулл <b>6</b>\n' +
                    'Посмотреть ответы на опрос <b>7</b>';

                    this.bot.send(userId, greeting, [['1', '2', '3'], ['4', '6', '7']], "HTML");
                    await this.userRep.updateAtr(userId, 'currState', 91);
                    break;
                case 91:
                    switch (text) {
                        case '1':
                            let result1 = await this.userCofRep.showStateUsers(1);
                            let result2 = await this.userCofRep.showStateUsers(2);
                            let result3 = await this.userCofRep.showStateUsers(3);
                            let result44 = await this.userCofRep.showStateUsers(4);
                            //console.log(result3);


                            this.bot.send(userId, result1.length + ' пользователя без имени\n' +
                                                            result2.length + ' пользователей с именем\n' +
                                                            result3.length + ' пользователя ждут комнату\n' +
                                                            result44.length + ' пользователей общается в комнате', -1);
                            break;
                        case '2':
                            let result4 = await this.userCofRep.getMaxRoomId();
                            this.bot.sendMessage(userId, result4 + ' количество активных комнат');
                            break;
                        case '3':
                            this.pairUsers(userId);
                            this.bot.sendMessage(userId, 'Готово');
                            break;
                        case '4':
                            let result5 = await this.userRep.showMessages();
                            this.bot.send(userId, (`У нас ${result5.length} фидбека\n` +
                                                         'Хочешь прочитать их? Введи <b>да</b>\n' +
                                                         'Вернутсья назад, введи <b>назад</b>'),
                                                         [['да', 'назад']], "HTML");
                            await this.userRep.updateAtr(userId, 'currState', 92);
                            break;
                        case '5':
                            this.bot.send(userId, 'Отправь сообщение, которое увидят все пользователи, которые уже ввели имя!' +
                                                  '\nИли отправь назад', [['назад']]);
                            await this.userRep.updateAtr(userId, 'currState', 100);
                            break;
                        case '6':
                            await this.userRep.updateAtr(userId, 'currState', 110);
                            this.bot.send(userId, 'Введи голосование, на которое ответят, или нажми <b>назад</b>',
                                                  [['назад']], "HTML");
                            break;
                        case '7':
                            let result7 = await this.responsRep.showAllRespons();
                            this.bot.send(userId, (`У нас ${result7.length} ответов\n` +
                                                         'Хочешь прочитать их? Введи номер, который хочешь посмотреть\n' +
                                                         'Вернутсья назад, введи <b>назад</b>'),
                                                         [['назад']], "HTML");
                            await this.userRep.updateAtr(userId, 'currState', 120);
                            break;



                        default:
                            this.getMsg(text, userId, 90);
                            break;

                    }
                    break;
                case 92:
                    if (text == 'назад') {
                        this.getMsg(text, userId, 90);
                    } else if (text == 'да') {
                        let result5 = await this.userRep.showMessages();
                        this.bot.send(userId, 'Введи число сообщения, которое хочешь посмотреть\n' +
                                      `Всего сообщений ${result5.length}`);
                    await this.userRep.updateAtr(userId, 'currState', 93);
                    } else {
                        let result5 = await this.userRep.showMessages();
                        this.bot.send(userId, `У нас ${result5.length} фидбеков\n` +
                                                         'Хочешь прочитать их? Введи <b>да</b>\n' +
                                                         'Вернутсья назад, введи <b>назад</b>',
                                                         [['да', 'назад']], "HTML");
                        await this.userRep.updateAtr(userId, 'currState', 92);
                    }
                    break;
                case 93:
                    if ( text == 'назад') {
                        this.getMsg(text, userId, 90);
                    } else if (isNaN(+text)) {

                    } else {
                        this.respId = userId;
                        let result5 = await this.userRep.showMessages();
                        if( text > result5.length) {
                            this.bot.send(userId, `Самое последнее сообщение имеет индекс ${result5.length}\n` +
                                                  'Или введи назад', [['назад']]);
                        } else {
                            let res = await this.mesRep.checkCurrentMessage(+text);
                            this.bot.send(userId, res.text + '\nЧтобы ответить на сообщение, введите <b>ответить</b>',
                                                             [['ответить', 'назад']], "HTML");
                            await this.userRep.updateAtr(userId, 'currState', 94);
                            this.count = res.id;
                            this.respId = res.telegramId;
                        }
                    }
                    break;
                case 94:
                    if (text == 'ответить') {
                        await this.userRep.updateAtr(userId, 'currState', 95);
                        this.bot.send(userId, 'Отправь свой ответ, которое увидит тот пользователь');
                    } else {
                        this.getMsg(text, userId, 90);                    }
                    break;
                case 95:
                    this.bot.sendMessage(this.respId, 'Ответ на твой фидбек\n' + text +
                                                      '\nСпасибо за обратную связь, надо придумать для вас медальки!');
                    this.bot.send(userId, 'Твой ответ отправлен');
                    await this.userRep.updateAtr(userId, 'currState', 94);
                    break;
                case 100:
                    if (text == 'назад') {
                        this.getMsg(text, userId, 90);                    } else {
                        let result100 = await this.userCofRep.showStateUsers(3);
                        let result101 = await this.userCofRep.showStateUsers(4);
                        let result102 = await this.userCofRep.showStateUsers(1);
                        for (let i = 0; i < result100.length; i++) {
                            //console.log(result100[i]);
                            this.bot.send(result100[i].telegramId, 'Сообщение для всех\n' + text, -1);
                            await this.userRep.updateAtr(userId, 'currState', 91);
                        }
                        for (let i = 0; i < result101.length; i++) {
                            //console.log(result100[i]);
                            this.bot.send(result101[i].telegramId, 'Сообщение для всех\n' + text, -1);
                        }
                        for (let i = 0; i < result102.length; i++) {
                            //console.log(result100[i]);
                            this.bot.send(result102[i].telegramId, 'Сообщение для всех\n' + text, -1);
                        }

                        this.bot.send(userId, 'Всем отправили - ' + text);
                        this.getMsg(text, userId, 90);
                    }
                    break;
                case 110:
                    if(text == 'назад') {
                        this.getMsg(text, userId, 90);
                    } else {
                        await this.pollsRep.addPoll(text);
                        this.bot.send(userId, 'Ты добавил "' + text + '" как голосование');
                        this.getMsg(text, userId, 90);
                    }
                    break;
                case 120:
                    if (text == 'назад') {
                        this.getMsg(text, userId, 90);
                    } else if (isNaN(text)) {
                        this.bot.send(userId, 'Тебе нужно ввести число', -1);
                    } else {
                        let result5 = await this.responsRep.checkCurrentRespons(+text);

                        this.bot.send(userId, result5.text);
                        this.getMsg(text, userId, 90);
                    }
                    break;

            }
        } catch (error) {
            //await this.handleSendError(userId, error);
            console.log(error);
        }
    }
    async handleSendError(userId, error) {
        try {
            if (error.response && error.response.statusCode === 403) {
                console.error(`Access denied: The bot was blocked by the user ${userId}.`);
                //await this.userRep.updateAtr(userId, 'currState', -1);
                await this.userCofRep.updateAtr(userId, 'currState', -1)
            } else {
                console.error(`Error sending message to user ${userId}:`, error);
            }
        } catch (err) {
            console.log(err);
        }
    }   
    async pairUsers(userId) {
        try {
            // Шаг 1: Получение списка готовых к общению пользователей
            let usersReady = await this.userCofRep.showStateUsers(3);

            usersReady = this.shuffleArray(usersReady);
            let count = await this.userCofRep.getMaxRoomId() + 1;
            
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
                this.bot.send(user1.telegramId, 'Вы попались в команту с тайным незнакомцем');
                this.bot.send(user2.telegramId, 'Вы попались в команту с тайным незнакомцем');

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