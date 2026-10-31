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

// ==========================================
// 2. DOM ELEMENTY
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
  btnStav: document.getElementById('btn-stav') // Nové tlačítko
};

DOM.dateInput.max = new Date().toISOString().split("T")[0];
let currentStone = null;

// ==========================================
// 3. NAČÍTÁNÍ DAT Z DATABÁZE V REÁLNÉM ČASE
// ==========================================
function loadSavedData() {
  db.collection("kameny").onSnapshot((querySnapshot) => {
    appStones = [];
    const dbIds = new Set();
    
    querySnapshot.forEach((doc) => {
      appStones.push(doc.data());
      dbIds.add(Number(doc.id));
    });

    // CHYTRÝ AUTO-IMPORT (zabrání přemazání)
    if (typeof stolpersteine !== 'undefined' && stolpersteine.length > 0) {
      stolpersteine.forEach(stone => {
        if (!dbIds.has(stone.id)) {
          console.log("Přidávám do DB: ", stone.name);
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
  }, { merge: true }).catch(error => {
    console.error("Chyba při ukládání: ", error);
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
const map = L.map('map', { zoomControl: false }).setView([49.5937, 17.2508], 14);
L.control.zoom({ position: 'topleft' }).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

const markersGroup = L.markerClusterGroup();
const cleaningGroup = L.layerGroup();

// ==========================================
// 6. VYKRESLOVÁNÍ KAMENŮ A TLAČÍTKO "STAV"
// ==========================================
function renderMarkers() {
  const isCleaningMode = DOM.btnStav.classList.contains('active');

  if (map.hasLayer(markersGroup)) map.removeLayer(markersGroup);
  if (map.hasLayer(cleaningGroup)) map.removeLayer(cleaningGroup);
  
  markersGroup.clearLayers();
  cleaningGroup.clearLayers();

  if (isCleaningMode) {
    // REŽIM STAV: Semafor (Zelená/Oranžová/Červená)
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
        let anchor = [8, 8];
        if (size > 1) {
          const angle = index * (2 * Math.PI / size);
          const radius = 14; 
          const offsetX = Math.cos(angle) * radius;
          const offsetY = Math.sin(angle) * radius;
          anchor = [8 - offsetX, 8 - offsetY];
        }

        const statusClass = getCleaningStatus(stone.lastCleaned);
        const icon = L.divIcon({
          className: '',
          html: `<div class="${statusClass}"></div>`,
          iconSize: [16, 16],
          iconAnchor: anchor
        });

        L.marker([stone.lat, stone.lng], { icon })
          .addTo(cleaningGroup)
          .on('click', () => openDetail(stone));
      });
    });

  } else {
    // VÝCHOZÍ REŽIM: Všechny kameny ve vaší žluté barvě
    map.addLayer(markersGroup);
    
    appStones.forEach(stone => {
      const icon = L.divIcon({
        className: '',
        html: `<div class="stone-icon-default"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      L.marker([stone.lat, stone.lng], { icon })
        .addTo(markersGroup)
        .on('click', () => openDetail(stone));
    });
  }
}

// Přepínání tlačítka
DOM.btnStav.addEventListener('click', () => {
  DOM.btnStav.classList.toggle('active');
  renderMarkers();
});

// ==========================================
// 7. OVLÁDÁNÍ BOČNÍHO PANELU A FORMULÁŘE
// ==========================================
function openDetail(stone) {
  currentStone = stone;
  DOM.photo.src = stone.photo || "";
  DOM.name.textContent = stone.name;
  DOM.address.textContent = '📍 ' + stone.address;
  DOM.bio.textContent = stone.bio;
  DOM.link.href = stone.link || "#";
  DOM.cleaned.textContent = '🧹 ' + getStatusText(stone.lastCleaned);
  
  DOM.dateInput.value = stone.lastCleaned || "";
  DOM.feedback.classList.add('hidden');

  DOM.panel.classList.add('active');
}

document.getElementById('close-detail').onclick = () => {
  DOM.panel.classList.remove('active');
};

document.getElementById('cleaning-form').onsubmit = (e) => {
  e.preventDefault();
  if (!currentStone || !DOM.dateInput.value) return;

  const iso = DOM.dateInput.value;
  saveData(currentStone.id, iso);

  DOM.cleaned.textContent = '🧹 ' + getStatusText(iso);
  DOM.feedback.textContent = '✓ Uloženo online';
  DOM.feedback.style.color = '#27ae60';
  DOM.feedback.classList.remove('hidden');
  setTimeout(() => DOM.feedback.classList.add('hidden'), 2500);
};

// ==========================================
// START
// ==========================================
loadSavedData();
