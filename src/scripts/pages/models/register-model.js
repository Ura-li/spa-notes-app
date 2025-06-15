export default class UserRegistrationModel {
  async submitRegistration(userName, userEmail, userPassword) {
    const apiResponse = await fetch('https://story-api.dicoding.dev/v1/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: userName, email: userEmail, password: userPassword }),
    });

    const apiResult = await apiResponse.json();
    if (!apiResponse.ok) {
      throw new Error(apiResult.message);
    }

    return apiResult; // { error: false, message: "User created" }
  }
}