const DependencyManager = require('../managers/dependencyManager');

class MainController {
    constructor(bot) {
        this.bot = bot;
        this.depMan = DependencyManager;
        this.userRep = DependencyManager.getUserRep();
    }
    async getMsg(msg) {
        try {
            let userId = msg.from.id;

            //console.log(msg);
            let res = await this.userRep.showUser(msg.from.id);
            if (res == undefined) {
                this.userRep.createUser(userId, msg.from.username);
                this.bot.send(userId, 'greeting');
            } else {
                if (msg.text == '256m13g7r18i9') {
                    await this.userRep.updateAtr(userId, 'currState', 90);
                    this.depMan.getAdminController().getMsg(msg.text, userId, res.currState);
                    res.currState = -1;
                    this.bot.send(userId, 'Теперь ты админ');
                }
                if (res.currState == 1) {
                    this.depMan.getCoffeController().getMsg(msg);
                } else if (res.currState > 89) {
                    this.depMan.getAdminController().getMsg(msg.text, userId, res.currState);
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

}
module.exports = MainController;