const DiceParser = require('./classes/DiceParser');
const Game = require('./classes/Game');

/**
 * Главная функция для запуска игры
 */
function main() {
    try {
        const args = process.argv.slice(2);
        const parser = new DiceParser(args);
        const diceList = parser.parseDice();
        const game = new Game(diceList);
        game.start();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.log('Example usage: node index.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3');
        process.exit(1);
    }
}

main();
