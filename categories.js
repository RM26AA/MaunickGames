const apiKey = '';		//use your own api key here
const gameSection = document.getElementById('categoryGames');
const lettersContainer = document.querySelector('.letters');

// Generate A-Z buttons
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
alphabet.forEach(letter => {
  const btn = document.createElement('button');
  btn.textContent = letter;
  btn.classList.add('letter-btn');
  btn.onclick = () => fetchGamesByLetter(letter);
  lettersContainer.appendChild(btn);
});

function fetchGamesByLetter(letter) {
  gameSection.innerHTML = '<p>Loading...</p>';
  fetch(`https://api.rawg.io/api/games?key=${apiKey}&search=${letter}&page_size=20`)
    .then(res => res.json())
    .then(data => {
      displayGames(data.results);
    })
    .catch(err => {
      console.error(err);
      gameSection.innerHTML = '<p>Error loading games.</p>';
    });
}

function displayGames(games) {
  gameSection.innerHTML = '';
  if (games.length === 0) {
    gameSection.innerHTML = '<p>No games found.</p>';
    return;
  }

  games.forEach(game => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <a href="game.html?id=${game.id}">
        <img src="${game.background_image}" alt="${game.name}" />
        <div class="game-title">${game.name}</div>
      </a>
    `;
    gameSection.appendChild(card);
  });
}

const genreList = [
  { name: 'Action', image: 'https://store-images.s-microsoft.com/image/apps.58752.13942869738016799.078aba97-2f28-440f-97b6-b852e1af307a.95fdf1a1-efd6-4938-8100-8abae91695d6?q=90&w=336&h=200' },

  { name: 'Indie', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg' },
 
  { name: 'Strategy', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1593500/header.jpg' }
];

const genreCardsContainer = document.getElementById('genreCards');

genreList.forEach(genre => {
  const card = document.createElement('div');
  card.className = 'genre-card';
  card.innerHTML = `
    <img src="${genre.image}" alt="${genre.name}" />
    <h3>${genre.name}</h3>
  `;
  card.onclick = () => fetchGamesByGenre(genre.name);
  genreCardsContainer.appendChild(card);
});

function fetchGamesByGenre(genreName) {
  gameSection.innerHTML = `<p>Loading ${genreName} games...</p>`;
  fetch(`https://api.rawg.io/api/games?key=${apiKey}&genres=${encodeURIComponent(genreName.toLowerCase())}&page_size=20`)
    .then(res => res.json())
    .then(data => {
      displayGames(data.results);
    })
    .catch(err => {
      console.error(err);
      gameSection.innerHTML = `<p>Error loading ${genreName} games.</p>`;
    });
}

