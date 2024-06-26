class UserCofResp {
    constructor(db) {
        this.db = db;
    }
    async createUser(telegramId) {
        try {
            const result = await this.db.query('INSERT INTO coffeeUsers (telegramId) ' +
                                            'VALUES (?)', [telegramId]);
            console.log('New coffef');
            return result.insertId;
        } catch (err) {
            console.log(err);
        }
    }

    async showUser(telegramId) {
        try {
            const [ result ] = await this.db.query('SELECT * FROM coffeeUsers ' +
                                            'WHERE telegramId = ?', [telegramId]);
            return result[0];
        } catch (err) {
            console.log(err);
        }
    }

    async showStateUsers(currState) {
        try {
            const [ result ] = await this.db.query('SELECT telegramId FROM coffeeUsers ' +
                                            'WHERE currState = ?', [currState]);
            return result;
        } catch (err) {
            console.log(err);
        }
    }

    async updateAtr(telegramId, atr, val) {
        try {
            if (atr == 'currState' || atr == 'lastState' || atr == 'name' || atr == 'roomId') {
                await this.db.query('UPDATE coffeeUsers SET ' +
                                    `${atr} = ? ` +
                                    'WHERE telegramId = ?', [val, telegramId]);
            } else {
                throw new Error("Это ошибка! Произошло что-то не так.");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getRoom(telegramId, id_rooms) {
        try {
            const [results] = await this.db.query('SELECT * FROM coffeeUsers WHERE id_rooms = ? AND telegramId != ?', [telegramId, id_rooms]);
            return results; // Возвращает массив пользователей в указанной комнате, исключая пользователя с определённым telegramId
        } catch (err) {
            console.log(err);
        }
    }

    async getMaxRoomId() {
        try {
            const [result] = await this.db.query('SELECT MAX(roomId) AS max_room_id FROM coffeeUsers');
            return result[0].max_room_id;
        } catch (err) {
            console.log(err);
        }
    }

    async getRoommate(userId, roomId) {
        try {
            const [result] = await this.db.query(
                'SELECT * FROM coffeeUsers WHERE roomId = ? AND telegramId != ?',
                [roomId, userId]
            );
            return result.length > 0 ? result[0] : null; // возвращаем первого найденного пользователя
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async clearRoomAndReturnUsers(roomId) {
        try {
            // Шаг 1: Получение всех пользователей с указанным roomId
            const [users] = await this.db.query('SELECT * FROM coffeeUsers WHERE roomId = ?', [roomId]);

            // Шаг 2: Проверка, есть ли пользователи для обновления
            if (users.length > 0) {
                // Шаг 3: Обновление roomId на NULL и currState на 3
                await this.db.query('UPDATE coffeeUsers SET roomId = NULL, currState = 3 WHERE roomId = ?', [roomId]);
            }

            // Шаг 4: Возврат списка пользователей, которые были в комнате
            return users;
        } catch (err) {
            console.error('Ошибка при очистке комнаты:', err);
            throw err; // Переброс ошибки для обработки на более высоком уровне
        }
    }

    async test(text) {
        console.log(text);
    }
    // Методы для извлечения данных (по id, все сущности и т.д.)
}

module.exports = UserCofResp;