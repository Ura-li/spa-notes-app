export async function initPushNotification() {
  if (!('serviceWorker' in navigator)) return;
  if (!('PushManager' in window)) return;

  const btnSubscribe = document.getElementById('btnSubscribe');
  if (!btnSubscribe) return; 

  try {
    
    
    btnSubscribe.addEventListener('click', async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Login terlebih dahulu untuk mengaktifkan notifikasi.');
        return;
      }
      
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
  
      
      updateButton(subscription);
      if (subscription) {
        
        await subscription.unsubscribe();
        subscription = null;
        
        localStorage.removeItem('pushSubscription');
        updateButton(subscription);
        console.log('Push notification unsubscribed');
      } else {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          alert('Izin notifikasi ditolak.');
          return;
        }

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk'
          ),
        });

        localStorage.setItem('pushSubscription', JSON.stringify(subscription));

        updateButton(subscription);
        console.log('Push notification subscribed:', subscription);

        const token = localStorage.getItem('token');
        const subscriptionJson = subscription.toJSON(); 

        await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            endpoint: subscriptionJson.endpoint,
            keys: {
              auth: subscriptionJson.keys.auth,
              p256dh: subscriptionJson.keys.p256dh,
            },

          }),
        });

        updateButton(subscription);
        console.log('Push notification subscribed:', subscriptionJson);
      }
    });
  } catch (error) {
    console.error('Gagal inisialisasi push notification:', error);
  }
}

function updateButton(subscription) {
  const btn = document.getElementById('btnSubscribe');
  if (!btn) return;
  if (subscription) {
    btn.textContent = 'Subscribed';
    btn.classList.add('subscribed');
    btn.setAttribute('aria-pressed', 'true');
  } else {
    btn.textContent = 'Subscribe';
    btn.classList.remove('subscribed');
    btn.setAttribute('aria-pressed', 'false');
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
