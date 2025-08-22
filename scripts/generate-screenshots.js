const fs = require('fs');
const path = require('path');
const { convertSvgToPng } = require('../keyboard/png');

// Mobile screenshot (392x696)
const mobileScreenshot = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 392 696" style="background: #eee;">
  <!-- Header -->
  <rect x="0" y="0" width="392" height="60" fill="#fff"/>
  <text x="196" y="35" text-anchor="middle" fill="#000" font-family="sans-serif" font-size="18" font-weight="bold">双拼练习</text>
  
  <!-- Controls -->
  <rect x="20" y="80" width="352" height="40" fill="#fff" stroke="#ccc"/>
  <text x="30" y="105" fill="#000" font-family="sans-serif" font-size="14">双拼方案：自然码</text>
  
  <!-- Main exercise area -->
  <rect x="20" y="140" width="352" height="200" fill="#fff" stroke="#ccc"/>
  <text x="196" y="200" text-anchor="middle" fill="#000" font-family="sans-serif" font-size="72" font-weight="bold">双</text>
  <text x="196" y="240" text-anchor="middle" fill="#666" font-family="sans-serif" font-size="24">shuang</text>
  <rect x="146" y="260" width="100" height="40" fill="#f9f9f9" stroke="#ddd"/>
  <text x="196" y="285" text-anchor="middle" fill="#999" font-family="sans-serif" font-size="16">输入双拼</text>
  
  <!-- Keyboard hint -->
  <rect x="20" y="360" width="352" height="120" fill="#f8f8f8" stroke="#ddd"/>
  <text x="196" y="385" text-anchor="middle" fill="#000" font-family="sans-serif" font-size="14">键位提示</text>
  <rect x="40" y="400" width="30" height="30" fill="#333"/>
  <text x="55" y="420" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="12">S</text>
  <rect x="80" y="400" width="30" height="30" fill="#333"/>  
  <text x="95" y="420" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="12">H</text>
  <text x="130" y="420" text-anchor="middle" fill="#666" font-family="sans-serif" font-size="12">= shuang</text>
  
  <!-- Footer -->
  <text x="196" y="520" text-anchor="middle" fill="#999" font-family="sans-serif" font-size="12">帮助你快速上手双拼输入法</text>
</svg>`;

// Desktop screenshot (1280x800) 
const desktopScreenshot = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 800" style="background: #eee;">
  <!-- Header controls -->
  <rect x="50" y="20" width="1180" height="60" fill="#fff"/>
  <text x="100" y="50" fill="#000" font-family="sans-serif" font-size="16" font-weight="bold">双拼方案：</text>
  <rect x="200" y="30" width="120" height="30" fill="#f9f9f9" stroke="#ddd"/>
  <text x="210" y="50" fill="#000" font-family="sans-serif" font-size="14">自然码</text>
  
  <text x="400" y="50" fill="#000" font-family="sans-serif" font-size="16" font-weight="bold">练习模式：</text>
  <rect x="500" y="30" width="120" height="30" fill="#f9f9f9" stroke="#ddd"/>
  <text x="510" y="50" fill="#000" font-family="sans-serif" font-size="14">全部随机</text>
  
  <!-- Main exercise area -->
  <rect x="300" y="120" width="680" height="300" fill="#fff" stroke="#ddd"/>
  <rect x="350" y="170" width="250" height="200" fill="#f9f9f9"/>
  <text x="475" y="280" text-anchor="middle" fill="#000" font-family="sans-serif" font-size="96" font-weight="bold">双</text>
  
  <rect x="650" y="170" width="280" height="200" fill="#f9f9f9"/>
  <text x="790" y="220" text-anchor="middle" fill="#000" font-family="sans-serif" font-size="36">shuang</text>
  <rect x="720" y="260" width="140" height="50" fill="#fff" stroke="#ccc"/>
  <text x="790" y="290" text-anchor="middle" fill="#999" font-family="sans-serif" font-size="18">输入双拼</text>
  
  <!-- Keyboard layout -->
  <rect x="50" y="460" width="1180" height="280" fill="#f8f8f8" stroke="#ddd"/>
  <text x="640" y="490" text-anchor="middle" fill="#000" font-family="sans-serif" font-size="18" font-weight="bold">键位图显示</text>
  
  <!-- Keyboard rows -->
  <g transform="translate(200,520)">
    <!-- Row 1 -->
    <rect x="0" y="0" width="40" height="40" fill="#fff" stroke="#ccc"/>
    <text x="20" y="25" text-anchor="middle" fill="#000" font-family="sans-serif" font-size="14">Q</text>
    <rect x="50" y="0" width="40" height="40" fill="#fff" stroke="#ccc"/>
    <text x="70" y="25" text-anchor="middle" fill="#000" font-family="sans-serif" font-size="14">W</text>
    <rect x="100" y="0" width="40" height="40" fill="#fff" stroke="#ccc"/>
    <text x="120" y="25" text-anchor="middle" fill="#000" font-family="sans-serif" font-size="14">E</text>
    <!-- More keys... -->
    <text x="400" y="25" text-anchor="middle" fill="#666" font-family="sans-serif" font-size="12">自然码键位布局</text>
  </g>
  
  <!-- Instructions -->
  <text x="640" y="770" text-anchor="middle" fill="#999" font-family="sans-serif" font-size="14">空格键切换 · Tab键显示答案 · 支持18+种双拼方案</text>
</svg>`;

// Generate PNG screenshots
const mobileBuffer = convertSvgToPng(mobileScreenshot, { background: 'transparent' });
const desktopBuffer = convertSvgToPng(desktopScreenshot, { background: 'transparent' });

// Save screenshots
fs.writeFileSync(path.resolve(__dirname, '../screenshot-mobile.png'), mobileBuffer);
fs.writeFileSync(path.resolve(__dirname, '../screenshot-desktop.png'), desktopBuffer);

console.log('Screenshots generated:');
console.log('- screenshot-mobile.png (392x696)');
console.log('- screenshot-desktop.png (1280x800)');