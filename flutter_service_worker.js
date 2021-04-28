'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "41c1b10f46a6fdaaf78625337ae46b42",
"assets/assets/fonts/slabo.ttf": "fe0782e4e06229988a6ee9f48c57d02d",
"assets/assets/images/burger1.png": "7b2d8298ebf90f1843e4277fa9211e89",
"assets/assets/images/burger2.png": "6573f8809ce334b91203a789dd26d289",
"assets/assets/images/burger3.png": "aebcf724b596773eb16192e7ff0b3dd0",
"assets/assets/images/burger4.png": "99da5091f59af2f154245d060e990e4f",
"assets/assets/images/burger5.png": "dfa628a4b2dc31c6618ef4d5f5448812",
"assets/assets/images/burger6.png": "52258732f450e1599553ea251906c6bd",
"assets/assets/images/Ka%25C5%259Farl%25C4%25B1-Pide.jpg": "2aedc96742d56b43e0a2a1886d1e471d",
"assets/assets/images/kusbasi-pide-tarifi.jpg": "3525045218241412a0af4700c5fcbf02",
"assets/assets/images/logo.PNG": "5cce9ae824290137548ee3d6cd2d24f5",
"assets/assets/images/pide1.PNG": "abe1c8324f667cdb935fa7bfd857687f",
"assets/assets/images/pide2.png": "9a910bda0d437879edd886162a1ab3c4",
"assets/assets/images/pide3.png": "f6596b6a535fee1dced7803061f02896",
"assets/assets/images/pide4.png": "3ad67aa994807db4b9a9abd6553c5df3",
"assets/assets/images/pide5.png": "c89d38aeee490384daa341a4fce46894",
"assets/assets/images/pide6.png": "760d1332d77a0eaa5d2247755256a2e4",
"assets/assets/images/pide7.png": "e54fe2e0cc710d4e9c70ed04aab92130",
"assets/assets/images/pide8.png": "26e9a77fd8ad8da6a17205641dac670d",
"assets/assets/images/pizza.png": "62ce2c10f75efe7a429f18366edede22",
"assets/assets/images/pizza2.png": "a3e0f424b3c14c78b3d4e054238a323e",
"assets/assets/images/pizza3.png": "57c694025f3e40747abf2e14c0af96c6",
"assets/assets/images/pizza4.png": "a6ae67cbf009a1768352c57513fd28a5",
"assets/assets/images/pizza5.png": "8038f97ba915f5d03549f833063f9b06",
"assets/assets/images/pizza6.png": "32f37f8dcf000d84379a10d117531b4d",
"assets/assets/images/sandvic1.png": "343d5f9f08d3c6592d61cc794aa0031c",
"assets/assets/images/sandvic2.png": "26f526e7498bd7324bef30da3461b92b",
"assets/assets/images/sandvic3.png": "84f3d0fd0925b4a6669f833cc91d36fe",
"assets/assets/images/sandvic4.jpg": "5caec7a67cc1bce35976ab86c449fdad",
"assets/assets/images/sandvic4.png": "c3691874022cb476fccc199e125354f3",
"assets/FontManifest.json": "ce1fdf5eda0eba95b08d0577b17b8512",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/NOTICES": "a8d1d130b9909728d724354dc06becc1",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "2787e0044c660924b672a3902420ed5c",
"/": "2787e0044c660924b672a3902420ed5c",
"main.dart.js": "d836a49aba04fa53d24ecb76a3e82f1f",
"manifest.json": "4f6eee9d03caf15395521984933fefaa",
"version.json": "4625d9f70e985051b67be321ac6f3579"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
