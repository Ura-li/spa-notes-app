export default class StoriesDataModel {
  async retrieveAllStories(apiToken) {
    const apiCallResponse = await fetch('https://story-api.dicoding.dev/v1/stories', {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    const apiCallResult = await apiCallResponse.json();
    if (!apiCallResponse.ok) {
      throw new Error(apiCallResult.message);
    }

    return apiCallResult.listStory; // array of story
  }
}