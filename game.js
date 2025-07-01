const apiKey = '';		//use your own api key here
const gameDetail = document.getElementById('gameDetail');
const gameId = new URLSearchParams(window.location.search).get('id');

if (!gameId) {
  gameDetail.innerHTML = '<p>Game not found.</p>';
} else {
  fetch(`https://api.rawg.io/api/games/${gameId}?key=${apiKey}`)
    .then(res => res.json())
    .then(game => {
      const platforms = game.platforms.map(p => p.platform.name).join(', ');
      const genres = game.genres.map(g => g.name).join(', ');
      const tags = game.tags.slice(0, 5).map(t => t.name).join(', ');
      const devs = game.developers.map(d => d.name).join(', ');
      const pubs = game.publishers.map(p => p.name).join(', ');
      const ratingStars = '★'.repeat(Math.round(game.rating)) + '☆'.repeat(5 - Math.round(game.rating));

      gameDetail.innerHTML = `
        <h1>${game.name}</h1>
        <img src="${game.background_image}" alt="${game.name}" class="detail-cover" />

        <div class="info-cards">
          <div class="info-card"><i data-lucide="star"></i><strong>Rating:</strong><br>${game.rating} / ${game.rating_top}<br><span class="stars">${ratingStars}</span></div>
          <div class="info-card"><i data-lucide="monitor-smartphone"></i><strong>Platforms:</strong><br>${platforms}</div>
          <div class="info-card"><i data-lucide="shapes"></i><strong>Genres:</strong><br>${genres}</div>
          <div class="info-card"><i data-lucide="tags"></i><strong>Tags:</strong><br>${tags}</div>
          <div class="info-card"><i data-lucide="code"></i><strong>Developers:</strong><br>${devs}</div>
          <div class="info-card"><i data-lucide="building-2"></i><strong>Publishers:</strong><br>${pubs}</div>
          <div class="info-card"><i data-lucide="globe"></i><strong>Website:</strong><br><a href="${game.website}" target="_blank" class="site-link">${game.website}</a></div>
        </div>

        <div class="description"><strong>Description:</strong><br>${game.description}</div>

        <div id="screenshots"><h3>Screenshots</h3></div>

        <br><a href="index.html" class="back-button">← Back to Home</a>
      `;

      lucide.createIcons();

      // Fetch screenshots
      fetch(`https://api.rawg.io/api/games/${gameId}/screenshots?key=${apiKey}`)
        .then(res => res.json())
        .then(data => {
          const gallery = document.getElementById('screenshots');
          data.results.slice(0, 5).forEach(ss => {
            const img = document.createElement('img');
            img.src = ss.image;
            img.className = 'screenshot';
            img.onclick = () => openModal(ss.image);
            gallery.appendChild(img);
          });
        });
    })
    .catch(err => {
      console.error(err);
      gameDetail.innerHTML = '<p>Error loading game details.</p>';
    });
}

// Modal logic
function openModal(src) {
  const modal = document.getElementById('screenshotModal');
  const modalImage = document.getElementById('modalImage');
  modalImage.src = src;
  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('screenshotModal').classList.add('hidden');
}

