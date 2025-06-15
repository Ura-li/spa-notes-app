import '../styles/styles.css';
import App from './pages/app';
import { getActiveRoute } from './routes/url-parser';
import routes from './routes/routes';
import { initPushNotification } from './utils/pushNotification';

let currentPresenter = null;

const app = new App({
  content: document.querySelector('#main-content'),
  drawerButton: document.querySelector('#drawer-button'),
  navigationDrawer: document.querySelector('#navigation-drawer'),
});

const updateNavigationMenu = () => {
  const isUserLoggedIn = !!localStorage.getItem('token');

  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const logoutLink = document.getElementById('logout-link');

  if (loginLink && registerLink && logoutLink) {
    loginLink.style.display = isUserLoggedIn ? 'none' : 'block';
    registerLink.style.display = isUserLoggedIn ? 'none' : 'block';
    logoutLink.style.display = isUserLoggedIn ? 'block' : 'none';

    logoutLink.onclick = () => {
      localStorage.removeItem('token');
      updateNavigationMenu();
      window.location.hash = '/';
    };
  }
};

const initSkipLink = () => {
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
};

// Render halaman
const renderPage = async () => {
  const activeRoute = getActiveRoute(window.location.hash);
  const PresenterClass = routes[activeRoute] || routes['/'];

  // Bersihkan presenter sebelumnya
  if (currentPresenter?.destroy) {
    currentPresenter.destroy();
  }

  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.classList.remove('visible');
    currentPresenter = await app.renderPage(PresenterClass);
    mainContent.classList.add('visible');
  }

  updateNavigationMenu();
};

document.addEventListener('DOMContentLoaded', () => {
  initSkipLink();

  // ✅ Register Service Worker dan inisialisasi push
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './' })
        .then((registration) => {
          console.log('✅ Service Worker terdaftar:', registration);

          if (localStorage.getItem('token')) {
            initPushNotification();
          }
        })
        .catch((error) => {
          console.error('❌ Gagal mendaftarkan Service Worker:', error);
        });
    });
  }

  renderPage();
  window.addEventListener('hashchange', renderPage);
});

if (!localStorage.getItem('clientId')) {
  localStorage.setItem('clientId', crypto.randomUUID());
}

// Respon permintaan clientId dari Service Worker
navigator.serviceWorker.addEventListener('message', event => {
  if (event.data?.type === 'GET_CLIENT_ID') {
    const clientId = localStorage.getItem('clientId');

    const channel = new BroadcastChannel('push_channel');
    channel.postMessage({ type: 'CLIENT_ID', clientId });
  }
});
