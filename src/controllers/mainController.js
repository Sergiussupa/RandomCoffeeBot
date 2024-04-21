const DependencyManager = require('../managers/dependencyManager');

class MainController {
    constructor(bot) {
        this.bot = bot;
        this.depMan = DependencyManager;
        this.userRep = DependencyManager.getUserRep();
        this.mesRep = DependencyManager.getMesfRep();
        this.pollsRep = this.depMan.getPollsRep();
        this.responsRep = this.depMan.getResponsRep();
    }
    async getMsg(msg) {
        try {
            //console.log(msg);
            let userId = msg.from.id;
            let text = msg.text;

            let greeting = 'Привет, мгришник! Ты же уже слышал о нетворкинге или социальных связях?\n' +
                           'Давай расскажу, что это за место...\n' +
                           'Тут ты сможешь познакомиться с такими же студентами, как и ты...' +
                           'Надеюсь, у тебя получится найти единомышленников, или хотя бы приятное общение\n' +
                           'Это тестовый бот, не стесняйся предлагать различные идеи, а мы будем прислушиваться к тебе\n' +
                           'Вдруг ты бы хотел/а ивенты, или же разделение по полу, а может устроить пикник\n' +
                           'Мы будем рады любой обратной связи!\n' +
                           'Особенно, если что то сломается в нашем боте!\n' +
                           'Для этого тебе лишь нужно ввести команды /feedback \n' +
                           'А пока продолжим...\nДля этого тебе нужно отправить любое сообщение';

            //console.log(msg);
            let res = await this.userRep.showUser(msg.from.id);
            if (res == undefined) {
                this.userRep.createUser(userId, msg.from.username);
                await this.bot.send(userId, greeting, [['Click']]);
            } else {
                if (msg.text == '/feedback') {
                    //await this.userRep.updateAtr(userId, 'lastState', res.currState);
                    await this.userRep.updateAtr(userId, 'currState', 10);

                    this.bot.send(userId, 'Отправь назад, чтобы вернуться назад\nили оставь feedback', [['назад']]);
                } else if (msg.text == '/polls') {
                    let result = await this.pollsRep.showAllPolls();
                    let polls = '';
                    
                    //await this.userRep.updateAtr(userId, 'lastState', res.currState);
                    await this.userRep.updateAtr(userId, 'currState', 11);
                    for ( let i = 0; i < result.length; i++ ) {
                        polls += result[i].id + ': ' + result[i].text + '\n'; 
                    }

                    this.bot.send(userId, 'Отправь назад, чтобы вернуться назад\n' +
                                          'Или введи номер вопроса, на который хочешь ответить\n' +
                                          'Список вопросов:\n' + polls, [['назад']]);
                } else if (res.currState == 1) {

                    this.depMan.getCoffeController().getMsg(msg);

                } else if(res.currState == 10) {
                    if (msg.text != 'назад') {
                        this.mesRep.addMessage(userId, msg.from.username, msg.message_id, msg.text);
                        this.bot.send(userId, 'Спасибо за фидбек!');
                        await this.userRep.updateAtr(userId, 'currState', 1);
                    } else {
                        this.bot.send(userId, 'Фидбек не был отправлен');
                        await this.userRep.updateAtr(userId, 'currState', 1);
                    }
                    
                } else if (res.currState == 11) {
                    if (text == 'назад') {

                        this.bot.send(userId, 'Ты отменил участие в опросе');
                        await this.userRep.updateAtr(userId, 'currState', 1);

                    } else {
                       let result = await this.pollsRep.showAllPolls();

                       if (isNaN(+text)) {
                            this.bot.send(userId, 'Как то это не очень похоже на число\n' +
                                                  'Не забывай, что всегда можешь вернутсья назад', [['назад']]);
                       } else if (+text > result.length) {
                        this.bot.send(userId, 'Либо введи назад, либо введи номер вопроса, на который хочешь ответить\n ' +
                                              'У нас всего ' + result.length + ' вопросов, ты перебрал', [['назад']]);
                       } else if (+text < 1) {
                            this.bot.send(userId, 'Либо введи назад, либо введи номер вопроса, на который хочешь ответить\n' +
                                              'У нас всего ' + result.length + ' вопросов, ты недобрал', [['назад']]);
                       } else {
                        await this.userRep.updateAtr(userId, 'lastState', text);
                        await this.userRep.updateAtr(userId, 'currState',  12);
                        this.bot.send(userId, 'Отлично, теперь ответь на вопрос, или введи назад, чтобы вернуться', [['назад']]);
                       }
                    }
                    
                    
                } else if (res.currState == 12) {
                    if (msg.text != 'назад') {
                        this.responsRep.addRespons(text, res.lastState, userId, msg.from.username);
                        this.bot.send(userId, 'Спасибо за обратную связь!');
                        await this.userRep.updateAtr(userId, 'currState', 1);
                        await this.userRep.updateAtr(userId, 'lastState', 0);
                    } else {
                        this.bot.send(userId, 'Вы отменили голосование');
                        await this.userRep.updateAtr(userId, 'currState', 1);
                        await this.userRep.updateAtr(userId, 'lastState', 0);
                    }
                } else if (res.currState > 89) {
                    this.depMan.getAdminController().getMsg(msg.text, userId, res.currState);
                }
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
                await this.userRep.updateAtr(userId, 'currState', -1);
                await this.userCofRep.updateAtr(userId, 'currState', -1)
            } else {
                console.error(`Error sending message to user ${userId}:`, error);
            }
        } catch (err) {
            console.log(err);
        }
    }    

}
module.exports = MainController;