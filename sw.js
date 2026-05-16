const CACHE_NAME = "catmeals-v1"; // 💡 Mude esse 'v1' para 'v2' sempre que quiser forçar os celulares a atualizarem o código antigo!

// Usando caminhos relativos para funcionar em qualquer servidor
const URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./favicon.ico",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Instalação: Cria o cache e armazena os arquivos básicos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS);
    })
  );
});

// Ativação: Limpa caches antigos de versões anteriores automaticamente
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Busca: Tenta servir o cache; se não tiver, busca na rede
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// ⚡ ESSENCIAL PARA A ATUALIZAÇÃO AUTOMÁTICA
// Escuta o comando enviado pelo index.html atualizado e ativa o novo sw imediatamente
self.addEventListener("message", (event) => {
  if (event.data && event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});