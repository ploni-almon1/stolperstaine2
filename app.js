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
  backdrop: document.getElementById('detail-backdrop'),
  photo: document.getElementById('detail-photo'),
  name: document.getElementById('detail-name'),
  address: document.getElementById('detail-address'),
  bio: document.getElementById('detail-bio'),
  cleaned: document.getElementById('detail-cleaned'),
  link: document.getElementById('detail-link'),
  dateInput: document.getElementById('cleaning-date'),
  feedback: document.getElementById('cleaning-feedback'),
  btnStav: document.getElementById('btn-stav'),
  mapContainer: document.getElementById('map'),
  hamburgerBtn: document.getElementById('hamburger-btn'),
  mobileMenu: document.getElementById('mobile-menu'),
  headerHamburgerBtn: document.getElementById('header-hamburger-btn'),
  
  // Prvky pro vyhledávání
  btnSearchToggle: document.getElementById('btn-search-toggle'),
  searchBox: document.getElementById('search-box'),
  searchInput: document.getElementById('search-input'),
  searchSuggestions: document.getElementById('search-suggestions')
};

DOM.dateInput.max = new Date().toISOString().split("T")[0];
let currentStone = null;

// ==========================================
// 2. NAČÍTÁNÍ DAT
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
// 4. MAPA A KONTROLY
// ==========================================
const map = L.map('map', { zoomControl: false }).setView([50.035, 15.775], 14);

L.control.zoom({ position: 'topleft' }).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

const markersGroup = L.markerClusterGroup(); // Chytrá vrstva pro základní mapu
const cleaningGroup = L.layerGroup();        // Vrstva s automatickým pavoukem pro STAV

