(() => {
  const board = document.getElementById('gameBoard');
  const startButton = document.getElementById('gameStart');
  const status = document.getElementById('gameStatus');
  const score = document.getElementById('gameScore');

  if (!board || !startButton || !status || !score) {
    return;
  }

  let nextNumber = 1;
  let points = 0;
  let startedAt = 0;

  function shuffle(numbers) {
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [numbers[i], numbers[j]] =
        [numbers[j], numbers[i]];
    }

    return numbers;
  }

  function updateScore() {
    score.textContent = points;
  }

  function finish() {
    const elapsed =
      ((Date.now() - startedAt) / 1000)
        .toFixed(2);

    status.textContent =
      'Complete in ' +
      elapsed +
      's — score: ' +
      points +
      '.';

    startButton.textContent =
      'PLAY AGAIN';
  }

  function handleNumber(button) {
    const value =
      Number(button.dataset.number);

    if (value !== nextNumber) {
      button.classList.remove('wrong');
      void button.offsetWidth;
      button.classList.add('wrong');

      status.textContent =
        'Find ' +
        nextNumber +
        ' next.';

      return;
    }

    button.classList.add('correct');
    points += 10;
    nextNumber += 1;

    updateScore();

    if (nextNumber > 25) {
      finish();
      return;
    }

    status.textContent =
      'Next: ' +
      nextNumber;
  }

  function startGame() {
    nextNumber = 1;
    points = 0;
    startedAt = Date.now();

    updateScore();
    board.replaceChildren();

    shuffle(
      Array.from(
        { length: 25 },
        (_, index) => index + 1
      )
    ).forEach((number) => {
      const button =
        document.createElement('button');

      button.type = 'button';
      button.className = 'game-number';
      button.dataset.number = number;
      button.textContent = number;

      button.addEventListener(
        'click',
        () => handleNumber(button)
      );

      board.appendChild(button);
    });

    startButton.textContent =
      'RESTART';

    status.textContent =
      'Find 1 to start.';
  }

  startButton.addEventListener(
    'click',
    startGame
  );

  startGame();
})();
