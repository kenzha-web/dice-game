// Класс Dice: представляет кубик с произвольными значениями граней
class Dice {
    /**
     * @param {number[]} values - Массив чисел, представляющих значения граней кубика
     */
    constructor(values) {
        this.values = values;
    }
    
    /**
     * Возвращает значение грани по индексу
     * @param {number} index - Индекс грани
     * @returns {number} Значение грани
     */
    getValue(index) {
        return this.values[index];
    }
    
    /**
     * Возвращает строковое представление кубика
     * @returns {string} Строка с перечисленными значениями граней
     */
    toString() {
        return `[${this.values.join(', ')}]`;
    }
}

module.exports = Dice;
