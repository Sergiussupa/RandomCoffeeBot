class ResponsRep {
    constructor(db) {
        this.db = db;
    }

    async addRespons(text, pollId, telegramId, login) {
        try {
            await this.db.query('INSERT INTO respons (text, pollId, telegramId, login) ' +
                                            'VALUES (?, ?, ?, ?)', [text, pollId, telegramId, login]);
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = ResponsRep;