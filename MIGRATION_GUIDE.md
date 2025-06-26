# 從 Mock Data 到 STRAPI 遷移指南

## 📋 概述

本指南將幫助您將 NextJS Flash System 從使用 Mock Data 完全遷移到使用 STRAPI 作為資料源。

## 🔄 遷移內容

### 1. **資料結構更新**
- ✅ **Flash 類型定義**：已更新匹配 STRAPI schema
- ✅ **Author/Category/Tag 類型**：新增完整的 STRAPI 欄位支援
- ✅ **向後兼容**：保留舊 Mock Data 欄位以確保平滑過渡

### 2. **API 層改進**
- ✅ **STRAPI 整合**：完整的 STRAPI REST API 整合
- ✅ **資料轉換**：自動轉換 STRAPI 格式到內部格式
- ✅ **錯誤處理**：統一的 API 錯誤處理機制

### 3. **組件更新**
- ✅ **FlashNewsCard**：使用真實的看漲/看跌數據和來源連結
- ✅ **FlashCard**：向後兼容的日期和瀏覽次數顯示
- ✅ **FlashListContainer**：正確的日期分組和重要快訊標記

## 🚀 快速啟動

### 步驟 1：環境變數設定
創建 `.env.local` 檔案：

```bash
# Mock Mode 控制（設為 false 啟用 STRAPI）
MOCK_MODE_ENABLED=false

# STRAPI 連接設定
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token_here

# 其他設定（可選）
REDIS_URL=redis://localhost:6379
SITE_URL=http://localhost:3000
NODE_ENV=development
```

### 步驟 2：確保 STRAPI 服務運行
```bash
# 切換到 STRAPI 目錄
cd ../kripto-saat-strapi

# 安裝依賴
npm install

# 啟動 STRAPI
npm run develop
```

### 步驟 3：切換到 STRAPI 模式
```bash
# 在 NextJS 項目中
cd kripto-saat-flash

# 設定環境變數
echo "MOCK_MODE_ENABLED=false" >> .env.local

# 重啟開發服務器
npm run dev
```

## 📊 資料結構對照表

### Flash 資料結構

| Mock Data 欄位 | STRAPI 欄位 | 說明 |
|---|---|---|
| `published_at` | `published_datetime` | 發布時間（主要欄位） |
| `isImportant` | `is_important` | 重要快訊標記 |
| `meta.views` | `view_count` | 瀏覽次數 |
| `meta.bullish_count` | `bullish_count` | 看漲用戶數 |
| `meta.bearish_count` | `bearish_count` | 看跌用戶數 |
| `meta.source_url` | `source_url` | 來源連結 |
| - | `is_featured` | 特色快訊（新增） |

### Author 資料結構

| Mock Data 欄位 | STRAPI 欄位 | 說明 |
|---|---|---|
| `name` | `name` | 作者姓名 |
| `email` | `email` | 電子郵件 |
| - | `bio` | 個人簡介（新增） |
| - | `social_links` | 社交連結（新增） |
| - | `wp_user_id` | WordPress 用戶 ID（新增） |

## 🔧 功能對照

### 已實現功能
- ✅ **熱門快訊分頁**：`/api/flashes/top?page=1&limit=25`
- ✅ **快訊詳情頁**：`/flash/[slug]`
- ✅ **分類快訊**：`/flash/category/[slug]`
- ✅ **更新檢查**：30秒輪詢檢查新快訊
- ✅ **圖片支援**：STRAPI Media Library 整合
- ✅ **作者信息**：完整的作者資料和頭像
- ✅ **分類標籤**：支援層級分類和標籤顏色

### 計劃功能（需要後續實現）
- 🔄 **歷史區段 API**：`/api/flashes/segment/[segmentId]`
- 🔄 **搜尋功能**：整合 Elasticsearch
- 🔄 **即時推送**：Webhook 整合
- 🔄 **快取優化**：Redis + Cloudflare 整合

## 🛠️ 開發工具

### Mock Mode 開關
可以隨時在 Mock Data 和 STRAPI 之間切換：

```bash
# 切換到 Mock Mode
echo "MOCK_MODE_ENABLED=true" >> .env.local

# 切換到 STRAPI Mode  
echo "MOCK_MODE_ENABLED=false" >> .env.local

# 重啟服務器生效
npm run dev
```

### API 測試
```bash
# 測試 STRAPI 連接
curl http://localhost:1337/api/flashes

# 測試 NextJS API
curl http://localhost:3000/api/flashes/top
```

## 🔍 故障排除

### 常見問題

**1. STRAPI 連接失敗**
```bash
# 檢查 STRAPI 是否運行
curl http://localhost:1337/admin

# 檢查環境變數
echo $STRAPI_URL
```

**2. 資料格式錯誤**
- 確認 STRAPI schema 與類型定義一致
- 檢查 API populate 參數是否正確

**3. 圖片加載失敗**
- 確認 STRAPI Media Library 權限設定
- 檢查 CORS 設定

### 除錯技巧

**啟用詳細日誌：**
```bash
# 在 .env.local 添加
DEBUG=api:*
NEXT_PUBLIC_DEV_TOOLS=true
```

**檢查 API 回應：**
```javascript
// 在瀏覽器 Console 中
console.log(await fetch('/api/debug').then(r => r.json()));
```

## 📈 效能考量

### 快取策略
- **Level 1**：瀏覽器快取（已實現）
- **Level 2**：NextJS API 快取（已實現）
- **Level 3**：Redis 快取（計劃中）
- **Level 4**：Cloudflare CDN（計劃中）

### 建議的生產設定
```bash
# 生產環境變數
NODE_ENV=production
MOCK_MODE_ENABLED=false
STRAPI_URL=https://your-strapi-domain.com
REDIS_URL=redis://your-redis-host:6379
```

## 🎯 下一步計劃

1. **完整的快取系統**：Redis + Cloudflare 整合
2. **即時更新**：WebSocket 或 Server-Sent Events
3. **搜尋功能**：Elasticsearch 整合
4. **管理介面**：STRAPI Admin 客製化
5. **監控系統**：效能和錯誤監控

## 📞 支援

如遇到問題，請檢查：
1. STRAPI 服務是否正常運行
2. 環境變數是否正確設定
3. 資料庫連接是否正常
4. API Token 是否有效

---

**注意**：此遷移保持向後兼容，可以隨時在 Mock Mode 和 STRAPI Mode 之間切換進行測試。 