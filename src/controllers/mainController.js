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
                this.bot.sendMessage(userId, 'greeting');
            } else {
                if (res.currState == 1) {
                //console.log(res);
                    //this.userRep.updateAtr(userId, 'login', '1');
                    this.depMan.test();
                    console.log(res);
                    this.bot.sendMessage(userId, 'Сам такой');
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

}
module.exports = MainController;