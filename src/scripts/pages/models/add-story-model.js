export default class NewStoryModel {
  async addStory({ token, description, photo, lat, lon }) {
    const storyFormData = new FormData();
    storyFormData.append('description', description);
    storyFormData.append('photo', photo);

    // Tambahkan koordinat jika tersedia
    if (lat && lon) {
      storyFormData.append('lat', lat);
      storyFormData.append('lon', lon);
    }

    const apiCallResponse = await fetch('https://story-api.dicoding.dev/v1/stories', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: storyFormData,
    });

    const apiCallResult = await apiCallResponse.json();

    if (!apiCallResponse.ok) {
      throw new Error(apiCallResult.message);
    }

    return apiCallResult; // { error: false, message: 'Story added successfully' }
  }
}