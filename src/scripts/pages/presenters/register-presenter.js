import UserRegistrationModel from '../models/register-model.js';
import UserRegistrationView from '../views/register-view.js';

export default class RegistrationPresenter {
  constructor() {
    this.registrationModel = new UserRegistrationModel();
    this.registrationView = new UserRegistrationView();

    this.registrationView.render();
    this.registrationView.bindSubmit(this.handleUserRegistration.bind(this));
  }

  async handleUserRegistration(fullName, emailAddress, userPassword) {
    try {
      const registrationResult = await this.registrationModel.submitRegistration(fullName, emailAddress, userPassword);
      this.registrationView.showSuccessMessage(registrationResult.message);
      setTimeout(() => {
        window.location.hash = '/login'; // atau router SPA Anda
      }, 1500);
    } catch (error) {
      this.registrationView.showErrorMessage(error.message);
    }
  }
}