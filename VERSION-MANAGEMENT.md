# 版本號統一管理系統

## 概述

本項目已實現版本號的統一管理，通過修改單一文件即可更新所有地方的版本號。

## 文件結構

- `version.js` - 版本號統一配置文件
- `scripts/update-version.js` - 自動更新版本號腳本
- `VERSION-MANAGEMENT.md` - 本說明文檔

## 如何更新版本

### 方法一：修改配置文件 + 運行腳本

1. 編輯 `version.js` 文件，修改版本信息：
   ```javascript
   const VERSION = {
     major: 6,     // 主版本號
     minor: 0,     // 次版本號
     date: '2025.08.22',  // 發佈日期
     // ...
   };
   ```

2. 運行更新腳本：
   ```bash
   npm run update-version
   ```

### 方法二：直接修改並運行（推薦）

可以直接在 `version.js` 中修改版本信息，然後運行 `npm run update-version` 即可自動更新所有文件。

## 自動更新的文件

腳本會自動更新以下文件中的版本號：

1. `package.json` - NPM 包版本
2. `README.md` - 說明文檔版本
3. `index.html` - 主頁面版本號和修改日期
4. `index.src.html` - 源頁面版本號和修改日期
5. `sw.js` - Service Worker 緩存版本名稱

## 版本格式說明

- 完整版本: `6.0 2025.08.22`
- 帶前綴版本: `v6.0 2025.08.22`
- 包版本: `6.0 2025.08.22`
- HTML 註釋日期: `2025.08.22`
- 緩存名稱: `shuang-v6.0.20250822` (Service Worker 使用)

## 使用示例

更新到新版本：

```bash
# 1. 修改 version.js 中的版本信息
# 2. 運行更新腳本
npm run update-version
```

輸出示例：
```
正在更新版本號為: v6.0 2025.08.22
已更新 package.json: 6.0 2025.08.22
已更新 README.md: v6.0 2025.08.22 更新
已更新 index.html: v6.0 2025.08.22
已更新 index.src.html: v6.0 2025.08.22
已更新 sw.js: shuang-v6.0.20250822
所有文件版本號更新完成！
當前版本: v6.0 2025.08.22
緩存名稱: shuang-v6.0.20250822
```

## 注意事項

1. 每次發佈新版本前，記得更新 `version.js` 中的日期
2. 運行 `npm run update-version` 後，所有相關文件會自動更新
3. 版本號格式請保持一致性
4. 建議在提交代碼前運行一次版本更新腳本以確保一致性