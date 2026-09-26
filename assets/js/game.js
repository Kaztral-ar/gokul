(() => {
  const track =
    document.querySelector('.steam-track');

  const message =
    document.getElementById('gameMessage');

  if (!track || !message) {
    return;
  }

  const cards =
    Array.from(track.children);

  cards.forEach((card) => {
    const clone =
      card.cloneNode(true);

    clone.setAttribute(
      'aria-hidden',
      'true'
    );

    track.appendChild(clone);
  });

  track.addEventListener(
    'click',
    (event) => {
      const button =
        event.target.closest('.steam-play');

      if (!button) {
        return;
      }

      const game =
        button.dataset.game;

      message.textContent =
        game +
        ' — demo launcher coming soon.';
    }
  );
})();
