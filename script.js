const apiKey = '';		//use your own api key here
const gameList = document.getElementById('gameList');

window.onload = () => {
  fetchPopularGames();
};

function fetchPopularGames() {
  showLoading();
  fetch(`https://api.rawg.io/api/games?key=${apiKey}&ordering=-rating&page_size=36`)
    .then(res => res.json())
    .then(data => {
      if (data.results.length === 0) {
        gameList.innerHTML = '<p class="no-results">No games found.</p>';
      } else {
        displayGames(data.results);
      }
    })
    .catch(err => {
      console.error(err);
      gameList.innerHTML = '<p class="no-results">Failed to load games.</p>';
    });
}

function searchGames() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;

  showLoading();
  fetch(`https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}&page_size=12`)
    .then(res => res.json())
    .then(data => {
      if (data.results.length === 0) {
        gameList.innerHTML = `<p class="no-results">No results found for "<strong>${query}</strong>".</p>`;
      } else {
        displayGames(data.results);
      }
    })
    .catch(err => {
      console.error(err);
      gameList.innerHTML = '<p class="no-results">Search failed. Please try again.</p>';
    });
}

function displayGames(games) {
  gameList.innerHTML = '';
  games.forEach(game => {
    const gameCard = document.createElement('div');
    gameCard.className = 'game-card';

    // Use placeholder image if none exists
    const imageUrl = game.background_image || 'https://via.placeholder.com/400x180?text=No+Image';

    gameCard.innerHTML = `
      <a href="game.html?id=${game.id}">
        <img src="${imageUrl}" alt="${game.name}" />
        <div class="game-title">${game.name}</div>
      </a>
    `;

    gameList.appendChild(gameCard);
  });
}

function showLoading() {
  gameList.innerHTML = '<p class="loading">Loading games...</p>';
}


