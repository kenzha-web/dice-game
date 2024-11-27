const RandomGenerator = require('../utils/RandomGenerator');
const HMACHandler = require('./HMACHandler');

// Класс FairRandomProtocol: реализует протокол честной генерации случайных чисел
class FairRandomProtocol {
    /**
     * @param {number} range - Диапазон генерации случайных чисел [0, range)
     */
    constructor(range) {
        this.range = range;
        this.key = null;       // {Buffer} Ключ для HMAC
        this.number = null;    // {number} Сгенерированное число
        this.hmac = null;      // {string} HMAC-сообщение
    }
    
    /**
     * Инициализирует протокол: генерирует ключ, число и создает HMAC
     * @returns {string} HMAC в шестнадцатеричном формате
     */
    initiate() {
        this.key = RandomGenerator.generateKey();
        this.number = RandomGenerator.generateRandomNumber(this.range);
        const hmacHandler = new HMACHandler(this.key, this.number);
        this.hmac = hmacHandler.getHMAC();
        return this.hmac;
    }
    
    /**
     * Завершает протокол: раскрывает число и ключ, а также вычисляет результат при необходимости
     * @param {number} userNumber - Число, выбранное пользователем
     * @returns {number} Результат вычисления или сгенерированное число
     */
    conclude(userNumber) {
        if (this.range === 2) {
            // Для определения первого хода не вычисляем результат
            const hmacHandler = new HMACHandler(this.key, this.number);
            console.log(`My number was ${this.number} (KEY=${hmacHandler.getKey()}).`);
            return this.number;
        } else {
            // Для бросков кубиков вычисляем результат
            const result = (this.number + userNumber) % this.range;
            const hmacHandler = new HMACHandler(this.key, this.number);
            console.log(`My number was ${this.number} (KEY=${hmacHandler.getKey()}).`);
            console.log(`The result is (${this.number} + ${userNumber}) % ${this.range} = ${result}.`);
            return result;
        }
    }
}

module.exports = FairRandomProtocol;
