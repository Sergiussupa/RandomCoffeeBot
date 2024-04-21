class PoolsRep {
    constructor(db) {
        this.db = db;
    }

    async showAllPolls() {
        try {
            let [ result ] = await this.db.query('SELECT * FROM polls');
            return result;
        } catch (err) {
            console.log(err);
        }
    }
    async addPoll(text) {
        try {
            await this.db.query('INSERT INTO polls (text) ' +
                                            'VALUES (?)', [text]);
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = PoolsRep;