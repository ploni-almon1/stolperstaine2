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

// Spuštění Firebase a napojení na databázi
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Pole pro kameny stažené z databáze
let appStones = []; 

// ==========================================
// 2. CACHOVÁNÍ DOM ELEMENTŮ A SETUP
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
  mapContainer: document.getElementById('map'),
  toggleCleaning: document.getElementById('toggle-cleaning')
};

DOM.dateInput.max = new Date().toISOString().split("T")[0];
let currentStone = null;

// ==========================================
// 3. NAČÍTÁNÍ DAT Z DATABÁZE V REÁLNÉM ČASE
// ==========================================
function loadSavedData() {
  // onSnapshot neustále naslouchá databázi. Když někdo jiný uloží čištění,
  // tento blok se automaticky spustí u všech ostatních a mapa se přebarví!
  db.collection("kameny").onSnapshot((querySnapshot) => {
    appStones = [];
    querySnapshot.forEach((doc) => {
      appStones.push(doc.data());
    });

    // AUTO-IMPORT: Pokud je databáze prázdná, nahrajeme do ní data z data.js
    if (appStones.length === 0 && typeof stolpersteine !== 'undefined' && stolpersteine.length > 0) {
      console.log("Nahrávám počáteční data do Firebase...");
      stolpersteine.forEach(stone => {
        // ID kamene použijeme jako ID dokumentu v databázi
        db.collection("kameny").doc(String(stone.id)).set(stone);
      });
    } else {
      // Vykreslíme mapu s čerstvými daty z internetu
      renderMarkers();
    }
  });
}

// Odeslání nového data čištění na server
function saveData(id, dateIso) {
  db.collection("kameny").doc(String(id)).update({
    lastCleaned: dateIso
  }).catch(error => {
    console.error("Chyba při ukládání do DB: ", error);
    alert("Chyba při ukládání. Zkontrolujte připojení k internetu.");
  });
}

// ==========================================
// 4. LOGIKA BAREV PODLE MĚSÍCŮ
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

function getStatusText(dateStr) {
  if (!dateStr) return "Bez záznamu o čištění";
  const s = getCleaningStatus(dateStr);
  if (s === 'recently-cleaned') return `Naposledy čištěno ${formatCz(dateStr)} (čerstvé)`;
  if (s === 'medium') return `Naposledy čištěno ${formatCz(dateStr)} (střední)`;
  return `Naposledy čištěno ${formatCz(dateStr)} – potřebuje očistit!`;
}

