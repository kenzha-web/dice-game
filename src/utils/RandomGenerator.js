const crypto = require('crypto');

// {RandomGenerator} Утилита RandomGenerator: отвечает за генерацию криптографически безопасных случайных чисел и ключей
class RandomGenerator {
    /**
     * Генерирует криптографически безопасный ключ
     * @returns {Buffer} Буфер с ключом длиной 32 байта (256 бит)
     */
    static generateKey() {
        return crypto.randomBytes(32); // 256 бит
    }
    
    /**
     * Генерирует случайное число в заданном диапазоне [0, range)
     * @param {number} range - Верхняя граница диапазона (не включительно)
     * @returns {number} Случайное число в диапазоне [0, range)
     */
    static generateRandomNumber(range) {
        const bytesNeeded = Math.ceil(Math.log2(range) / 8);
        let randomNumber;
        do {
            const randomBytes = crypto.randomBytes(bytesNeeded);
            randomNumber = parseInt(randomBytes.toString('hex'), 16);
        } while (randomNumber >= Math.floor((2 ** (bytesNeeded * 8)) / range) * range);
        return randomNumber % range;
    }
}

module.exports = RandomGenerator;
