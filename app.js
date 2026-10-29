// ==========================================
// 1. DATA – Stolpersteiny Pardubice
// ==========================================
const stolpersteine = [
  { id: 1, name: "Pavel Bauer", address: "Perštýnské náměstí čp. 77, Pardubice", lat: 50.038056, lng: 15.778333, photo: "https://picsum.photos/seed/1/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 2, name: "Augusta Bauerová (roz. Österreicherová)", address: "Perštýnské náměstí čp. 77, Pardubice", lat: 50.038056, lng: 15.778333, photo: "https://picsum.photos/seed/2/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 3, name: "Barbora Fischerová (roz. Herrmannová)", address: "Smilova čp. 401, Pardubice", lat: 50.033889, lng: 15.769444, photo: "https://picsum.photos/seed/3/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 4, name: "Eduard Freund", address: "Karla IV. čp. 13, Pardubice", lat: 50.036944, lng: 15.779444, photo: "https://picsum.photos/seed/4/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 5, name: "Eugen Freund", address: "Karla IV. čp. 13, Pardubice", lat: 50.036944, lng: 15.779444, photo: "https://picsum.photos/seed/5/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 6, name: "Emilie Freundová (roz. Kleinová)", address: "Karla IV. čp. 13, Pardubice", lat: 50.036944, lng: 15.779444, photo: "https://picsum.photos/seed/6/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 7, name: "Otto Freund", address: "Nerudova čp. 894, Pardubice", lat: 50.037500, lng: 15.775000, photo: "https://picsum.photos/seed/7/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 8, name: "Rudolf Freund", address: "Nerudova čp. 894, Pardubice", lat: 50.037500, lng: 15.775000, photo: "https://picsum.photos/seed/8/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 9, name: "Anna Freundová (roz. Hönigsfeldová)", address: "Nerudova čp. 894, Pardubice", lat: 50.037500, lng: 15.775000, photo: "https://picsum.photos/seed/9/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 10, name: "Elsa Freundová (roz. Kafková)", address: "Nerudova čp. 894, Pardubice", lat: 50.037500, lng: 15.775000, photo: "https://picsum.photos/seed/10/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 11, name: "Ilona Freundová", address: "Nerudova čp. 894, Pardubice", lat: 50.037500, lng: 15.775000, photo: "https://picsum.photos/seed/11/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 12, name: "Nora Lea Freundová", address: "Nerudova čp. 894, Pardubice", lat: 50.037500, lng: 15.775000, photo: "https://picsum.photos/seed/12/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 13, name: "Leo Fürnberg", address: "Teplého čp. 1598, Pardubice", lat: 50.027222, lng: 15.767778, photo: "https://picsum.photos/seed/13/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 14, name: "Kurt Fürnberg", address: "Teplého čp. 1598, Pardubice", lat: 50.027222, lng: 15.767778, photo: "https://picsum.photos/seed/14/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 15, name: "Pavla Fürnbergová (roz. Hauserová)", address: "Teplého čp. 1598, Pardubice", lat: 50.027222, lng: 15.767778, photo: "https://picsum.photos/seed/15/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 16, name: "Rudolf Gottlieb", address: "Perštýnské náměstí čp. 4, Pardubice", lat: 50.038889, lng: 15.779167, photo: "https://picsum.photos/seed/16/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 17, name: "Hana Gottliebová (roz. Adlerová)", address: "Perštýnské náměstí čp. 4, Pardubice", lat: 50.038889, lng: 15.779167, photo: "https://picsum.photos/seed/17/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 18, name: "Marie Hesová (roz. Kafková)", address: "Škroupova čp. 736, Pardubice", lat: 50.034722, lng: 15.787778, photo: "https://picsum.photos/seed/18/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 19, name: "Alfréd Hoch", address: "Štrossova čp. 44, Pardubice", lat: 50.037778, lng: 15.787222, photo: "https://picsum.photos/seed/19/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 20, name: "Cecilie Hochová (roz. Munková)", address: "Štrossova čp. 44, Pardubice", lat: 50.037778, lng: 15.787222, photo: "https://picsum.photos/seed/20/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 21, name: "Rudolf Kafka", address: "Nerudova čp. 894, Pardubice", lat: 50.037500, lng: 15.775000, photo: "https://picsum.photos/seed/21/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 22, name: "Gabriela Kafková (roz. Winklerová)", address: "Nerudova čp. 894, Pardubice", lat: 50.037500, lng: 15.775000, photo: "https://picsum.photos/seed/22/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 23, name: "Richard Kačer", address: "Polská čp. 529, Pardubice", lat: 50.037778, lng: 15.783889, photo: "https://picsum.photos/seed/23/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 24, name: "Ida Kačerová (roz. Fleischnerová)", address: "Polská čp. 529, Pardubice", lat: 50.037778, lng: 15.783889, photo: "https://picsum.photos/seed/24/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 25, name: "Helena Kačerová", address: "Polská čp. 529, Pardubice", lat: 50.037778, lng: 15.783889, photo: "https://picsum.photos/seed/25/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 26, name: "Lev Kaufmann", address: "Smetanovo náměstí čp. 46, Pardubice", lat: 50.036944, lng: 15.779167, photo: "https://picsum.photos/seed/26/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 27, name: "Otto Klepetář", address: "Perštýnské náměstí čp. 48, Pardubice", lat: 50.038889, lng: 15.780000, photo: "https://picsum.photos/seed/27/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 28, name: "Jiří Kraus", address: "Hronovická čp. 1470, Pardubice", lat: 50.034167, lng: 15.775833, photo: "https://picsum.photos/seed/28/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 29, name: "Karel Munk", address: "Palackého třída čp. 217, Pardubice", lat: 50.032778, lng: 15.758056, photo: "https://picsum.photos/seed/29/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 30, name: "Vladimír Munk", address: "Palackého třída čp. 217, Pardubice", lat: 50.032778, lng: 15.758056, photo: "https://picsum.photos/seed/30/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 31, name: "Hermína Munková (roz. Gešmayová)", address: "Palackého třída čp. 217, Pardubice", lat: 50.032778, lng: 15.758056, photo: "https://picsum.photos/seed/31/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 32, name: "Pavel Österreicher", address: "Perštýnské náměstí čp. 77, Pardubice", lat: 50.038056, lng: 15.778333, photo: "https://picsum.photos/seed/32/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 33, name: "Benno Österreicher", address: "Perštýnské náměstí čp. 77, Pardubice", lat: 50.038056, lng: 15.778333, photo: "https://picsum.photos/seed/33/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 34, name: "Leokadie Österreicherová (roz. Freundová)", address: "Perštýnské náměstí čp. 77, Pardubice", lat: 50.038056, lng: 15.778333, photo: "https://picsum.photos/seed/34/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 35, name: "Markéta Österreicherová", address: "Perštýnské náměstí čp. 77, Pardubice", lat: 50.038056, lng: 15.778333, photo: "https://picsum.photos/seed/35/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 36, name: "Berta Österreicherová (roz. Friedmannová)", address: "Perštýnské náměstí čp. 77, Pardubice", lat: 50.038056, lng: 15.778333, photo: "https://picsum.photos/seed/36/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 37, name: "Emil Pick", address: "Hronovická čp. 1470, Pardubice", lat: 50.034167, lng: 15.775833, photo: "https://picsum.photos/seed/37/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 38, name: "Jana Picková (roz. Beerová)", address: "Hronovická čp. 1470, Pardubice", lat: 50.034167, lng: 15.775833, photo: "https://picsum.photos/seed/38/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 39, name: "Oskar Pick", address: "K Višňovce čp. 1751, Pardubice", lat: 50.026389, lng: 15.771667, photo: "https://picsum.photos/seed/39/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 40, name: "Irena Picková (roz. Růžičková)", address: "K Višňovce čp. 1751, Pardubice", lat: 50.026389, lng: 15.771667, photo: "https://picsum.photos/seed/40/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 41, name: "Petr Ptačovský", address: "Perštýnské náměstí čp. 79, Pardubice", lat: 50.038333, lng: 15.778056, photo: "https://picsum.photos/seed/41/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 42, name: "Lily Ptačovská (roz. Picková)", address: "Perštýnské náměstí čp. 79, Pardubice", lat: 50.038333, lng: 15.778056, photo: "https://picsum.photos/seed/42/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 43, name: "Berta Roštejnská (roz. Katzová)", address: "Pernerova čp. 1868, Pardubice", lat: 50.038333, lng: 15.771389, photo: "https://picsum.photos/seed/43/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 44, name: "Jaroslav Seiner", address: "Smilova čp. 401, Pardubice", lat: 50.033889, lng: 15.769444, photo: "https://picsum.photos/seed/44/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 45, name: "Kamila Seinerová (roz. Fischerová)", address: "Smilova čp. 401, Pardubice", lat: 50.033889, lng: 15.769444, photo: "https://picsum.photos/seed/45/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 46, name: "Eva Seinerová", address: "Smilova čp. 401, Pardubice", lat: 50.033889, lng: 15.769444, photo: "https://picsum.photos/seed/46/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 47, name: "Ivan Seiner", address: "Smilova čp. 401, Pardubice", lat: 50.033889, lng: 15.769444, photo: "https://picsum.photos/seed/47/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 48, name: "Oskar Singer", address: "Havlíčkova čp. 1040, Pardubice", lat: 50.032778, lng: 15.766667, photo: "https://picsum.photos/seed/48/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 49, name: "Bedřiška Singerová (roz. Winterová)", address: "Havlíčkova čp. 1040, Pardubice", lat: 50.032778, lng: 15.766667, photo: "https://picsum.photos/seed/49/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 50, name: "Helena Singerová", address: "Havlíčkova čp. 1040, Pardubice", lat: 50.032778, lng: 15.766667, photo: "https://picsum.photos/seed/50/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 51, name: "Hana Singerová", address: "Havlíčkova čp. 1040, Pardubice", lat: 50.032778, lng: 15.766667, photo: "https://picsum.photos/seed/51/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 52, name: "Mariana Steinerová (roz. Goldschmiedová)", address: "Smetanovo náměstí čp. 46, Pardubice", lat: 50.036944, lng: 15.779167, photo: "https://picsum.photos/seed/52/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 53, name: "Rudolf Weiner", address: "Perštýnské náměstí čp. 79, Pardubice", lat: 50.038333, lng: 15.778056, photo: "https://picsum.photos/seed/53/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 54, name: "Růžena Weinerová (roz. Jelínková)", address: "Perštýnské náměstí čp. 79, Pardubice", lat: 50.038333, lng: 15.778056, photo: "https://picsum.photos/seed/54/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 55, name: "Helena Weinerová", address: "Perštýnské náměstí čp. 79, Pardubice", lat: 50.038333, lng: 15.778056, photo: "https://picsum.photos/seed/55/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 56, name: "Pavel Winternitz", address: "Smetanovo náměstí čp. 46, Pardubice", lat: 50.036944, lng: 15.779167, photo: "https://picsum.photos/seed/56/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 57, name: "Olga Winternitzová", address: "Smilova čp. 337, Pardubice", lat: 50.034167, lng: 15.771944, photo: "https://picsum.photos/seed/57/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 58, name: "Karel Winternitz", address: "Smilova čp. 337, Pardubice", lat: 50.034167, lng: 15.771944, photo: "https://picsum.photos/seed/58/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 59, name: "František Winternitz", address: "Smilova čp. 337, Pardubice", lat: 50.034167, lng: 15.771944, photo: "https://picsum.photos/seed/59/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" },
  { id: 60, name: "Markéta Zenkerová (roz. Nadelfestová)", address: "Perštýnské náměstí čp. 77, Pardubice", lat: 50.038056, lng: 15.778333, photo: "https://picsum.photos/seed/60/200/150", bio: "Zde budou informace o osobě.", link: "#", lastCleaned: "" }
];

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
// 3. LOKÁLNÍ ÚLOŽIŠTĚ (Data v prohlížeči)
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
// 4. LOGIKA BAREV PODLE MĚSÍCŮ (Jak jste chtěl)
// ==========================================
function formatCz(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${parseInt(d)}. ${parseInt(m)}. ${y}`;
}

const FRESH_MONTHS = 4;   // Do 4 měsíců = zelená (recently-cleaned)
const MEDIUM_MONTHS = 8;  // 4 až 8 měsíců = oranžová (medium)
                          // Nad 8 měsíců nebo bez data = červená (needs-cleaning)

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

// Dvě různé skupiny - jedna dělá klastry (čísla), druhá ne
const markersGroup = L.markerClusterGroup(); // Výchozí mód (shlukování)
const cleaningGroup = L.layerGroup();        // Mód čištění (kytičky - bez shlukování)

// Tlačítko pro lokalizaci
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

// ==========================================
// 6. VYKRESLOVÁNÍ KAMENŮ (Logika rozbalení)
// ==========================================
function renderMarkers() {
  const isCleaningMode = DOM.toggleCleaning.checked;

  // Vyčistíme obě vrstvy z mapy před novým vykreslením
  if (map.hasLayer(markersGroup)) map.removeLayer(markersGroup);
  if (map.hasLayer(cleaningGroup)) map.removeLayer(cleaningGroup);
  
  markersGroup.clearLayers();
  cleaningGroup.clearLayers();

  if (isCleaningMode) {
    // ---- MÓD ČIŠTĚNÍ (Rozbalené kytičky) ----
    map.addLayer(cleaningGroup);

    // Seskupíme kameny podle stejných souřadnic
    const groupsByCoords = {};
    stolpersteine.forEach(stone => {
      const key = `${stone.lat},${stone.lng}`;
      if (!groupsByCoords[key]) groupsByCoords[key] = [];
      groupsByCoords[key].push(stone);
    });

    // Projdeme všechny lokace
    Object.values(groupsByCoords).forEach(group => {
      const size = group.length;
      
      group.forEach((stone, index) => {
        let anchor = [9, 9]; // Výchozí střed pro 1 puntík
        
        // Pokud je na místě víc kamenů, matematicky je rozložíme do kroužku
        if (size > 1) {
          const angle = index * (2 * Math.PI / size);
          const radius = 14; // vzdálenost od středu v pixelech (můžete upravit)
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
    // ---- NORMÁLNÍ MÓD (Shlukování do čísel) ----
    map.addLayer(markersGroup);

    stolpersteine.forEach(stone => {
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

// Pokud uživatel překlikne tlačítko, překreslíme mapu (zapneme/vypneme kytičky)
DOM.toggleCleaning.addEventListener('change', renderMarkers);


// ==========================================
// 7. OVLÁDÁNÍ A UDÁLOSTI (Detail, Formulář, Filtry)
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
  saveData(currentStone.id, iso);

  DOM.cleaned.textContent = '🧹 ' + getStatusText(iso);
  DOM.feedback.textContent = '✓ Uloženo';
  DOM.feedback.style.color = '#27ae60';
  DOM.feedback.classList.remove('hidden');
  setTimeout(() => DOM.feedback.classList.add('hidden'), 2500);

  renderMarkers(); // Překreslí barvy na mapě ihned po uložení
};

document.getElementById('toggle-grayscale').onchange = (e) => {
  DOM.mapContainer.classList.toggle('grayscale-mode', e.target.checked);
};

map.on('locationfound', (e) => {
  L.circleMarker(e.latlng, {
    color: '#3498db', fillColor: '#3498db', fillOpacity: 1, radius: 8, weight: 3
  }).addTo(map).bindPopup("📍 Jste zde").openPopup();
});

// ==========================================
// START APLIKACE
// ==========================================
loadSavedData();
renderMarkers();
