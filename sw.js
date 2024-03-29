// Service worker file - sw.js

const CACHE_NAME = 'prathamesh-portfolio-v1';
const startURL = '/PrathameshBelvalkarPortFolio'; // Update this with your new start URL

const urlsToCache = [
  'css/bootstrap.css',
  'vendors/linericon/style.css',
  'css/font-awesome.min.css',
  'vendors/owl-carousel/owl.carousel.min.css',
  'css/magnific-popup.css',
  'vendors/nice-select/css/nice-select.css',
  'css/style.css',
  'js/jquery-3.2.1.min.js',
  'js/popper.js',
  'js/bootstrap.min.js',
  'js/stellar.js',
  'js/jquery.magnific-popup.min.js',
  'vendors/nice-select/js/jquery.nice-select.min.js',
  'vendors/isotope/imagesloaded.pkgd.min.js',
  'vendors/isotope/isotope-min.js',
  'vendors/owl-carousel/owl.carousel.min.js',
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        const fetchRequest = event.request.clone();
        return fetch(fetchRequest)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          })
          .catch(() => {
            return caches.match(startURL); // Return the start URL when fetch fails
          });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
});
