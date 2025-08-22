const fs = require('fs');
const path = require('path');
const { convertSvgToPng } = require('../keyboard/png');

// 读取SVG图标
const svgPath = path.resolve(__dirname, '../icon.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

// 读取maskable SVG图标
const maskableSvgPath = path.resolve(__dirname, '../icon-maskable.svg');
const maskableSvgContent = fs.readFileSync(maskableSvgPath, 'utf8');

// 生成不同尺寸的PNG图标
const sizes = [
  { size: 192, filename: 'icon-192.png', isMaskable: false },
  { size: 512, filename: 'icon-512.png', isMaskable: false },
  { size: 192, filename: 'icon-192-maskable.png', isMaskable: true },
  { size: 512, filename: 'icon-512-maskable.png', isMaskable: true }
];

for (const { size, filename, isMaskable } of sizes) {
  let targetSvg = isMaskable ? maskableSvgContent : svgContent;
  
  // 修改SVG的viewBox和尺寸
  const scaledSvg = targetSvg
    .replace('viewBox="0 0 192 192"', `viewBox="0 0 ${size} ${size}"`)
    .replace('width="192"', `width="${size}"`)
    .replace('height="192"', `height="${size}"`);

  // 转换为PNG
  const pngBuffer = convertSvgToPng(scaledSvg, {
    background: 'transparent'
  });

  // 保存文件
  const outputPath = path.resolve(__dirname, '..', filename);
  fs.writeFileSync(outputPath, pngBuffer);
  console.log(`Generated: ${filename}`);
}

console.log('PWA icons generated successfully!');