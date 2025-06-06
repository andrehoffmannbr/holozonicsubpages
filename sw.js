// Service Worker para Clínica Holozonic PWA
// Versão: 1.0.0

const CACHE_NAME = 'holozonic-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Lista de recursos para cache
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/js/main.js',
  '/manifest.json',
  '/img/background.mp4',
  // CDN resources
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  // Offline page
  OFFLINE_URL
];

// Recursos críticos que devem ser sempre atualizados
const criticalResources = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/js/main.js'
];

// Instalar o Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker: Recursos em cache');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Erro no cache:', error);
      })
  );
});

// Ativar o Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Ativando...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Ativado e assumindo controle');
      return self.clients.claim();
    })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  // Só processar requisições GET
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  
  // Estratégia especial para recursos críticos
  if (criticalResources.some(resource => requestUrl.pathname === resource)) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  // Estratégia especial para APIs externas
  if (requestUrl.hostname !== location.hostname) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Estratégia padrão: Cache First
  event.respondWith(cacheFirst(event.request));
});

// Estratégia: Cache First
async function cacheFirst(request) {
  try {
    const cached = await caches.match(request);
    if (cached) {
      console.log('📋 Cache hit:', request.url);
      return cached;
    }

    const networkResponse = await fetch(request);
    
    // Cache apenas responses válidas
    if (networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      console.log('💾 Cached:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🔌 Offline - Servindo página offline');
    
    // Se for uma navegação (página HTML), retornar página offline
    if (request.destination === 'document') {
      return caches.match(OFFLINE_URL);
    }
    
    // Para outros recursos, retornar erro
    throw error;
  }
}

// Estratégia: Network First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🔌 Network failed, trying cache:', request.url);
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Estratégia: Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.status === 200) {
      const cache = caches.open(CACHE_NAME);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => {
    console.log('🔌 Network failed for:', request.url);
  });

  return cached || fetchPromise;
}

// Listener para notificações push
self.addEventListener('push', (event) => {
  console.log('📬 Push notification recebida');
  
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação da Holozonic',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Acessar',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/xmark.png'
      }
    ],
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification('Clínica Holozonic', options)
  );
});

// Listener para cliques em notificações
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.notification.tag);
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Se já há uma janela aberta, focar nela
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Caso contrário, abrir nova janela
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Listener para sync em background
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Função para sincronização em background
async function doBackgroundSync() {
  try {
    // Aqui você pode sincronizar dados offline
    console.log('🔄 Executando sincronização em background...');
    
    // Exemplo: enviar formulários salvos offline
    const pendingForms = await getOfflineData('pendingForms');
    if (pendingForms && pendingForms.length > 0) {
      for (const form of pendingForms) {
        try {
          await submitForm(form);
          await removeOfflineData('pendingForms', form.id);
        } catch (error) {
          console.error('Erro ao sincronizar formulário:', error);
        }
      }
    }
  } catch (error) {
    console.error('Erro na sincronização:', error);
  }
}

// Função auxiliar para buscar dados offline
async function getOfflineData(key) {
  try {
    const cache = await caches.open('offline-data');
    const response = await cache.match(`/offline-data/${key}`);
    if (response) {
      return await response.json();
    }
  } catch (error) {
    console.error('Erro ao buscar dados offline:', error);
  }
  return null;
}

// Função auxiliar para remover dados offline
async function removeOfflineData(key, id) {
  try {
    // Implementar remoção de dados específicos
    console.log(`Removendo dados offline: ${key}/${id}`);
  } catch (error) {
    console.error('Erro ao remover dados offline:', error);
  }
}

// Função auxiliar para enviar formulário
async function submitForm(formData) {
  const response = await fetch('/api/submit-form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Listener para atualizações do service worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Limpeza periódica do cache
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupCache());
  }
});

// Função para limpeza do cache
async function cleanupCache() {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();
  const now = Date.now();
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 dias

  for (const request of requests) {
    const response = await cache.match(request);
    const dateHeader = response.headers.get('date');
    
    if (dateHeader) {
      const responseDate = new Date(dateHeader).getTime();
      if (now - responseDate > maxAge) {
        await cache.delete(request);
        console.log('🗑️ Cache expirado removido:', request.url);
      }
    }
  }
} 