export default class UserAuthenticationModel {
  async performLogin(userEmail, userPassword) {
    const apiResponse = await fetch('https://story-api.dicoding.dev/v1/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, password: userPassword }),
    });

    const apiResult = await apiResponse.json();
    if (!apiResponse.ok) {
      throw new Error(apiResult.message);
    }

    return apiResult; // { error: false, message: "success", loginResult: { name, token, userId } }
  }
}