// ==========================================
// 5. MAPA A VRSTVY
// ==========================================
const map = L.map('map').setView([50.035, 15.775], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

const markersGroup = L.markerClusterGroup();
const cleaningGroup = L.layerGroup();

// --- Nový sdružený ovládací prvek (Vrstvy + Poloha) ---
const CustomToolbar = L.Control.extend({
  options: { position: 'topleft' },
  onAdd: function () {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');

    const btnLayers = L.DomUtil.create('a', 'custom-leaflet-btn', container);
    btnLayers.href = '#';
    btnLayers.title = 'Přepnout barevnou / černobílou mapu';
    btnLayers.innerHTML = `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 12 12 17 22 12"></polyline><polyline points="2 17 12 22 22 17"></polyline></svg>`;

    const btnLocate = L.DomUtil.create('a', 'custom-leaflet-btn', container);
    btnLocate.href = '#';
    btnLocate.title = 'Moje poloha';
    btnLocate.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2" fill="currentColor"></circle><circle cx="12" cy="12" r="7"></circle><line x1="12" y1="1" x2="12" y2="5"></line><line x1="12" y1="19" x2="12" y2="23"></line><line x1="1" y1="12" x2="5" y2="12"></line><line x1="19" y1="12" x2="23" y2="12"></line></svg>`;

    L.DomEvent.disableClickPropagation(container);

    L.DomEvent.on(btnLayers, 'click', (e) => {
      L.DomEvent.stop(e);
      DOM.mapContainer.classList.toggle('grayscale-mode'); 
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
// 6. VYKRESLOVÁNÍ KAMENŮ
// ==========================================
function renderMarkers() {
  const isCleaningMode = DOM.toggleCleaning.checked;

  if (map.hasLayer(markersGroup)) map.removeLayer(markersGroup);
  if (map.hasLayer(cleaningGroup)) map.removeLayer(cleaningGroup);
  
  markersGroup.clearLayers();
  cleaningGroup.clearLayers();

  if (isCleaningMode) {
    map.addLayer(cleaningGroup);
    const groupsByCoords = {};
    
    // Používáme appStones načtené z Firebase!
    appStones.forEach(stone => {
      const key = `${stone.lat},${stone.lng}`;
      if (!groupsByCoords[key]) groupsByCoords[key] = [];
      groupsByCoords[key].push(stone);
    });

    Object.values(groupsByCoords).forEach(group => {
      const size = group.length;
      group.forEach((stone, index) => {
        let anchor = [9, 9];
        if (size > 1) {
          const angle = index * (2 * Math.PI / size);
          const radius = 14; 
          const offsetX = Math.cos(angle) * radius;
          const offsetY = Math.sin(angle) * radius;
          anchor = [9 - offsetX, 9 - offsetY];
        }

        const statusClass = getCleaningStatus(stone.lastCleaned);
        const icon = L.divIcon({
          className: '',
          html: `<div class="stone-icon ${statusClass}"></div>`,
          iconSize: [18, 18],
          iconAnchor: anchor
        });

        L.marker([stone.lat, stone.lng], { icon })
          .addTo(cleaningGroup)
          .on('click', () => openDetail(stone));
      });
    });

  } else {
    map.addLayer(markersGroup);
    
    // Používáme appStones načtené z Firebase!
    appStones.forEach(stone => {
      const statusClass = getCleaningStatus(stone.lastCleaned);
      const icon = L.divIcon({
        className: '',
        html: `<div class="stone-icon ${statusClass}"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      L.marker([stone.lat, stone.lng], { icon })
        .addTo(markersGroup)
        .on('click', () => openDetail(stone));
    });
  }
}

DOM.toggleCleaning.addEventListener('change', renderMarkers);

// ==========================================
// 7. OVLÁDÁNÍ A UDÁLOSTI
// ==========================================
function openDetail(stone) {
  currentStone = stone;
  DOM.photo.src = stone.photo || ""; // Zobrazí fotku z Firebase
  DOM.name.textContent = stone.name;
  DOM.address.textContent = '📍 ' + stone.address;
  DOM.bio.textContent = stone.bio;
  DOM.link.href = stone.link || "#";
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
  // Odeslání na server Firebase
  saveData(currentStone.id, iso);

  DOM.cleaned.textContent = '🧹 ' + getStatusText(iso);
  DOM.feedback.textContent = '✓ Uloženo online';
  DOM.feedback.style.color = '#27ae60';
  DOM.feedback.classList.remove('hidden');
  setTimeout(() => DOM.feedback.classList.add('hidden'), 2500);

  // Poznámka: Zde už nemusíme volat renderMarkers(), protože ho automaticky
  // zavolá Firebase "onSnapshot", jakmile dorazí potvrzení o uložení ze serveru!
};

// Lokalizace GPS vykreslení na mapě
let userLocationMarker = null;
map.on('locationfound', (e) => {
  if (userLocationMarker) {
    userLocationMarker.setLatLng(e.latlng);
  } else {
    userLocationMarker = L.circleMarker(e.latlng, {
      color: '#3498db', fillColor: '#3498db', fillOpacity: 1, radius: 8, weight: 3
    }).addTo(map);
  }
  userLocationMarker.bindPopup("Vaše aktuální poloha").openPopup();
});

map.on('locationerror', () => {
  alert("Polohu nelze zjistit. Zkontrolujte, zda máte zapnutou GPS a web běží na zabezpečeném připojení (HTTPS).");
});

// ==========================================
// START APLIKACE
// ==========================================
// Spustíme načítání z Firebase
loadSavedData();
