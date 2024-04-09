class UserCofResp {
    constructor(db) {
        this.db = db;
    }
    async createUser(telegramId, name) {
        try {
            const result = await this.db.query('INSERT INTO coffeeUsers (telegramId, name) ' +
                                            'VALUES (?, ?)', [telegramId, name]);
            console.log('New coffef');
            return result.insertId;
        } catch (err) {
            console.log(err);
        }
    }
    // Методы для извлечения данных (по id, все сущности и т.д.)
}

module.exports = UserCofResp;