const CustomToolbar = L.Control.extend({
  options: { position: 'topleft' },
  onAdd: function () {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control custom-leaflet-buttons');

    const btnLayers = L.DomUtil.create('a', '', container);
    btnLayers.href = '#';
    btnLayers.title = 'Přepnout barvu podkladu';
    btnLayers.innerHTML = '<i class="fas fa-layer-group"></i>';

    const btnLocate = L.DomUtil.create('a', '', container);
    btnLocate.href = '#';
    btnLocate.title = 'Moje poloha';
    btnLocate.innerHTML = '<i class="fas fa-crosshairs"></i>';

    L.DomEvent.disableClickPropagation(container);

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
// 5. VYKRESLOVÁNÍ KAMENŮ A DETAIL
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
        let lineHtml = '';

        // Automatické generování "pavouka" pomocí CSS a matematiky
        if (size > 1) {
          const angle = index * (2 * Math.PI / size);
          const radius = 15 + (size * 1.5); // Čím víc kamenů, tím větší pavouk
          const offsetX = Math.cos(angle) * radius;
          const offsetY = Math.sin(angle) * radius;
          anchor = [7 - offsetX, 7 - offsetY];
          
          // Vykreslení propojovací čáry ke středu
          const degrees = (angle * 180 / Math.PI) + 180;
          lineHtml = `<div style="position: absolute; top: 6.5px; left: 7px; width: ${radius}px; height: 1.5px; background: rgba(0,0,0,0.4); transform-origin: 0 50%; transform: rotate(${degrees}deg); z-index: 1;"></div>`;
        }

        const statusClass = getCleaningStatus(stone.lastCleaned);
        
        // Zabalení bodu a čáry do jednoho prvku
        const iconHtml = `
          <div style="position: relative; width: 14px; height: 14px;">
            ${lineHtml}
            <div class="${statusClass}" style="position: relative; z-index: 2;"></div>
          </div>
        `;

        const icon = L.divIcon({
          className: '', 
          html: iconHtml, 
          iconSize: [14, 14], 
          iconAnchor: anchor
        });

        L.marker([stone.lat, stone.lng], { icon })
          .addTo(cleaningGroup)
          .on('click', () => openDetail(stone));
      });
      
      // Nakreslení malého středového bodu, aby to vypadalo přesně jako originální animace
      if (size > 1) {
         const centerIcon = L.divIcon({
            className: '',
            html: '<div style="width: 6px; height: 6px; background: rgba(0,0,0,0.6); border-radius: 50%; position: absolute; top: 4px; left: 4px;"></div>',
            iconSize: [14, 14],
            iconAnchor: [7, 7]
         });
         L.marker([group[0].lat, group[0].lng], { icon: centerIcon, interactive: false }).addTo(cleaningGroup);
      }
    });

  } else {
    map.addLayer(markersGroup);
    
    appStones.forEach(stone => {
      const icon = L.divIcon({
        className: '', html: `<div class="stone-icon-default"></div>`, iconSize: [14, 14], iconAnchor: [7, 7]
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

function openDetail(stone) {
  currentStone = stone;
  DOM.photo.src = stone.photo || "";
  DOM.name.textContent = stone.name;
  DOM.address.textContent = stone.address;
  DOM.bio.textContent = stone.bio || "Zde budou informace o osobě...";
  
  const s = getCleaningStatus(stone.lastCleaned);
  if (s === 'needs-cleaning') DOM.cleaned.textContent = 'Potřebuje očistit.';
  else DOM.cleaned.textContent = `Naposledy čištěno ${formatCz(stone.lastCleaned)}.`;
  
  DOM.dateInput.value = stone.lastCleaned || "";
  DOM.feedback.classList.add('hidden');
  DOM.backdrop.classList.add('active');
}

document.getElementById('close-detail').onclick = () => DOM.backdrop.classList.remove('active');

document.getElementById('cleaning-form').onsubmit = (e) => {
  e.preventDefault();
  if (!currentStone || !DOM.dateInput.value) return;
  saveData(currentStone.id, DOM.dateInput.value);
  DOM.cleaned.textContent = `Naposledy čištěno ${formatCz(DOM.dateInput.value)}.`;
  DOM.feedback.textContent = 'Uloženo.';
  DOM.feedback.style.color = '#27ae60';
  DOM.feedback.classList.remove('hidden');
  setTimeout(() => DOM.feedback.classList.add('hidden'), 2500);
};

let userLocationMarker = null;
map.on('locationfound', (e) => {
  if (userLocationMarker) userLocationMarker.setLatLng(e.latlng);
  else userLocationMarker = L.circleMarker(e.latlng, { color: '#3498db', fillColor: '#3498db', fillOpacity: 1, radius: 8, weight: 3 }).addTo(map);
});

// ==========================================
// 6. VYHLEDÁVÁNÍ (LUPA A NAŠEPTÁVAČ)
// ==========================================
const normalize = str => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

DOM.btnSearchToggle.addEventListener('click', () => {
  DOM.searchBox.classList.toggle('active');
  DOM.btnSearchToggle.classList.toggle('active');
  if (DOM.searchBox.classList.contains('active')) {
    DOM.searchInput.focus();
  } else {
    DOM.searchSuggestions.classList.add('hidden');
    DOM.searchInput.value = '';
  }
});

DOM.searchInput.addEventListener('input', (e) => {
  const query = normalize(e.target.value);
  DOM.searchSuggestions.innerHTML = '';
  
  if (query.length < 2) {
    DOM.searchSuggestions.classList.add('hidden');
    return;
  }
  
  const matches = appStones.filter(stone => normalize(stone.name).includes(query));
  
  if (matches.length > 0) {
    DOM.searchSuggestions.classList.remove('hidden');
    matches.forEach(stone => {
      const li = document.createElement('li');
      li.textContent = stone.name;
      
      li.addEventListener('click', () => {
        DOM.searchInput.value = '';
        DOM.searchBox.classList.remove('active');
        DOM.btnSearchToggle.classList.remove('active');
        DOM.searchSuggestions.classList.add('hidden');
        
        map.flyTo([stone.lat, stone.lng], 18, { duration: 1.5 });
        
        setTimeout(() => { openDetail(stone); }, 800);
      });
      
      DOM.searchSuggestions.appendChild(li);
    });
  } else {
    DOM.searchSuggestions.classList.add('hidden');
  }
});

// ==========================================
// 7. PŘEPÍNÁNÍ ZÁLOŽEK A MOBILNÍ MENU
// ==========================================
const navButtons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

if (DOM.hamburgerBtn) {
  DOM.hamburgerBtn.addEventListener('click', () => DOM.mobileMenu.classList.toggle('open'));
}
if (DOM.headerHamburgerBtn) {
  DOM.headerHamburgerBtn.addEventListener('click', () => DOM.mobileMenu.classList.toggle('open'));
}

map.on('click', () => DOM.mobileMenu.classList.remove('open'));
document.getElementById('page-uvod').addEventListener('click', () => DOM.mobileMenu.classList.remove('open'));

navButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const targetId = btn.getAttribute('data-target');
    if (!targetId) return; 
    
    e.preventDefault();
    navButtons.forEach(b => b.classList.remove('active'));
    document.querySelectorAll(`.nav-btn[data-target="${targetId}"]`).forEach(b => b.classList.add('active'));

    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(targetId).classList.add('active');
    DOM.mobileMenu.classList.remove('open');

    if (targetId === 'map-wrapper') {
      document.body.classList.add('map-active');
      setTimeout(() => { map.invalidateSize(); }, 100);
    } else {
      document.body.classList.remove('map-active');
    }
  });
});

// Start aplikace
loadSavedData();
