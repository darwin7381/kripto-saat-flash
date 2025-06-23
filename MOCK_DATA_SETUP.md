# Mock 資料設置指南

## 📋 概述

為了讓前端開發不依賴後端 StrAPI，我們建立了完整的 Mock 資料系統。這套系統包含：

- **100 條真實感的中文加密貨幣快訊**
- **8 個主要分類**（比特幣、以太坊、DeFi、NFT 等）
- **37 個常用標籤**（BTC、ETH、Binance、鯨魚等）
- **8 位假作者**
- **完整的 API 模擬服務**

## 🚀 啟用 Mock 模式

### 方法一：環境變數設定（推薦）

在專案根目錄建立 `.env.local` 文件：

```bash
# 啟用 Mock 模式
USE_MOCK_DATA=true

# 其他環境變數（Mock 模式下不需要，但可以預先配置）
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token_here
REDIS_URL=redis://localhost:6379
SITE_URL=http://localhost:3000
SITE_NAME=Kripto Saat Flash
NODE_ENV=development
```

### 方法二：動態切換（開發測試用）

在瀏覽器 Console 中執行：

```javascript
// 切換到 Mock 模式
apiService.setMockMode(true);

// 切換到真實模式
apiService.setMockMode(false);

// 檢查當前模式
console.log('當前模式:', apiService.getMockMode() ? 'Mock' : 'Real');
```

## 📁 Mock 資料結構

```
src/data/mock/
├── categories.ts      # 8個主要分類
├── tags.ts           # 37個常用標籤
├── authors.ts        # 8位假作者
├── flashes.ts        # 100條假快訊（基於真實內容）
├── api.ts           # Mock API 服務
└── index.ts         # 統一導出
```

## 📰 假快訊內容特色

基於 **BlockBeats** 和 **金色財經** 的真實快訊內容，包含：

### 熱門話題
- Metaplanet增持BTC新聞
- TRC20-USDT發行量突破800億
- 以太坊巨鯨轉帳活動
- 香港Web3政策發展
- DeFi協議安全事件

### 內容格式
- **標題**：簡潔明瞭，符合快訊特色
- **內容**：200-500字的詳細描述
- **時間**：最近7天內的隨機時間
- **圖片**：60%機率有特色圖片（使用 Unsplash）
- **標籤**：1-4個相關標籤

## 🔧 API 端點測試

Mock 模式下，所有 API 端點都會返回假資料：

### 熱門快訊
```bash
GET /api/flashes/top?page=1&limit=25
```

### 歷史區段
```bash
GET /api/flashes/segment/1
```

### 快訊詳情
```bash
GET /api/flashes/flash-1-metaplanet增持1111枚btc總持倉達11111枚
```

### 分類快訊
```bash
GET /api/categories/bitcoin
```

### 檢查更新
```bash
GET /api/flashes/check-updates?lastId=50
```

## 🎨 UI 組件測試

### FlashCard 組件
顯示單個快訊卡片，包含：
- 標題和摘要
- 發布時間（相對時間）
- 作者信息
- 分類和標籤
- 特色圖片（如有）
- 瀏覽次數和閱讀時間

### FlashListContainer 組件
無限滾動容器，支援：
- 初始載入 25 條快訊
- 向下滾動自動載入更多
- Hot/Cold 系統自動切換
- 載入狀態和錯誤處理

## 📊 Mock 資料統計

- **總快訊數**：100 條
- **分類分布**：每個分類 8-15 條快訊
- **時間分布**：最近 7 天內均勻分布
- **作者分布**：8 位作者平均分配
- **圖片比例**：約 60% 的快訊有特色圖片

## 🔄 從 Mock 切換到真實資料

當 StrAPI 準備好後，只需：

1. **更新環境變數**：
   ```bash
   USE_MOCK_DATA=false
   STRAPI_URL=https://your-strapi-domain.com
   STRAPI_API_TOKEN=your_real_token
   ```

2. **重啟開發服務器**：
   ```bash
   npm run dev
   ```

3. **驗證切換成功**：
   - 檢查 API 回應中的 `meta.mode` 字段
   - 應該顯示 `"mode": "live"` 而非 `"mode": "mock"`

## 🐛 除錯和測試

### 檢查當前模式
每個 API 回應都包含 `meta.mode` 字段：

```json
{
  "success": true,
  "data": {...},
  "meta": {
    "mode": "mock",
    "timestamp": "2025-01-22T10:30:00Z"
  }
}
```

### 常見問題

**Q: 快訊內容不夠真實？**  
A: 我們基於真實競品內容建立模板，並加入隨機變化

**Q: 如何添加更多假資料？**  
A: 編輯 `src/data/mock/flashes.ts` 中的 `flashTemplates` 數組

**Q: Mock API 響應太慢？**  
A: 可調整 `src/data/mock/api.ts` 中的 `delay()` 函數參數

**Q: 切換模式後沒有變化？**  
A: 重啟開發服務器，並清除瀏覽器快取

## 🎯 下一步計劃

1. **完善真實 API 整合**
2. **建立 StrAPI 內容模型**
3. **實施快取策略**
4. **建立 Webhook 更新機制**
5. **優化 SEO 和結構化資料**

---

**注意**：Mock 模式僅用於開發環境，生產環境將自動切換到真實 API。 