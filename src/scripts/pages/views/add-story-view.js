export default class CreateStoryView {
  constructor() {
    this.mainContentArea = document.getElementById('main-content');
    this.storyForm = null;
    this.leafletMap = null;
    this.mapMarker = null;
    this.coordinates = { latitude: null, longitude: null };
    this.cameraStream = null;
  }

  display() {
    this.mainContentArea.innerHTML = `
      <section class="add-story">
        <h2>Tambahkan Cerita Baru</h2>
        <form id="newStoryForm">
          <textarea id="storyDescription" placeholder="Tulis deskripsi cerita Anda di sini..." required></textarea>

          <div>
            <video id="cameraFeed" autoplay playsinline width="300" height="225" style="border:1px solid #ccc;"></video><br />
            <button type="button" id="captureImageBtn">Ambil Gambar</button>
            <canvas id="photoCanvas" width="300" height="225" style="display: none;"></canvas>
          </div>

          <div id="locationMap" style="height: 300px; margin-top: 1rem;"></div>
          <p>Latitude: <span id="currentLat">-</span>, Longitude: <span id="currentLon">-</span></p>

          <button type="submit">Kirim Cerita</button>
        </form>
        <p id="storyMessageDisplay"></p>
      </section>
    `;

    this.storyForm = this.mainContentArea.querySelector('#newStoryForm');
    this._initializeMap();
    this._initializeCamera();
  }

  async _initializeCamera() {
    const videoElement = document.getElementById('cameraFeed');
    const canvasElement = document.getElementById('photoCanvas');
    const captureButton = document.getElementById('captureImageBtn');

    try {
      this.cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement.srcObject = this.cameraStream;

      captureButton.addEventListener('click', () => {
        const canvasContext = canvasElement.getContext('2d');
        canvasContext.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        canvasElement.style.display = 'block';
        // Pause video after capture
        videoElement.pause();
      });
    } catch (err) {
      console.error('Gagal mengakses kamera atau izin ditolak:', err);
      videoElement.outerHTML = '<p style="color:red;">Tidak dapat mengakses kamera.</p>';
    }
  }

  _initializeMap() {
    this.leafletMap = L.map('locationMap').setView([-6.9915, 109.1358], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.leafletMap);

    this.leafletMap.on('click', (mapEvent) => {
      const { lat, lng } = mapEvent.latlng;
      this.coordinates.latitude = lat;
      this.coordinates.longitude = lng;

      if (this.mapMarker) {
        this.mapMarker.setLatLng(mapEvent.latlng);
      } else {
        this.mapMarker = L.marker(mapEvent.latlng).addTo(this.leafletMap);
      }

      document.getElementById('currentLat').textContent = lat.toFixed(5);
      document.getElementById('currentLon').textContent = lng.toFixed(5);
    });
  }

  bindFormSubmit(submitHandler) {
    this.storyForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const storyText = this.storyForm.storyDescription.value;
      const canvasElement = document.getElementById('photoCanvas');
      let imageBlob;

      if (canvasElement && canvasElement.style.display === 'block') {
        imageBlob = await new Promise((resolve) =>
          canvasElement.toBlob((blob) => resolve(blob), 'image/jpeg')
        );
      }

      const { latitude, longitude } = this.coordinates;

      submitHandler(storyText, imageBlob, latitude, longitude);
    });
  }

  displayFeedbackMessage(msg, isAnError = false) {
    const feedbackElement = this.mainContentArea.querySelector('#storyMessageDisplay');
    feedbackElement.textContent = msg;
    feedbackElement.style.color = isAnError ? 'red' : 'green';
  }

  /**
   * Matikan kamera dan bersihkan peta saat berpindah halaman
   */
  cleanup() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }

    if (this.leafletMap) {
      this.leafletMap.remove(); // Optional: bersihkan peta juga
      this.leafletMap = null;
    }
  }
}