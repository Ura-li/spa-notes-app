export default class DetailedStoryView {
  constructor() {
    this.mainAppContainer = document.getElementById('main-content');
  }

  displayLoadingSkeleton() {
    this.mainAppContainer.innerHTML = `
      <section class="story-detail loading">
        <p>Memuat detail cerita...</p>
      </section>
    `;
  }

  renderFullStory(storyData) {
    const imageUrl = storyData.photoUrl || 'placeholder.png'; // fallback jika gambar tidak ada

    this.mainAppContainer.innerHTML = `
      <section class="story-detail">
        <h2 class="story-title">${storyData.name}</h2>

        <div class="story-image-wrapper">
          <img src="${imageUrl}" alt="Foto ${storyData.name}" class="story-image" loading="lazy" />
        </div>

        <p class="story-description">${storyData.description}</p>
        <small class="story-date">
          ${storyData.createdAt ? new Date(storyData.createdAt).toLocaleString() : 'Tanggal tidak tersedia'}
        </small>

        <button id="save-for-offline-button" class="btn-save-offline">
          Simpan Cerita untuk Offline
        </button>

        <div id="story-map-container" class="story-map" style="height: 300px; margin-top: 1rem;"></div>
      </section>
    `;

    if (storyData.lat && storyData.lon) {
      const storyMap = L.map('story-map-container').setView([storyData.lat, storyData.lon], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(storyMap);

      L.marker([storyData.lat, storyData.lon]).addTo(storyMap)
        .bindPopup(`<strong>${storyData.name}</strong><br>${storyData.description}`).openPopup();
    } else {
      document.getElementById('story-map-container').innerHTML = '<p class="no-location">Lokasi tidak tersedia</p>';
    }

    this.offlineSaveButton = document.getElementById('save-for-offline-button');
  }

  attachSaveOfflineHandler(eventHandler, storyInfo) {
    if (!this.offlineSaveButton) return;
    this.offlineSaveButton.addEventListener('click', () => eventHandler(storyInfo));
  }

  displayErrorMessage(msg) {
    this.mainAppContainer.innerHTML = `
      <section class="error">
        <p style="color: red;">${msg}</p>
      </section>
    `;
  }
}