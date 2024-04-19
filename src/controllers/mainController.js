const DependencyManager = require('../managers/dependencyManager');

class MainController {
    constructor(bot) {
        this.bot = bot;
        this.depMan = DependencyManager;
        this.userRep = DependencyManager.getUserRep();
        this.mesRep = DependencyManager.getMesfRep();
    }
    async getMsg(msg) {
        try {
            //console.log(msg);
            let userId = msg.from.id;
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
                if (msg.text == '256m13g7r18i9') {
                    await this.userRep.updateAtr(userId, 'currState', 90);
                    this.depMan.getAdminController().getMsg(msg.text, userId, res.currState, res.lastState);
                    res.currState = -1;
                    this.bot.send(userId, 'Теперь ты админ');
                } else if (msg.text == '/feedback') {
                    await this.userRep.updateAtr(userId, 'lastState', res.currState);
                    await this.userRep.updateAtr(userId, 'currState', 10);

                    this.bot.send(userId, 'Отправь 1, чтобы вернуться назад\nили оставь feedback', [['1']]);
                } else if (res.currState == 1) {
                    this.depMan.getCoffeController().getMsg(msg);
                } else if(res.currState == 10) {
                    if (msg.text != '1') {
                        this.mesRep.addMessage(userId, msg.from.username, msg.message_id, msg.text);
                        this.bot.send(userId, 'Спасибо за фидбек!');
                    }
                    await this.userRep.updateAtr(userId, 'currState', res.lastState);
                    
                }   else if (res.currState > 89) {
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