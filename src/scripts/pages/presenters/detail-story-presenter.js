import StoryDetailsModel from '../models/detail-story-model.js';
import DetailedStoryView from '../views/detail-story-view.js';
import { parseActivePathname } from '../../routes/url-parser.js';
import OfflineStoryDataModel from '../models/offline-story-model.js';

export default class StoryDetailPresenter {
  constructor() {
    this.storyDataModel = new StoryDetailsModel();
    this.storyDisplayView = new DetailedStoryView();
    this.offlineDataManager = new OfflineStoryDataModel();

    this.storyDisplayView.displayLoadingSkeleton();
    this.initializeStoryLoad();
  }

  async initializeStoryLoad() {
    try {
      const userToken = localStorage.getItem('token');
      if (!userToken) {
        this.storyDisplayView.displayErrorMessage('Anda harus login untuk melihat cerita detail.');
        window.location.hash = '/login';
        return;
      }

      const { id: storyIdentifier } = parseActivePathname();
      if (!storyIdentifier) {
        this.storyDisplayView.displayErrorMessage('ID cerita tidak ditemukan.');
        return;
      }

      const storyResponseData = await this.storyDataModel.getStoryById(userToken, storyIdentifier);
      const currentStory = storyResponseData.story;

      this.storyDisplayView.renderFullStory(currentStory);

      // Bind tombol simpan offline setelah render selesai
      this.storyDisplayView.attachSaveOfflineHandler(this.handleStoryOfflineSave.bind(this), currentStory);

    } catch (error) {
      this.storyDisplayView.displayErrorMessage(error.message || 'Gagal memuat cerita.');
    }
  }

  async handleStoryOfflineSave(storyToSave) {
    try {
      await this.offlineDataManager.saveStory({
        id: storyToSave.id,
        name: storyToSave.name,
        description: storyToSave.description,
        photoUrl: storyToSave.photoUrl,
        createdAt: storyToSave.createdAt,
        lat: storyToSave.lat,
        lon: storyToSave.lon,
      });

      alert('Cerita berhasil disimpan untuk offline.');
    } catch (error) {
      console.error('Penyimpanan offline gagal:', error);
      alert('Gagal menyimpan cerita offline: ' + error.message);
    }
  }
}