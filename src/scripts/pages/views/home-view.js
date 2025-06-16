export default class StoriesDashboardView {
  constructor() {
    this.mainContainerElement = document.getElementById('main-content');
    this.storyMapInstance = null;
    this.mapMarkersArray = [];
  }

  displayLoadingState() {
    this.mainContainerElement.innerHTML = '<p>Memuat cerita...</p>';
  }

  renderStoryListAndMap(storyItems) {
    if (!storyItems.length) {
      this.mainContainerElement.innerHTML = '<p>Tidak ada cerita.</p>';
      return;
    }

    this.mainContainerElement.innerHTML = `
      <section class="stories">
        <h2>Stories</h2>
        <div id="story-map-display" style="height: 400px; margin-bottom: 1rem;"></div>
        <div class="story-list">
          ${storyItems
            .map(
              (item) => `
                <article class="story-item">
                  <h3>${item.name}</h3>
                  <p>${item.description}</p>
                  <small>${new Date(item.createdAt).toLocaleString()}</small>
                  <br />
                  <a href="#/story/${item.id}" class="detail-link">Lihat Detail</a>
                </article>
              `
            )
            .join('')}
        </div>
      </section>
    `;

    this._initializeInteractiveMap();
    this._addStoryMarkers(storyItems);
  }

  _initializeInteractiveMap() {
    if (this.storyMapInstance) {
      this.storyMapInstance.remove(); // reset if re-rendering
    }

    this.storyMapInstance = L.map('story-map-display').setView([-6.9, 109.1], 6); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.storyMapInstance);
  }

  _addStoryMarkers(storyDataCollection) {
    this.mapMarkersArray = [];

    storyDataCollection.forEach((storyEntry) => {
      if (storyEntry.lat && storyEntry.lon) {
        const singleMarker = L.marker([storyEntry.lat, storyEntry.lon])
          .addTo(this.storyMapInstance)
          .bindPopup(`<strong>${storyEntry.name}</strong><br>${storyEntry.description}`);
        this.mapMarkersArray.push(singleMarker);
      }
    });

    // Optional: Zoom to fit all markers
    if (this.mapMarkersArray.length) {
      const markerGroup = L.featureGroup(this.mapMarkersArray);
      this.storyMapInstance.fitBounds(markerGroup.getBounds().pad(0.5));
    }
  }

  displayErrorMessage(messageText) {
    this.mainContainerElement.innerHTML = `<p style="color: red;">${messageText}</p>`;
  }

  // Menambahkan method untuk notifikasi UI jika ada cerita baru
  displayNewStoryNotification(notificationMessage) {
    const notificationDiv = document.createElement('div');
    notificationDiv.className = 'new-story-notification';
    notificationDiv.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #4CAF50;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
    `;
    notificationDiv.textContent = notificationMessage;
    this.mainContainerElement.appendChild(notificationDiv);

    // Tampilkan notifikasi
    setTimeout(() => {
      notificationDiv.style.opacity = '1';
    }, 100);

    // Sembunyikan dan hapus setelah beberapa detik
    setTimeout(() => {
      notificationDiv.style.opacity = '0';
      notificationDiv.addEventListener('transitionend', () => notificationDiv.remove());
    }, 3000);
  }
}