// 自動更新版本號腳本
// Automatic Version Update Script

const fs = require('fs');
const path = require('path');
const VERSION = require('../version.js');

console.log(`正在更新版本號為: ${VERSION.withPrefix}`);

// 更新 package.json
const packagePath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
packageJson.version = VERSION.packageVersion;
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
console.log(`已更新 package.json: ${VERSION.packageVersion}`);

// 更新 README.md
const readmePath = path.join(__dirname, '../README.md');
let readmeContent = fs.readFileSync(readmePath, 'utf8');
readmeContent = readmeContent.replace(/^v\d+\.\d+ \d{4}\.\d{2}\.\d{2} 更新$/m, `${VERSION.withPrefix} 更新`);
fs.writeFileSync(readmePath, readmeContent);
console.log(`已更新 README.md: ${VERSION.withPrefix} 更新`);

// 更新 index.html
const indexPath = path.join(__dirname, '../index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');
// 更新註釋中的日期
indexContent = indexContent.replace(/<!-- last changed: \d{4}\.\d{1,2}\.\d{1,2} -->/g, `<!-- last changed: ${VERSION.date.replace(/(\d{4})\.(\d{2})\.(\d{2})/, '$1.$2.$3')} -->`);
// 更新版本號
indexContent = indexContent.replace(/v\d+\.\d+ \d{4}\.\d{2}\.\d{2}/g, VERSION.withPrefix);
fs.writeFileSync(indexPath, indexContent);
console.log(`已更新 index.html: ${VERSION.withPrefix}`);

// 更新 index.src.html
const indexSrcPath = path.join(__dirname, '../index.src.html');
let indexSrcContent = fs.readFileSync(indexSrcPath, 'utf8');
// 更新註釋中的日期
indexSrcContent = indexSrcContent.replace(/<!-- last changed: \d{4}\.\d{1,2}\.\d{1,2} -->/g, `<!-- last changed: ${VERSION.date.replace(/(\d{4})\.(\d{2})\.(\d{2})/, '$1.$2.$3')} -->`);
// 更新版本號
indexSrcContent = indexSrcContent.replace(/v\d+\.\d+ \d{4}\.\d{2}\.\d{2}/g, VERSION.withPrefix);
fs.writeFileSync(indexSrcPath, indexSrcContent);
console.log(`已更新 index.src.html: ${VERSION.withPrefix}`);

// 更新 sw.js (Service Worker)
const swPath = path.join(__dirname, '../sw.js');
let swContent = fs.readFileSync(swPath, 'utf8');
// 更新緩存名稱
swContent = swContent.replace(/const CACHE_NAME = 'shuang-v[\d\.]+';/g, `const CACHE_NAME = '${VERSION.cacheName}';`);
fs.writeFileSync(swPath, swContent);
console.log(`已更新 sw.js: ${VERSION.cacheName}`);

console.log('所有文件版本號更新完成！');
console.log(`當前版本: ${VERSION.withPrefix}`);
console.log(`緩存名稱: ${VERSION.cacheName}`);