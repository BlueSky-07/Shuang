const CACHE_NAME = 'shuang-v6.0.20250822';

// 核心文件缓存列表 - 应用启动必需的文件
const CORE_FILES = [
  '/',
  '/index.html',
  '/build/app.min.js',
  '/build/style.min.css',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-192-maskable.png',
  '/icon-512-maskable.png',
  '/screenshot-mobile.png',
  '/screenshot-desktop.png',
  // 字典文件
  '/build/dict.min.js',
  '/build/dict-hant.min.js',
  '/build/bopomofo.min.js',
  // 核心逻辑
  '/build/core.min.js',
  '/build/setting.min.js',
  '/build/action.min.js',
  '/build/bootstrap.min.js',
  '/build/entry.min.js',
  // 列表文件
  '/build/scheme-list.min.js',
  '/build/mode-list.min.js',
  '/build/keyboard-layout-list.min.js',
  '/build/keyboard-layout.min.js'
];

// 双拼方案文件 - 按需缓存
const SCHEME_FILES = [
  '/build/scheme/ziranma.min.js',
  '/build/scheme/sougou.min.js', 
  '/build/scheme/weiruan.min.js',
  '/build/scheme/xiaohe.min.js',
  '/build/scheme/zhinengabc.min.js',
  '/build/scheme/pinyinjiajia.min.js',
  '/build/scheme/ziguang.min.js',
  '/build/scheme/guobiao.min.js',
  '/build/scheme/xiaolang.min.js',
  '/build/scheme/daniu.min.js',
  '/build/scheme/lantian.min.js',
  '/build/scheme/jiandao3.min.js',
  '/build/scheme/jiandao6.min.js',
  '/build/scheme/xingkong.min.js',
  '/build/scheme/xiaoguan.min.js',
  '/build/scheme/xiaoyue.min.js',
  '/build/scheme/yunbiaokuaipin.min.js',
  '/build/scheme/c.min.js',
  '/build/scheme/baiyun.min.js'
];

// 键盘布局文件
const KEYBOARD_LAYOUT_FILES = [
  '/build/keyboard-layout/qwerty.min.js',
  '/build/keyboard-layout/qwertz.min.js',
  '/build/keyboard-layout/azerty.min.js',
  '/build/keyboard-layout/dvorak.min.js',
  '/build/keyboard-layout/colemak.min.js',
  '/build/keyboard-layout/qzerty.min.js',
  '/build/keyboard-layout/workman.min.js'
];

// 安装事件
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      // 缓存核心文件
      caches.open(CACHE_NAME).then(cache => {
        console.log('Caching core files');
        return cache.addAll(CORE_FILES);
      }),
      // 缓存双拼方案文件
      caches.open(CACHE_NAME).then(cache => {
        console.log('Caching scheme files');
        return Promise.all(
          SCHEME_FILES.map(url => 
            cache.add(url).catch(err => console.log('Failed to cache:', url, err))
          )
        );
      }),
      // 缓存键盘布局文件
      caches.open(CACHE_NAME).then(cache => {
        console.log('Caching keyboard layout files');
        return Promise.all(
          KEYBOARD_LAYOUT_FILES.map(url => 
            cache.add(url).catch(err => console.log('Failed to cache:', url, err))
          )
        );
      })
    ]).then(() => {
      console.log('All files cached successfully');
      self.skipWaiting();
    }).catch(error => {
      console.error('Failed to cache some files:', error);
      self.skipWaiting(); // 即使部分失败也继续
    })
  );
});

// 激活事件
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});

// 拦截请求 - 改进版本，支持键位图等资源
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // 只处理同源请求
  if (url.origin !== location.origin) {
    return;
  }
  
  // 对于外部资源请求（如统计、QR码等），直接放行
  if (url.hostname !== location.hostname) {
    return;
  }
  
  event.respondWith(
    handleRequest(event.request)
  );
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // 首先检查缓存
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 网络请求
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      // 缓存成功响应
      const cache = await caches.open(CACHE_NAME);
      
      // 对于键位图和其他资源，也进行缓存
      if (shouldCache(url.pathname)) {
        cache.put(request, networkResponse.clone());
      }
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log('Network request failed:', url.pathname, error);
    
    // 网络失败的fallback处理
    if (request.destination === 'document') {
      const indexResponse = await caches.match('/index.html');
      return indexResponse || new Response('App offline', { status: 503 });
    }
    
    // 对于其他资源，返回通用错误
    return new Response('Resource unavailable offline', { 
      status: 404,
      statusText: 'Not Found'
    });
  }
}

// 判断是否应该缓存某个资源
function shouldCache(pathname) {
  return (
    pathname.startsWith('/build/') ||
    pathname.startsWith('/img/') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.png') ||
    pathname === '/' ||
    pathname === '/index.html' ||
    pathname === '/manifest.json'
  );
}