const Table = require('cli-table3');

// Класс HelpTableGenerator: генерирует и отображает таблицу вероятностей
class HelpTableGenerator {
    /**
     * Отображает таблицу вероятностей выигрыша
     * @param {Dice[]} diceList - Массив кубиков
     * @param {number[][]} probabilities - Матрица вероятностей выигрыша
     */
    static display(diceList, probabilities) {
        const headers = ['User Dice \\ Opponent Dice', ...diceList.map(dice => dice.toString())];
        const table = new Table({ head: headers });
        diceList.forEach((dice, idx) => {
            const row = [dice.toString(), ...probabilities[idx]];
            table.push(row);
        });
        console.log('\nProbability of the user winning:');
        console.log(table.toString());
    }
}

module.exports = HelpTableGenerator;
