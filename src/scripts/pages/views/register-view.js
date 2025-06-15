export default class UserRegistrationView {
  constructor() {
    this.mainAppElement = document.getElementById('main-content');
    this.registrationForm = null;
  }

  render() {
    this.mainAppElement.innerHTML = `
      <section class="register">
        <h2>Daftar</h2>
        <form id="userRegistrationForm">
          <input type="text" id="userNameInput" placeholder="Nama Lengkap" required />
          <input type="email" id="userEmailInput" placeholder="Email" required />
          <input type="password" id="userPasswordInput" placeholder="Kata Sandi" required />
          <button type="submit">Daftar</button>
        </form>
        <p id="registrationMessageDisplay" style="color: red;"></p>
      </section>
    `;
    this.registrationForm = this.mainAppElement.querySelector('#userRegistrationForm');
  }

  bindSubmit(submitHandler) {
    this.registrationForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const userName = this.registrationForm.userNameInput.value;
      const userEmail = this.registrationForm.userEmailInput.value;
      const userPassword = this.registrationForm.userPasswordInput.value;
      submitHandler(userName, userEmail, userPassword);
    });
  }

  showErrorMessage(messageText) {
    this.mainAppElement.querySelector('#registrationMessageDisplay').textContent = messageText;
    this.mainAppElement.querySelector('#registrationMessageDisplay').style.color = 'red'; // Memastikan warna merah untuk error
  }

  showSuccessMessage(messageText) {
    this.mainAppElement.querySelector('#registrationMessageDisplay').style.color = 'green';
    this.mainAppElement.querySelector('#registrationMessageDisplay').textContent = messageText;
  }
}