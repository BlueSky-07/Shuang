/** last changed: 2024.12.29 */

const polyfills = [
  'https://cdn.jsdelivr.net/npm/@babel/polyfill@7.12.1/dist/polyfill.min.js',
  'https://cdn.jsdelivr.net/npm/classlist.js@1.1.20150312/classList.min.js'
]

if (navigator && navigator.userAgent && /msie|trident/i.test(navigator.userAgent)) {
  let imported = 0
  for (const polyfill of polyfills) {
    const script = document.createElement('script')
    script.setAttribute('src', polyfill)
    script.onload = () => {
      imported ++
      if (imported === polyfills.length) {
        Shuang.app.action.init()
      }
    }
    document.head.appendChild(script)
  }
} else {
  Shuang.app.action.init()
}
