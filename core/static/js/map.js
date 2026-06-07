'use strict';

let mapaInicializado = false;
let map;

function initMap() {
  if (mapaInicializado) return;

  if (reunioesData.length === 0) {
    setTimeout(initMap, 150);
    return;
  }

  mapaInicializado = true;

  map = L.map('map').setView([-23.5505, -46.6333], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  reunioesData.forEach(p => {
    if (!p.lat || !p.lng) return;
    L.marker([p.lat, p.lng])
      .addTo(map)
      .bindPopup(`
        <div style="min-width:220px">
          <strong>${p.nome}</strong><br>
          ${p.endereco}
        </div>
      `);
  });

  setTimeout(() => map.invalidateSize(), 300);
}
