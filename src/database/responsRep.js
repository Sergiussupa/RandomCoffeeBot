class ResponsRep {
    constructor(db) {
        this.db = db;
    }

    async showAllRespons() {
        try {
            const [ result ] = await this.db.query('SELECT * FROM respons');
            return result;
        } catch (err) {

        }
    }

    async addRespons(text, pollId, telegramId, login) {
        try {
            await this.db.query('INSERT INTO respons (text, pollId, telegramId, login) ' +
                                            'VALUES (?, ?, ?, ?)', [text, pollId, telegramId, login]);
        } catch (err) {
            console.log(err);
        }
    }

    async checkCurrentRespons(id) {
        try {
            const [ result ] = await this.db.query('SELECT * FROM respons WHERE id = (?)', [id]);
            //console.log(result[0]);
            return result[0];
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = ResponsRep;