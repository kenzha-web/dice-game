const crypto = require('crypto');

// Класс HMACHandler: управляет созданием и проверкой HMAC
class HMACHandler {
    /**
     * @param {Buffer} key - Ключ для HMAC
     * @param {number|string} message - Сообщение для HMAC
     */
    constructor(key, message) {
        this.key = key;
        this.message = message;
        this.hmac = this.calculateHMAC();
    }
    
    /**
     * Вычисляет HMAC для заданного ключа и сообщения
     * @returns {string} HMAC в шестнадцатеричном формате
     */
    calculateHMAC() {
        const hmac = crypto.createHmac('sha3-256', this.key);
        hmac.update(this.message.toString());
        return hmac.digest('hex');
    }
    
    /**
     * Возвращает HMAC
     * @returns {string} HMAC в шестнадцатеричном формате
     */
    getHMAC() {
        return this.hmac;
    }
    
    /**
     * Возвращает ключ в шестнадцатеричном формате
     * @returns {string} Ключ в шестнадцатеричном формате
     */
    getKey() {
        return this.key.toString('hex');
    }
    
    /**
     * Проверяет соответствие HMAC
     * @param {string} keyHex - Ключ в шестнадцатеричном формате
     * @param {number|string} message - Сообщение для HMAC
     * @param {string} hmacToVerify - HMAC для проверки
     * @returns {boolean} Результат проверки
     */
    static verifyHMAC(keyHex, message, hmacToVerify) {
        const key = Buffer.from(keyHex, 'hex');
        const hmac = crypto.createHmac('sha3-256', key);
        hmac.update(message.toString());
        const calculatedHMAC = hmac.digest('hex');
        return calculatedHMAC === hmacToVerify;
    }
}

module.exports = HMACHandler;
