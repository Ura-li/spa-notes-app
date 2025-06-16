// src/presenters/OfflineStoryPresenter.js
import OfflineStoryDataModel from '../models/offline-story-model.js';
import CachedStoryView from '../views/offline-story-view.js';

export default class OfflineStoryPresenter {
  constructor() {
    this.dataModel = new OfflineStoryDataModel();
    this.userView = new CachedStoryView();

    // Bind handler supaya context this presenter tetap benar
    console.log('OfflineStoryPresenter: Constructor called.'); // DEBUG LOG
    this.handleStoryDeletion = this.handleStoryDeletion.bind(this);
  }

  async init() {
    console.log('OfflineStoryPresenter: init() method called.'); // DEBUG LOG
    try {
      const storedStories = await this.dataModel.getAllStories();
      console.log('OfflineStoryPresenter: Data fetched from model:', storedStories); // DEBUG LOG
      this.userView.renderContent(storedStories);

      // Pasang event listener hapus di view
      this.userView.bindRemoveStory(this.handleStoryDeletion);
    } catch (error) {
      console.error('OfflineStoryPresenter: Gagal memuat cerita offline:', error); // DEBUG LOG
      console.error('Gagal memuat cerita offline:', error);
      this.userView.renderContent([]);
    }
  }

  async handleStoryDeletion(storyIdentifier) {
    console.log(`OfflineStoryPresenter: handleStoryDeletion called for ID: ${storyIdentifier}`);
    try {
      await this.dataModel.deleteStory(storyIdentifier);
      console.log(`OfflineStoryPresenter: Story with ID ${storyIdentifier} deleted.`); 
      // Reload daftar cerita setelah hapus
      await this.init();
    } catch (error) {
      console.error('Gagal menghapus cerita offline:', error);
    }
  }

  async addStoryToOffline(storyObject) {
    console.log('OfflineStoryPresenter: addStoryToOffline called with object:', storyObject);
    try {
      await this.dataModel.saveStory(storyObject);
      console.log('OfflineStoryPresenter: Story saved to offline storage.'); // DEBUG LOG
      await this.init();
    } catch (error) {
      console.error('Gagal menyimpan cerita offline:', error);
    }
  }
}