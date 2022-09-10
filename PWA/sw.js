var cacheName = '5.26';
var appShellFiles = [
  // "https://api.ihint.me/qr.php?https://mp.weixin.qq.com/a/~Jaww_jP-YK1G39fiZ01Qxg~~",
  // "https://api.ihint.me/qr.php?HTTPS://QR.ALIPAY.COM/FKX05370OGFIX8QOBKXS35",
  // "https://api.ihint.me/wxpay.jpg",
  "/build/style.min.css",
  "/build/app.min.js",
  "/index.html",

  // "/build/scheme/*",
  "/build/scheme/c.min.js",
  "/build/scheme/daniu.min.js",
  "/build/scheme/guobiao.min.js",
  "/build/scheme/jiandao3.min.js",
  "/build/scheme/jiandao6.min.js",
  "/build/scheme/pinyinjiajia.min.js",
  "/build/scheme/sougou.min.js",
  "/build/scheme/weiruan.min.js",
  "/build/scheme/xiaoguan.min.js",
  "/build/scheme/xiaohe.min.js",
  "/build/scheme/xiaolang.min.js",
  "/build/scheme/xiaoyue.min.js",
  "/build/scheme/xingkong.min.js",
  "/build/scheme/yunbiaokuaipin.min.js",
  "/build/scheme/zhinengabc.min.js",
  "/build/scheme/ziguang.min.js",
  "/build/scheme/ziranma.min.js",

  // "PWA",
  "manifest.webmanifest",
];

// self.addEventListener('install', function (e) {
//   console.log('[Service Worker] Install');
//   e.waitUntil(
//     caches.open(cacheName).then(function (cache) {
//       console.log('[Service Worker] Caching all: app shell and content');
//       return cache.addAll(appShellFiles);
//     })
//   );
// });

// self.addEventListener('fetch', function (e) {
//   // debugger;
//   e.respondWith(
//     caches.match(e.request).then(function (r) {
//       console.log('[Service Worker] Fetching resource: ' + e.request.url);
//       return r || fetch(e.request).then(function (response) {
//         return caches.open(cacheName).then(function (cache) {
//           console.log('[Service Worker] Caching new resource: ' + e.request.url);
//           cache.put(e.request, response.clone());
//           return response;
//         });
//       });
//     })
//   );
// });

// self.addEventListener('activate', function (e) {
//   e.waitUntil(
//     caches.keys().then(function (keyList) {
//       return Promise.all(keyList.map(function (key) {
//         if (cacheName.indexOf(key) === -1) {
//           return caches.delete(key);
//         }
//       }));
//     })
//   );
// });