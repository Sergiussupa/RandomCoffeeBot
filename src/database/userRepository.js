class UserRepository {
    constructor(db) {
        this.db = db;
    }
    async test(text) {
        console.log(text);
    }

    async createUser(telegramId, login) {
        try {
            const result = await this.db.query('INSERT INTO users (telegramId, login) ' +
                                            'VALUES (?, ?)', [telegramId, login]);
            console.log('New usesr');
            return result.insertId;
        } catch (err) {
            console.log(err);
        }
    }

    async updateAtr(telegramId, atr, val) {
        try {
            if (atr == 'currState' || atr == 'lastState') {
                await this.db.query('UPDATE users SET ' +
                                    `${atr} = ? ` +
                                    'WHERE telegramId = ?', [val, telegramId]);
            } else {
                throw new Error("Это ошибка! Произошло что-то не так.");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async deleteUser(id) {
        const result = await this.db.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows;
    }

    async showUser(telegramId) {
        try {
            const [ result ] = await this.db.query('SELECT * FROM users ' +
                                            'WHERE telegramId = ?', [telegramId]);
            return result[0];
        } catch (err) {
            console.log(err);
        }
    }

    async showUsers() {
        try {
            const [ result ] = await this.db.query('SELECT * FROM users');
            return result;
        } catch (err) {
            console.log(err);
        }
    }
    // Методы для извлечения данных (по id, все сущности и т.д.)
}

module.exports = UserRepository;