const apiKey = '';		//use your own api key here
const upcomingSection = document.getElementById('upcomingGames');

// Get today date and 6 months from now for filtering upcoming games
const today = new Date().toISOString().split('T')[0];
const sixMonthsLater = new Date();
sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
const sixMonthsDate = sixMonthsLater.toISOString().split('T')[0];

fetch(`https://api.rawg.io/api/games?key=${apiKey}&dates=${today},${sixMonthsDate}&ordering=-added&page_size=30`)
  .then(res => res.json())
  .then(data => {
    displayUpcomingGames(data.results);
  })
  .catch(err => {
    console.error(err);
    upcomingSection.innerHTML = '<p>Failed to load upcoming games.</p>';
  });

function displayUpcomingGames(games) {
  upcomingSection.innerHTML = '';
  games.forEach(game => {
    const gameCard = document.createElement('div');
    gameCard.className = 'game-card';

    gameCard.innerHTML = `
      <a href="game.html?id=${game.id}">
        <img src="${game.background_image}" alt="${game.name}" />
        <div class="game-title">${game.name}</div>
      </a>
    `;

    upcomingSection.appendChild(gameCard);
  });
}
