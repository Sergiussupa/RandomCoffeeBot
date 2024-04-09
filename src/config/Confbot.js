class Confbot {
    static instance;
    constructor(config) {
        if(Confbot.instance) {
            return Confbot.instance;
        }

        this.config = config;
        Confbot.instance = this;
    }

    static getInstance(config) {
        if (!Confbot.instance) {
            new Confbot(config);
        }
        return Confbot.instance;
    }
}

module.exports = Confbot;
