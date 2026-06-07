'use strict';

let videosRendered = false;

function renderVideos() {
  if (videosData.length === 0) {
    setTimeout(renderVideos, 150);
    return;
  }
  if (videosRendered) return;

  const grid = document.getElementById('videosGrid');
  if (!grid) return;

  grid.innerHTML = videosData.map(v => `
    <div class="video-card" data-action="play-video" data-url="${v.url || ''}">
      <div class="video-thumbnail">
        <img src="/static/${v.thumb}" alt="${v.titulo}" loading="lazy"
             onerror="this.style.background='#334155';this.style.height='160px'">
        <div class="video-play" aria-hidden="true"></div>
      </div>
      <div class="video-info">
        <h4>${v.titulo}</h4>
        <div class="video-meta">${v.canal} · ${v.views} visualizações</div>
      </div>
    </div>
  `).join('');

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('[data-action="play-video"]');
    if (!card) return;
    const url = card.dataset.url;
    if (url) window.open(url, '_blank');
    else toast('Vídeo em breve!');
  });

  videosRendered = true;
}
