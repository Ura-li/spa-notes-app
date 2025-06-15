// src/views/OfflineStoryView.js
export default class CachedStoryView {
  constructor() {
    this.displayContainer = document.getElementById('main-content');
  }

  renderContent(cachedStories) {
    if (!this.displayContainer) return;

    if (!cachedStories || cachedStories.length === 0) {
      this.displayContainer.innerHTML = '<p>Tidak ada Story offline.</p>';
      return;
    }

    this.displayContainer.innerHTML = `
      <section class="offline-stories">
        <h2>Daftar Story Offline</h2>
        <div class="stories-grid">
          ${cachedStories.map(storyItem => `
            <article class="story-card" data-id="${storyItem.id}">
              <img 
                src="${storyItem.photoUrl || 'icons/placeholder.png'}" 
                alt="Foto ${storyItem.name}" 
                class="story-image" 
                onerror="this.src='icons/placeholder.png';"
              />
              <div class="story-content">
                <h3 class="story-title">${storyItem.name}</h3>
                <p class="story-description">${storyItem.description}</p>
                <button class="remove-btn" data-id="${storyItem.id}">Hapus</button>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `;
  }

  bindRemoveStory(eventHandler) {
    if (!this.displayContainer) return;

    const removeButtons = this.displayContainer.querySelectorAll('.remove-btn');
    removeButtons.forEach(buttonElement => {
      buttonElement.addEventListener('click', (domEvent) => {
        const storyId = domEvent.target.dataset.id;
        if (storyId) eventHandler(storyId);
      });
    });
  }
}