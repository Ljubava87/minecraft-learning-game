let timerId; // Объявляем глобальную переменную для хранения идентификатора таймера

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    timerId = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(timerId); // Останавливаем таймер, когда время вышло
            alert('Время вышло!'); // Выводим сообщение, что время вышло
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', function () {
    const startGameButton = document.getElementById('start-game-button');
    const playerNameInput = document.getElementById('player-name');
    const steveDialog = document.querySelector('.steve-dialog');
    const backgroundDiv = document.querySelector('.background');
    const containerDiv = document.querySelector('.container');
    const wrightButton = document.getElementById('wright-button'); // Получаем кнопку "Собрать слово"

    function toggleTimerDisplay(shouldShow) {
        const timerContainer = document.querySelector('.timer-container');
        timerContainer.style.display = shouldShow ? 'block' : 'none';
    }

    function toggleScoreDisplay(show) {
        const scoreContainer = document.querySelector('.score-container');
        if (show) {
            scoreContainer.classList.add('show-score');
        } else {
            scoreContainer.classList.remove('show-score');
        }
    }

    startGameButton.addEventListener('click', function () {
        const playerName = playerNameInput.value;

        if (playerName.trim() === "") {
            alert("Пожалуйста, введите имя игрока.");
            return;
        }
        function toggleTimerDisplayClass(shouldShow) {
            const timerContainer = document.querySelector('.timer-container');

            if (shouldShow) {
                timerContainer.classList.add('show-timer'); // Добавление класса для показа и анимации таймера
            } else {
                timerContainer.classList.remove('show-timer'); // Удаление класса, чтобы скрыть таймер
            }
        }



        const wordList = ["ПИГМАН", "ПОРТАЛ", "СТИВ", "ГОЛЕМ", "БЛОК"];
        const randomWord = wordList[Math.floor(Math.random() * wordList.length)];

        const steveMessage = `Привет, ${playerName}! Давай поиграем. Я скажу тебе слово. А ты его собирешь из блоков. Первое слово: "${randomWord}"`;

        backgroundDiv.style.display = 'none';
        containerDiv.style.display = 'none';
        steveDialog.style.display = 'flex';
        document.querySelector('.speech-bubble p').textContent = steveMessage;

        wrightButton.addEventListener('click', function () {
            // Скрываем экран с Стивом и его диалоговым окном после нажатия "Собрать слово"
            steveDialog.style.display = 'none';

            toggleTimerDisplay(true); // показать таймер
            toggleScoreDisplay(true); // показать счет

            const timerDisplay = document.getElementById('timer'); // Получаем элемент для отображения таймера
            startTimer(30, timerDisplay); // Запускаем таймер с начальным значением в 30 секунд

            // Далее, показываем новый экран с квадратиками и создаем их
            const wordContainer = document.querySelector('.word-container');
            wordContainer.innerHTML = ''; // Очищаем контейнер

            // Создаем квадратики для каждой буквы в случайно выбранном слове
            const wordLetters = randomWord.split(''); // Разделяем слово на буквы

            wordLetters.forEach(letter => {
                const wordSquare = document.createElement('div');
                wordSquare.className = 'word-square';
                wordContainer.appendChild(wordSquare);
                wordSquare.dataset.expectedLetter = letter; // Устанавливаем ожидаемую букву в атрибут data-expected-letter
            });

            // Показываем новый экран с квадратиками
            backgroundDiv.style.display = 'block';

            // Создаем квадратики с буквами из рандомно выбранного слова
            const letterContainer = document.querySelector('.letter-container');
            letterContainer.innerHTML = ''; // Очищаем контейнер

            const randomWordLetters = shuffleArray(randomWord.split('')); // Перемешиваем буквы в слове

            randomWordLetters.forEach(letter => {
                const letterSquare = document.createElement('div');
                letterSquare.className = 'letter-square';
                letterSquare.textContent = letter;
                letterContainer.appendChild(letterSquare);
                letterSquare.draggable = true; // Делаем квадратики с буквами перетаскиваемыми
                letterSquare.dataset.letter = letter; // Устанавливаем текст буквы в атрибут data-letter

                // Обработчик события dragstart (начало перетаскивания)
                letterSquare.addEventListener('dragstart', function (event) {
                    event.dataTransfer.setData('text/plain', event.target.dataset.letter);
                });
            });

            // Обработчики событий drag and drop
            letterContainer.addEventListener('dragover', dragOver);
            wordContainer.addEventListener('dragover', dragOver);
            wordContainer.addEventListener('drop', drop);
        });
    });

});

// Функция для перемешивания массива
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Обработчик события dragover (над пустыми квадратиками)
function dragOver(event) {
    event.preventDefault();
}
function drop(event) {
    event.preventDefault();
    const letter = event.dataTransfer.getData('text/plain');
    const dropTarget = event.target;
    const letterContainer = document.querySelector('.letter-container');

    if (dropTarget.classList.contains('word-square') && !dropTarget.textContent) {
        if (letter === dropTarget.dataset.expectedLetter) {
            // Устанавливаем букву и стилизацию для пустого квадратика
            dropTarget.textContent = letter;
            dropTarget.classList.add('filled');

            // Скрываем квадратик с буквой
            const letterSquares = letterContainer.querySelectorAll('.letter-square');
            letterSquares.forEach(letterSquare => {
                if (letterSquare.textContent === letter && letterSquare.style.opacity !== '0.5') {
                    letterSquare.style.opacity = '0.5';
                    letterSquare.style.pointerEvents = 'none';
                    return; // Выходим из функции forEach после того как нашли и обработали нужную букву
                }
            });
        }

        // Проверяем, правильно ли собрано слово
        const wordContainer = document.querySelector('.word-container');
        const wordSquares = wordContainer.querySelectorAll('.word-square');
        let wordIsCorrect = true;

        wordSquares.forEach(square => {
            const expectedLetter = square.dataset.expectedLetter;
            const actualLetter = square.textContent.trim();
            if (expectedLetter !== actualLetter) {
                wordIsCorrect = false;
            }
        });

        if (wordIsCorrect) {
            clearInterval(timerId); // Останавливаем таймер

            // Обновляем счет
            const scoreElement = document.getElementById('score');
            const score = parseInt(scoreElement.textContent);
            scoreElement.textContent = score + wordSquares.length;

            // Показываем кнопку "Играть еще"
            document.getElementById('play-again-button').style.display = 'block';
        }

    }

}
