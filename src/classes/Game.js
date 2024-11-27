const FairRandomProtocol = require('./FairRandomProtocol');
const HelpTableGenerator = require('./HelpTableGenerator');
const ProbabilityCalculator = require('./ProbabilityCalculator');
const RandomGenerator = require('../utils/RandomGenerator');
const readlineSync = require('readline-sync');

// Класс Game: координирует игровой процесс
class Game {
    /**
     * @param {Dice[]} diceList - Массив доступных кубиков
     */
    constructor(diceList) {
        this.diceList = diceList;
        this.userDice = null;       // {Dice} Выбранный пользователем кубик
        this.computerDice = null;   // {Dice} Выбранный компьютером кубик
    }
    
    /**
     * Запускает игровой процесс
     */
    start() {
        this.determineFirstMove();
        this.playRounds();
    }
    
    /**
     * Определяет, кто делает первый бросок
     */
    determineFirstMove() {
        console.log("Let's determine who makes the first move.");
        const protocol = new FairRandomProtocol(2); // Диапазон 0..1 для первого хода
        const hmac = protocol.initiate();
        console.log(`I selected a random value in the range 0..1 (HMAC=${hmac}).`);
        console.log('Try to guess my selection.');
        console.log('0 - 0');
        console.log('1 - 1');
        console.log('X - exit');
        console.log('? - help');
        
        const userInput = this.getFirstMoveInput();
        const userGuess = parseInt(userInput);
        const computerNumber = protocol.conclude(userGuess);
        
        if (userGuess === computerNumber) {
            console.log('You make the first move.');
            this.userSelectDice();
            this.computerSelectDice();
        } else {
            console.log('I make the first move.');
            this.computerSelectDice();
            this.userSelectDice();
        }
    }
    
    /**
     * Получает ввод пользователя для определения первого хода
     * @returns {string} Выбранное пользователем значение
     */
    getFirstMoveInput() {
        while (true) {
            const input = readlineSync.question('Your selection: ').trim().toLowerCase();
            if (input === '0' || input === '1') {
                return input;
            } else if (input === 'x') {
                console.log('Game exited.');
                process.exit(0);
            } else if (input === '?') {
                this.displayHelp();
            } else {
                console.log('Invalid input. Please enter 0, 1, X, or ?');
            }
        }
    }
    
    /**
     * Позволяет пользователю выбрать кубик
     */
    userSelectDice() {
        console.log('\nChoose your dice:');
        this.diceList.forEach((dice, idx) => {
            console.log(`${idx} - ${dice.toString()}`);
        });
        console.log('X - exit');
        console.log('? - help');
        
        while (true) {
            const input = readlineSync.question('Your selection: ').trim().toLowerCase();
            if (input === 'x') {
                console.log('Game exited.');
                process.exit(0);
            } else if (input === '?') {
                this.displayHelp();
            } else if (!isNaN(input)) {
                const choice = parseInt(input);
                if (choice >= 0 && choice < this.diceList.length) {
                    this.userDice = this.diceList[choice];
                    console.log(`You have selected dice ${this.userDice.toString()}.`);
                    return;
                }
            }
            console.log('Invalid input. Please select a valid dice index, X, or ?');
        }
    }
    
    /**
     * Компьютер случайным образом выбирает доступный кубик, не выбранный пользователем
     */
    computerSelectDice() {
        const availableDice = this.diceList.filter(dice => dice !== this.userDice);
        if (availableDice.length === 0) {
            console.log('No available dice for computer to select.');
            process.exit(1);
        }
        const randomIndex = RandomGenerator.generateRandomNumber(availableDice.length);
        this.computerDice = availableDice[randomIndex];
        console.log(`I have selected dice ${this.computerDice.toString()}.`);
    }
    
    /**
     * Проводит серию бросков и определяет победителя
     */
    playRounds() {
        // Первый бросок компьютера
        this.throwDice('Computer', this.computerDice, 6, (computerThrow) => {
            // Затем бросок пользователя
            this.throwDice('User', this.userDice, 6, (userThrow) => {
                // Определение результата
                console.log(`\nComputer's throw: ${computerThrow}`);
                console.log(`User's throw: ${userThrow}`);
                if (computerThrow > userThrow) {
                    console.log(`\nI win (${computerThrow} > ${userThrow})!`);
                } else if (computerThrow < userThrow) {
                    console.log(`\nYou win (${userThrow} > ${computerThrow})!`);
                } else {
                    console.log(`\nIt's a tie (${computerThrow} = ${userThrow})!`);
                }
                // Завершение игры
                process.exit(0);
            });
        });
    }
    
    /**
     * Проводит бросок для указанного игрока
     * @param {string} player - Имя игрока ('Computer' или 'User')
     * @param {Dice} dice - Кубик игрока
     * @param {number} range - Диапазон генерации случайных чисел
     * @param {function} callback - Функция обратного вызова с результатом броска
     */
    throwDice(player, dice, range, callback) {
        console.log(`\nIt's time for ${player}'s throw.`);
        const protocol = new FairRandomProtocol(range);
        const hmac = protocol.initiate();
        console.log(`I selected a random value in the range 0..${range - 1} (HMAC=${hmac}).`);
        console.log('Add your number modulo ' + range + '.');
        for (let i = 0; i < range; i++) {
            console.log(`${i} - ${i}`);
        }
        console.log('X - exit');
        console.log('? - help');
        
        const userNumber = this.getThrowInput(range);
        const result = protocol.conclude(userNumber);
        const throwValue = dice.getValue(result);
        console.log(`${player}'s throw is ${throwValue}.`);
        callback(throwValue);
    }
    
    /**
     * Получает ввод пользователя для броска кубика
     * @param {number} range - Диапазон допустимых чисел
     * @returns {number} Выбранное пользователем число
     */
    getThrowInput(range) {
        while (true) {
            const input = readlineSync.question('Your selection: ').trim().toLowerCase();
            if (input === 'x') {
                console.log('Game exited.');
                process.exit(0);
            } else if (input === '?') {
                this.displayHelp();
            } else if (!isNaN(input)) {
                const num = parseInt(input);
                if (num >= 0 && num < range) {
                    return num;
                }
            }
            console.log(`Invalid input. Please enter a number between 0 and ${range - 1}, X, or ?`);
        }
    }
    
    /**
     * Отображает таблицу вероятностей выигрыша
     */
    displayHelp() {
        const probabilities = ProbabilityCalculator.calculate(this.diceList);
        HelpTableGenerator.display(this.diceList, probabilities);
    }
}

module.exports = Game;
