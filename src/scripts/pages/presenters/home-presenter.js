import StoriesDataModel from '../models/home-model.js';
import StoriesDashboardView from '../views/home-view.js';

export default class StoriesOverviewPresenter {
  constructor() {
    this.dataFetcherModel = new StoriesDataModel();
    this.displayView = new StoriesDashboardView();

    this.displayView.displayLoadingState();

    // Inisialisasi channel komunikasi dengan service worker
    this.broadcastChannel = new BroadcastChannel('push_channel');
    this.broadcastChannel.addEventListener('message', this.handleIncomingPushMessage.bind(this));

    this.fetchAndDisplayStories();
  }

  async fetchAndDisplayStories() {
    try {
      const userAuthenticationToken = localStorage.getItem('token');
      if (!userAuthenticationToken) {
        this.displayView.displayErrorMessage('Anda harus login terlebih dahulu.');
        window.location.hash = '/login';
        return;
      }

      const allStories = await this.dataFetcherModel.retrieveAllStories(userAuthenticationToken);
      this.displayView.renderStoryListAndMap(allStories);
    } catch (error) {
      this.displayView.displayErrorMessage(error.message);
    }
  }

  async handleIncomingPushMessage(eventData) {
    // Cek apakah tipe pesan push adalah 'NEW_STORY'
    if (eventData.data?.type === 'NEW_STORY') {
      // Reload daftar cerita terbaru
      await this.fetchAndDisplayStories();

      // Tampilkan notifikasi UI di halaman
      this.displayView.displayNewStoryNotification('Ada cerita baru!');
    }
  }
}