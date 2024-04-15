const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

//const util = require('util');

class Node {
    constructor(value, description) {
        this.value = value;
        this.description = description;
        this.next = null;
    }
}

class LinkedListQueue {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    enqueue(value, description) {
        const newNode = new Node(value, description);
        if (!this.tail) {
            this.head = this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
        console.log(`Enqueued: ${description}`);
    }

    dequeue() {
        if (!this.head) {
            console.log("Attempt to dequeue from an empty queue");
            return null;
        }
        const node = this.head;
        this.head = this.head.next;
        if (!this.head) {
            this.tail = null;
        }
        console.log(`Dequeued: ${node.description}`);
        return node.value;
    }

    isEmpty() {
        return !this.head;
    }
}



// Поместите код BotSingleton ниже этого определения

class BotSingleton {
    static instance;

    constructor() {
        throw new Error("Use BotSingleton.getInstance()");
    }

    static async send(id, text, keyboard, parseMode, messageId = null) {
        const options = {
            ...BotSingleton.addKeyboard(keyboard),
            ...(parseMode && { parse_mode: parseMode })
        };
        const description = `Request: ${messageId ? "Edit message" : "Send message"} to ${id}`;
        BotSingleton.getInstance().queue.enqueue(() => BotSingleton.processRequest(id, text, options, messageId), description);
        console.log(`Request enqueued: ${description}`);
    }

    static async processRequest(id, text, options, messageId) {
        try {
            if (messageId) {
                console.log(`Editing message ${messageId} for ${id}`);
                await BotSingleton.getInstance().editMessageText(text, { chat_id: id, message_id: messageId, ...options });
            } else {
                console.log(`Sending new message to ${id}`);
                await BotSingleton.getInstance().sendMessage(id, text, options);
            }
        } catch (error) {
            console.error(`Error in processing request for ${id}:`, error);
        }
    }

    static addKeyboard(keyboard) {
        if (!keyboard || keyboard === -1) {
            return { reply_markup: { remove_keyboard: true } };
        } else {
            return { reply_markup: { keyboard } };
        }
    }
    
    static getInstance() {
        if (!BotSingleton.instance) {
            BotSingleton.instance = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
            BotSingleton.instance.send = function(id, text, keyboard, parseMode, messageId) {
                return BotSingleton.send(id, text, keyboard, parseMode, messageId);
            };
            BotSingleton.instance.queue = new LinkedListQueue();
            // Привязываем processQueue к экземпляру
            BotSingleton.instance.processQueue = function() {
                if (!this.queue.isEmpty()) {
                    const request = this.queue.dequeue();
                    request().then(() => {
                        setTimeout(() => this.processQueue(), 1000);  // Управление частотой запросов
                    });
                } else {
                    setTimeout(() => this.processQueue(), 1000);
                }
            };
            BotSingleton.instance.processQueue(); // Инициация процесса обработки очереди
        }
        return BotSingleton.instance;
    }
    
}

module.exports = BotSingleton;