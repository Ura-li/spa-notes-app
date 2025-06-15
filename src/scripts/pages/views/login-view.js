export default class UserLoginView {
  constructor() {
    this.mainContentArea = document.getElementById('main-content');
    this.loginFormElement = null;
  }

  render() {
    this.mainContentArea.innerHTML = `
      <section class="login">
        <h2>Masuk</h2>
        <form id="userLoginForm">
          <input type="email" id="userEmailInput" placeholder="Email" required />
          <input type="password" id="userPasswordInput" placeholder="Kata Sandi" required />
          <button type="submit">Login</button>
        </form>
        <p id="authFeedbackDisplay" style="color: red;"></p>
      </section>
    `;
    this.loginFormElement = this.mainContentArea.querySelector('#userLoginForm');
  }

  bindSubmit(handler) {
    this.loginFormElement.addEventListener('submit', (event) => {
      event.preventDefault();
      const userEmail = this.loginFormElement.userEmailInput.value;
      const userPassword = this.loginFormElement.userPasswordInput.value;
      handler(userEmail, userPassword);
    });
  }

  showError(feedbackMessage) {
    this.mainContentArea.querySelector('#authFeedbackDisplay').style.color = 'red';
    this.mainContentArea.querySelector('#authFeedbackDisplay').textContent = feedbackMessage;
  }

  showSuccess(feedbackMessage) {
    this.mainContentArea.querySelector('#authFeedbackDisplay').style.color = 'green';
    this.mainContentArea.querySelector('#authFeedbackDisplay').textContent = feedbackMessage;
  }
}