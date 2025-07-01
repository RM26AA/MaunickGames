const apiKey = '';		//use your own api key here
const topRatedSection = document.getElementById('topRatedGames');

fetch(`https://api.rawg.io/api/games?key=${apiKey}&ordering=-rating&page_size=30`)
  .then(res => res.json())
  .then(data => {
    displayTopRatedGames(data.results);
  })
  .catch(err => {
    console.error(err);
    topRatedSection.innerHTML = '<p>Failed to load top rated games.</p>';
  });

function displayTopRatedGames(games) {
  topRatedSection.innerHTML = '';
  games.forEach(game => {
    const gameCard = document.createElement('div');
    gameCard.className = 'game-card';

    gameCard.innerHTML = `
      <a href="game.html?id=${game.id}">
        <img src="${game.background_image}" alt="${game.name}" />
        <div class="game-title">${game.name}</div>
      </a>
    `;

    topRatedSection.appendChild(gameCard);
  });
}
