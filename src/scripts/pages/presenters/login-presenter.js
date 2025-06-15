import UserAuthenticationModel from '../models/login-model.js';
import UserLoginView from '../views/login-view.js';

export default class LoginScreenPresenter {
  constructor() {
    this.authenticationModel = new UserAuthenticationModel();
    this.loginDisplayView = new UserLoginView();

    this.loginDisplayView.render();
    this.loginDisplayView.bindSubmit(this.handleUserLogin.bind(this));
  }

  async handleUserLogin(enteredEmail, enteredPassword) {
    try {
      const loginApiResponse = await this.authenticationModel.performLogin(enteredEmail, enteredPassword);
      this.loginDisplayView.showSuccess('Login berhasil!');

      // Simpan token ke localStorage
      localStorage.setItem('token', loginApiResponse.loginResult.token);

      // Arahkan ke halaman utama
      setTimeout(() => {
        window.location.hash = '/'; // atau halaman utama lainnya
      }, 1500);
    } catch (error) {
      this.loginDisplayView.showError(error.message);
    }
  }
}