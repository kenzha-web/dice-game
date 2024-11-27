const Dice = require('./Dice');

// Класс DiceParser: парсит аргументы командной строки в конфигурации кубиков
class DiceParser {
    /**
     * @param {string[]} args - Массив аргументов командной строки
     */
    constructor(args) {
        this.args = args;
    }
    
    /**
     * Парсит аргументы и возвращает список кубиков
     * @returns {Dice[]} Массив объектов Dice
     * @throws {Error} Если аргументы некорректны
     */
    parseDice() {
        if (this.args.length < 3) {
            throw new Error('You must provide at least three dice configurations.');
        }
        const diceList = [];
        this.args.forEach((arg, idx) => {
            const values = arg.split(',').map(value => {
                const num = Number(value.trim());
                if (!Number.isInteger(num)) {
                    throw new Error(`Non-integer value found in dice configuration at position ${idx + 1}.`);
                }
                return num;
            });
            if (values.length !== 6) {
                throw new Error(`Invalid number of sides for dice at position ${idx + 1}. Each dice must have six integers.`);
            }
            diceList.push(new Dice(values));
        });
        return diceList;
    }
}

module.exports = DiceParser;
