// src/presenters/OfflineStoryPresenter.js
import OfflineStoryDataModel from '../models/offline-story-model.js';
import CachedStoryView from '../views/offline-story-view.js';

export default class OfflineStoryPresenter {
  constructor() {
    this.dataModel = new OfflineStoryDataModel();
    this.userView = new CachedStoryView();

    // Bind handler supaya context this presenter tetap benar
    this.handleStoryDeletion = this.handleStoryDeletion.bind(this);
  }

  async initializePage() {
    try {
      const storedStories = await this.dataModel.getAllStories();
      this.userView.renderContent(storedStories);

      // Pasang event listener hapus di view
      this.userView.bindRemoveStory(this.handleStoryDeletion);
    } catch (error) {
      console.error('Gagal memuat cerita offline:', error);
      this.userView.renderContent([]);
    }
  }

  async handleStoryDeletion(storyIdentifier) {
    try {
      await this.dataModel.deleteStory(storyIdentifier);
      // Reload daftar cerita setelah hapus
      await this.initializePage();
    } catch (error) {
      console.error('Gagal menghapus cerita offline:', error);
    }
  }

  async addStoryToOffline(storyObject) {
    try {
      await this.dataModel.saveStory(storyObject);
      await this.initializePage();
    } catch (error) {
      console.error('Gagal menyimpan cerita offline:', error);
    }
  }
}