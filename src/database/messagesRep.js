class MessagesRep {
    constructor(db) {
        this.db = db;
    }
    async addMessage(telegramId, login, idMsg, text) {
        try {
            await this.db.query('INSERT INTO messages (telegramId, login, idMessage, text) ' +
                                            'VALUES (?, ?, ?, ?)', [telegramId, login, idMsg, text]);
        } catch (err) {
            console.log(err);
        }
    }

    async showMessages() {
        try {
            const [ result ] = await this.db.query('SELECT * FROM messages');
            return result;
        } catch (err) {
            console.log(err);
        }
    }

    async checkCurrentMessage(id) {
        try {
            const [ result ] = await this.db.query('SELECT * FROM messages WHERE id = (?)', [id]);
            console.log(result[0]);
            return result[0];
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = MessagesRep;