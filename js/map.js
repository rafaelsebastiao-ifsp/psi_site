'use strict';

let mapaInicializado = false;
let map;

async function initMap() {
  if (mapaInicializado) return;
  mapaInicializado = true;

  map = L.map('map').setView([-23.5505, -46.6333], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  try {
    const res = await fetch('http://localhost:8081/reunioes?size=50');
    const data = await res.json();
    const reunioes = data.content ?? [];

    for (const r of reunioes) {
      const coords = await geocodificar(r.endereco);
      if (!coords) continue;

      L.marker([coords.lat, coords.lng])
        .addTo(map)
        .bindPopup(`
          <div style="min-width:200px">
            <strong>${r.titulo}</strong><br>
            ${r.endereco}
          </div>
        `);
    }
  } catch (e) {
    console.error('Erro ao carregar mapa:', e);
  }

  setTimeout(() => map.invalidateSize(), 300);
}