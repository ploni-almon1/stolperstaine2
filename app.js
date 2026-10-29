// Data zůstávají stejná (pole stolpersteine)...
// Do pole stolpersteine doporučuji jen smazat prázdný lastCleaned a nechat načítání z LocalStorage.

// ==========================================
// CACHOVÁNÍ DOM ELEMENTŮ (Optimalizace výkonu)
// ==========================================
const DOM = {
  panel: document.getElementById('detail-panel'),
  photo: document.getElementById('detail-photo'),
  name: document.getElementById('detail-name'),
  address: document.getElementById('detail-address'),
  bio: document.getElementById('detail-bio'),
  cleaned: document.getElementById('detail-cleaned'),
  link: document.getElementById('detail-link'),
  dateInput: document.getElementById('cleaning-date'),
  feedback: document.getElementById('cleaning-feedback'),
  mapContainer: document.getElementById('map')
};

// Nastavení maximálního data na dnešek
DOM.dateInput.max = new Date().toISOString().split("T")[0];

let currentStone = null;

// ==========================================
// LOKÁLNÍ ÚLOŽIŠTĚ (Aby data nezmizela po F5)
// ==========================================
function loadSavedData() {
  const saved = JSON.parse(localStorage.getItem('stolpersteineData') || '{}');
  stolpersteine.forEach(stone => {
    if (saved[stone.id]) stone.lastCleaned = saved[stone.id];
  });
}
function saveData(id, dateIso) {
  const saved = JSON.parse(localStorage.getItem('stolpersteineData') || '{}');
  saved[id] = dateIso;
  localStorage.setItem('stolpersteineData', JSON.stringify(saved));
}

// ==========================================
// POMOCNÉ FUNKCE
// ==========================================
function formatCz(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${parseInt(d)}. ${parseInt(m)}. ${y}`;
}

const FRESH_MONTHS = 4;
const MEDIUM_MONTHS = 8;

function getCleaningStatus(dateStr) {
  if (!dateStr) return "needs-cleaning";
  const then = new Date(dateStr);
  const now = new Date();
  const months = (now.getFullYear() - then.getFullYear()) * 12 + (now.getMonth() - then.getMonth());
  
  if (months < FRESH_MONTHS) return "recently-cleaned";
  if (months < MEDIUM_MONTHS) return "medium"; /* Přidat .medium do CSS, např. oranžová */
  return "needs-cleaning";
}

function getStatusText(dateStr) {
  if (!dateStr) return "Bez záznamu o čištění";
  const s = getCleaningStatus(dateStr);
  if (s === 'recently-cleaned') return `Naposledy čištěno ${formatCz(dateStr)} (čerstvé)`;
  if (s === 'medium') return `Naposledy čištěno ${formatCz(dateStr)} (střední)`;
  return `Naposledy čištěno ${formatCz(dateStr)} – potřebuje očistit!`;
}

// ==========================================
// MAPA A VYKRESLOVÁNÍ
// ==========================================
const map = L.map('map').setView([50.035, 15.775], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

const markersGroup = L.markerClusterGroup().addTo(map);

const LocateControl = L.Control.extend({
  options: { position: 'topleft' },
  onAdd: function () {
    const btn = L.DomUtil.create('button', 'locate-btn-custom leaflet-bar');
    btn.type = 'button';
    btn.innerHTML = '◎';
    btn.title = 'Moje poloha';
    L.DomEvent.disableClickPropagation(btn);
    L.DomEvent.on(btn, 'click', (e) => {
      L.DomEvent.stop(e);
      map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true });
    });
    return btn;
  }
});
map.addControl(new LocateControl());

function renderMarkers() {
  markersGroup.clearLayers();
  stolpersteine.forEach(stone => {
    const statusClass = getCleaningStatus(stone.lastCleaned);
    const icon = L.divIcon({
      className: '',
      html: `<div class="stone-icon ${statusClass}"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });
    L.marker([stone.lat, stone.lng], { icon }).addTo(markersGroup).on('click', () => openDetail(stone));
  });
}

// ==========================================
// OVLÁDÁNÍ A UDÁLOSTI
// ==========================================
function openDetail(stone) {
  currentStone = stone;
  DOM.photo.src = stone.photo;
  DOM.name.textContent = stone.name;
  DOM.address.textContent = '📍 ' + stone.address;
  DOM.bio.textContent = stone.bio;
  DOM.link.href = stone.link;
  DOM.cleaned.textContent = '🧹 ' + getStatusText(stone.lastCleaned);
  
  DOM.dateInput.value = stone.lastCleaned || "";
  DOM.feedback.classList.add('hidden');

  DOM.panel.classList.add('active');
  document.body.classList.add('panel-open');
}

document.getElementById('close-detail').onclick = () => {
  DOM.panel.classList.remove('active');
  document.body.classList.remove('panel-open');
};

document.getElementById('cleaning-form').onsubmit = (e) => {
  e.preventDefault();
  if (!currentStone || !DOM.dateInput.value) return;

  const iso = DOM.dateInput.value;
  currentStone.lastCleaned = iso;
  saveData(currentStone.id, iso); // Uložíme do prohlížeče

  DOM.cleaned.textContent = '🧹 ' + getStatusText(iso);
  DOM.feedback.textContent = '✓ Uloženo';
  DOM.feedback.style.color = '#27ae60';
  DOM.feedback.classList.remove('hidden');
  setTimeout(() => DOM.feedback.classList.add('hidden'), 2500);

  renderMarkers();
};

document.getElementById('toggle-grayscale').onchange = (e) => {
  DOM.mapContainer.classList.toggle('grayscale-mode', e.target.checked);
};

map.on('locationfound', (e) => {
  L.circleMarker(e.latlng, {
    color: '#3498db', fillColor: '#3498db', fillOpacity: 1, radius: 8, weight: 3
  }).addTo(map).bindPopup("📍 Jste zde").openPopup();
});

// Inicializace
loadSavedData();
renderMarkers();
