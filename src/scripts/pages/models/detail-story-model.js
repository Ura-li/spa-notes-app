export default class StoryDetailsModel {
  async getStoryById(authToken, requestedStoryId) {
    const apiResponse = await fetch(`https://story-api.dicoding.dev/v1/stories/${requestedStoryId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const apiResult = await apiResponse.json();
    if (!apiResponse.ok) {
      throw new Error(apiResult.message);
    }

    return apiResult; // { story: { id, name, description, photo, createdAt } }
  }
}