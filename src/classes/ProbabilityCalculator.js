// Класс ProbabilityCalculator: рассчитывает вероятности выигрыша между кубиками
class ProbabilityCalculator {
    /**
     * Рассчитывает вероятности выигрыша для каждой пары кубиков
     * @param {Dice[]} diceList - Массив кубиков
     * @returns {number[][]} Матрица вероятностей выигрыша
     */
    static calculate(diceList) {
        const probabilities = [];
        const n = diceList.length;
        for (let i = 0; i < n; i++) {
            probabilities[i] = [];
            for (let j = 0; j < n; j++) {
                if (i === j) {
                    probabilities[i][j] = '0.3333';
                } else {
                    const prob = ProbabilityCalculator.calculateWinProbability(diceList[i], diceList[j]);
                    probabilities[i][j] = prob.toFixed(4);
                }
            }
        }
        return probabilities;
    }
    
    /**
     * Рассчитывает вероятность выигрыша одного кубика над другим
     * @param {Dice} diceA - Первый кубик
     * @param {Dice} diceB - Второй кубик
     * @returns {number} Вероятность выигрыша diceA над diceB
     */
    static calculateWinProbability(diceA, diceB) {
        let wins = 0;
        const total = diceA.values.length * diceB.values.length;
        for (const aValue of diceA.values) {
            for (const bValue of diceB.values) {
                if (aValue > bValue) {
                    wins++;
                }
            }
        }
        return wins / total;
    }
}

module.exports = ProbabilityCalculator;
