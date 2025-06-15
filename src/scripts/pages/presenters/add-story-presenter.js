import NewStoryModel from '../models/add-story-model.js';
import CreateStoryView from '../views/add-story-view.js';

export default class NewStoryPresenter {
  constructor() {
    this.userAuthToken = localStorage.getItem('token');
    if (!this.userAuthToken) {
      window.location.hash = '/login';
      return;
    }

    this.storyCreationModel = new NewStoryModel();
    this.storyCreationView = new CreateStoryView();

    this.storyCreationView.display();
    this.storyCreationView.bindFormSubmit(this.handleStorySubmission.bind(this));
  }

  destroy() {
    if (this.storyCreationView && typeof this.storyCreationView.cleanup === 'function') {
      this.storyCreationView.cleanup();
    }
  }

  async handleStorySubmission(descriptionContent, photoFile, latitudeCoord, longitudeCoord) {
    try {
      const submissionResult = await this.storyCreationModel.addStory({
        token: this.userAuthToken,
        description: descriptionContent,
        photo: photoFile,
        lat: latitudeCoord,
        lon: longitudeCoord,
      });

      this.storyCreationView.displayFeedbackMessage(submissionResult.message);

      // 🔔 Tampilkan notifikasi lokal jika diizinkan
      if (Notification.permission === 'granted') {
        new Notification('Cerita berhasil ditambahkan!', {
          body: submissionResult.message,
          icon: './icons/placeholder.png', // Ganti dengan ikon yang tersedia di proyekmu
        });
      }

      setTimeout(() => {
        window.location.hash = '/';
      }, 1500);
    } catch (error) {
      this.storyCreationView.displayFeedbackMessage(error.message, true);
    }
  }
}