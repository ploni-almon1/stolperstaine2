// ==========================================
// 1. INICIALIZACE FIREBASE
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyAQFAJsupGxZykuNzHOsYHgm7ROqTIldZQ",
  authDomain: "stolpersteine-e9ed4.firebaseapp.com",
  projectId: "stolpersteine-e9ed4",
  storageBucket: "stolpersteine-e9ed4.firebasestorage.app",
  messagingSenderId: "953667739912",
  appId: "1:953667739912:web:e848da54d3ce4540094cbd"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let appStones = []; 

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
  btnStav: document.getElementById('btn-stav'),
  mapContainer: document.getElementById('map')
};

DOM.dateInput.max = new Date().toISOString().split("T")[0];
let currentStone = null;

// ==========================================
// 2. NAČÍTÁNÍ DAT (FIREBASE + AUTO-IMPORT)
// ==========================================
function loadSavedData() {
  db.collection("kameny").onSnapshot((querySnapshot) => {
    appStones = [];
    const dbIds = new Set();
    
    querySnapshot.forEach((doc) => {
      appStones.push(doc.data());
      dbIds.add(Number(doc.id));
    });

    if (typeof stolpersteine !== 'undefined' && stolpersteine.length > 0) {
      stolpersteine.forEach(stone => {
        if (!dbIds.has(stone.id)) {
          db.collection("kameny").doc(String(stone.id)).set(stone);
        }
      });
    } 
    renderMarkers();
  });
}

function saveData(id, dateIso) {
  db.collection("kameny").doc(String(id)).set({
    lastCleaned: dateIso
  }, { merge: true }).catch(error => alert("Chyba při ukládání."));
}

// ==========================================
// 3. LOGIKA BAREV
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
  if (months < MEDIUM_MONTHS) return "medium"; 
  return "needs-cleaning";
}

// ==========================================
// 4. MAPA, KONTROLY A VRSTVY
// ==========================================
// Nastavení mapy s vypnutým defaultním zoomem, abychom ho mohli vložit stylově
const map = L.map('map', { zoomControl: false }).setView([49.5937, 17.2508], 14);

// Přidání zoomu (bude mít naše kulaté CSS styly)
L.control.zoom({ position: 'topleft' }).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

const markersGroup = L.markerClusterGroup();
const cleaningGroup = L.layerGroup();

// Náš vlastní ovládací panel (Vrstvy a Terč) vlevo
const CustomToolbar = L.Control.extend({
  options: { position: 'topleft' },
  onAdd: function () {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control custom-leaflet-buttons');

    // Tlačítko vrstvy (černobílá/barva)
    const btnLayers = L.DomUtil.create('a', '', container);
    btnLayers.href = '#';
    btnLayers.title = 'Přepnout barvu podkladu';
    btnLayers.innerHTML = '<i class="fas fa-layer-group"></i>';

    // Tlačítko GPS
    const btnLocate = L.DomUtil.create('a', '', container);
    btnLocate.href = '#';
    btnLocate.title = 'Moje poloha';
    btnLocate.innerHTML = '<i class="fas fa-crosshairs"></i>';

    L.DomEvent.disableClickPropagation(container);

    // Přepínání třídy grayscale-tiles na mapě
    L.DomEvent.on(btnLayers, 'click', (e) => {
      L.DomEvent.stop(e);
      DOM.mapContainer.classList.toggle('grayscale-tiles');
    });

    L.DomEvent.on(btnLocate, 'click', (e) => {
      L.DomEvent.stop(e);
      map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true });
    });

    return container;
  }
});
map.addControl(new CustomToolbar());

// ==========================================
// 5. VYKRESLOVÁNÍ KAMENŮ
// ==========================================
function renderMarkers() {
  const isCleaningMode = DOM.btnStav.classList.contains('active');

  if (map.hasLayer(markersGroup)) map.removeLayer(markersGroup);
  if (map.hasLayer(cleaningGroup)) map.removeLayer(cleaningGroup);
  
  markersGroup.clearLayers();
  cleaningGroup.clearLayers();

  if (isCleaningMode) {
    map.addLayer(cleaningGroup);
    const groupsByCoords = {};
    
    appStones.forEach(stone => {
      const key = `${stone.lat},${stone.lng}`;
      if (!groupsByCoords[key]) groupsByCoords[key] = [];
      groupsByCoords[key].push(stone);
    });

    Object.values(groupsByCoords).forEach(group => {
      const size = group.length;
      group.forEach((stone, index) => {
        let anchor = [7, 7];
        if (size > 1) {
          const angle = index * (2 * Math.PI / size);
          const radius = 12; 
          const offsetX = Math.cos(angle) * radius;
          const offsetY = Math.sin(angle) * radius;
          anchor = [7 - offsetX, 7 - offsetY];
        }

        const statusClass = getCleaningStatus(stone.lastCleaned);
        const icon = L.divIcon({
          className: '',
          html: `<div class="${statusClass}"></div>`,
          iconSize: [14, 14],
          iconAnchor: anchor
        });

        L.marker([stone.lat, stone.lng], { icon })
          .addTo(cleaningGroup)
          .on('click', () => openDetail(stone));
      });
    });

  } else {
    map.addLayer(markersGroup);
    
    appStones.forEach(stone => {
      const icon = L.divIcon({
        className: '',
        html: `<div class="stone-icon-default"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });
      L.marker([stone.lat, stone.lng], { icon })
        .addTo(markersGroup)
        .on('click', () => openDetail(stone));
    });
  }
}

DOM.btnStav.addEventListener('click', () => {
  DOM.btnStav.classList.toggle('active');
  renderMarkers();
});

// ==========================================
// 6. UDÁLOSTI PANELU A LOKALIZACE
// ==========================================
function openDetail(stone) {
  currentStone = stone;
  DOM.photo.src = stone.photo || "";
  DOM.name.textContent = stone.name;
  DOM.address.textContent = '📍 ' + stone.address;
  DOM.bio.textContent = stone.bio || "Zde budou informace o osobě...";
  
  const s = getCleaningStatus(stone.lastCleaned);
  if (s === 'needs-cleaning') DOM.cleaned.textContent = '🧹 Potřebuje očistit!';
  else DOM.cleaned.textContent = `🧹 Naposledy čištěno ${formatCz(stone.lastCleaned)}`;
  
  DOM.dateInput.value = stone.lastCleaned || "";
  DOM.feedback.classList.add('hidden');
  DOM.panel.classList.add('active');
}

document.getElementById('close-detail').onclick = () => DOM.panel.classList.remove('active');

document.getElementById('cleaning-form').onsubmit = (e) => {
  e.preventDefault();
  if (!currentStone || !DOM.dateInput.value) return;
  saveData(currentStone.id, DOM.dateInput.value);
  DOM.cleaned.textContent = `🧹 Naposledy čištěno ${formatCz(DOM.dateInput.value)}`;
  DOM.feedback.textContent = '✓ Uloženo';
  DOM.feedback.style.color = '#27ae60';
  DOM.feedback.classList.remove('hidden');
  setTimeout(() => DOM.feedback.classList.add('hidden'), 2500);
};

let userLocationMarker = null;
map.on('locationfound', (e) => {
  if (userLocationMarker) {
    userLocationMarker.setLatLng(e.latlng);
  } else {
    userLocationMarker = L.circleMarker(e.latlng, {
      color: '#3498db', fillColor: '#3498db', fillOpacity: 1, radius: 8, weight: 3
    }).addTo(map);
  }
});
map.on('locationerror', () => alert("Nelze zjistit polohu."));

// Spuštění
loadSavedData();
