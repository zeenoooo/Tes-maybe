// script.js
// Interactive behaviors for the demo templates (Amazon-like and Spotify-like)
// Features:
// - Amazon-like: search filtering, add-to-cart counter persisted in localStorage
// - Spotify-like: play preview toggle, album art pulse animation

(function(){
  // Utils
  function qs(sel, root=document) { return root.querySelector(sel); }
  function qsa(sel, root=document) { return Array.from(root.querySelectorAll(sel)); }

  // AMAZON-LIKE BEHAVIORS
  function setupEcommerce() {
    const searchInput = qs('.search input[type="search"]');
    const productCards = qsa('.products .card');
    const cartLink = Array.from(document.querySelectorAll('.header-nav a')).find(a => /cart/i.test(a.textContent));

    if (!searchInput || !productCards.length) return;

    // Filter products as user types
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      productCards.forEach(card => {
        const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
        const desc = (card.querySelector('p')?.textContent || '').toLowerCase();
        const matches = !q || title.includes(q) || desc.includes(q);
        card.style.display = matches ? '' : 'none';
      });
    });

    // Add to cart behavior
    productCards.forEach(card => {
      const btn = card.querySelector('button');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const count = Number(localStorage.getItem('mini_store_cart') || 0) + 1;
        localStorage.setItem('mini_store_cart', String(count));
        updateCartLink();
        // small visual feedback
        btn.textContent = 'Added ✓';
        setTimeout(() => btn.textContent = 'Add to cart', 900);
      });
    });

    function updateCartLink(){
      if (!cartLink) return;
      const count = Number(localStorage.getItem('mini_store_cart') || 0);
      cartLink.textContent = count ? `Cart (${count})` : 'Cart';
    }

    // initial
    updateCartLink();
  }

  // SPOTIFY-LIKE BEHAVIORS
  function setupMusic() {
    const playButton = qs('.play');
    const album = qs('.right .album') || qs('.album');
    const tiles = qsa('.playlists .tile');

    if (playButton && album) {
      let playing = false;
      playButton.addEventListener('click', (e) => {
        e.preventDefault();
        playing = !playing;
        if (playing) {
          playButton.textContent = 'Playing ▮▮';
          album.classList.add('playing');
        } else {
          playButton.textContent = 'Play';
          album.classList.remove('playing');
        }
      });

      // keyboard: Space toggles when focus on button
      playButton.addEventListener('keydown', (e) => {
        if (e.code === 'Space') { e.preventDefault(); playButton.click(); }
      });

      // Add a simple CSS hint for playing state (injected)
      const style = document.createElement('style');
      style.textContent = `
        .album.playing { box-shadow: 0 8px 30px rgba(29,185,84,0.18); transform: translateY(-4px); transition: transform 220ms ease; }
        .album { transition: transform 220ms ease, box-shadow 220ms ease; }
      `;
      document.head.appendChild(style);
    }

    // Tiles click: simple detail toggle
    tiles.forEach(tile => {
      tile.style.cursor = 'pointer';
      tile.addEventListener('click', () => {
        const title = tile.querySelector('h3')?.textContent || 'Playlist';
        // show a transient toast
        showToast(`Selected: ${title}`);
      });
    });
  }

  // Small toast helper (reusable)
  function showToast(message, timeout=1600){
    const t = document.createElement('div');
    t.textContent = message;
    Object.assign(t.style, {
      position: 'fixed',
      right: '16px',
      bottom: '18px',
      background: 'rgba(0,0,0,0.75)',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: '8px',
      zIndex: 9999,
      fontSize: '14px',
      opacity: 0,
      transition: 'opacity 160ms ease, transform 160ms ease',
      transform: 'translateY(6px)'
    });
    document.body.appendChild(t);
    requestAnimationFrame(() => { t.style.opacity = 1; t.style.transform = 'translateY(0)'; });
    setTimeout(() => {
      t.style.opacity = 0; t.style.transform = 'translateY(8px)';
      setTimeout(() => t.remove(), 220);
    }, timeout);
  }

  // Auto-detect which template is present and initialize
  function init(){
    document.addEventListener('DOMContentLoaded', () => {
      setupEcommerce();
      setupMusic();
    });
  }

  init();
})();
