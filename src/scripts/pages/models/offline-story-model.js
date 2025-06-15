import { openDB } from 'idb';

const DATABASE_NAME = 'story-data-db';
const OBJECT_STORE_NAME = 'cached-user-stories';

export default class OfflineStoryDataModel {
  constructor() {
    this.databasePromise = openDB(DATABASE_NAME, 1, {
      upgrade(databaseInstance) {
        if (!databaseInstance.objectStoreNames.contains(OBJECT_STORE_NAME)) {
          const objectStore = databaseInstance.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
          // Index optional jika mau query di masa depan
        }
      },
    });
  }

  async saveStory(storyEntry) {
    const database = await this.databasePromise;

    // Ambil Blob dari URL gambar
    const photoResourceResponse = await fetch(storyEntry.photoUrl);
    const photoBinaryData = await photoResourceResponse.blob();

    const storyDataToStore = {
      id: storyEntry.id,
      name: storyEntry.name,
      description: storyEntry.description,
      createdAt: storyEntry.createdAt,
      lat: storyEntry.lat,
      lon: storyEntry.lon,
      photoBlob: photoBinaryData, // Simpan sebagai Blob
    };

    return database.put(OBJECT_STORE_NAME, storyDataToStore);
  }

  async getAllStories() {
    const database = await this.databasePromise;
    const allStoredStories = await database.getAll(OBJECT_STORE_NAME);

    // Ubah Blob ke objectURL
    return allStoredStories.map((storyRecord) => {
      if (storyRecord.photoBlob) {
        storyRecord.photoUrl = URL.createObjectURL(storyRecord.photoBlob);
      }
      return storyRecord;
    });
  }

  async deleteStory(storyUniqueId) {
    const database = await this.databasePromise;
    return database.delete(OBJECT_STORE_NAME, storyUniqueId);
  }
}