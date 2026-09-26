(() => {
  const buttons =
    document.querySelectorAll('.game-play');

  const message =
    document.getElementById('gameMessage');

  if (!buttons.length || !message) {
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener(
      'click',
      () => {
        const game =
          button.dataset.game;

        message.textContent =
          game +
          ' — demo launcher coming soon.';
      }
    );
  });
})();
