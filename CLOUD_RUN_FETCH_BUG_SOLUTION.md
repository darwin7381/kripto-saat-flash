# Cloud Run 環境下 Next.js SSR Fetch 失敗問題解決方案

## 🚨 問題描述

### 症狀
- **本地端**：SSR 正常，API 請求成功，頁面顯示完整數據
- **Cloud Run 生產環境**：SSR 失敗，API 請求失敗，頁面顯示空數據 `flashes: []`
- **錯誤訊息**：`TypeError: fetch failed` 來自 `undici/index.js`

### 影響範圍
- 所有 SSR 階段的外部 API 請求
- 主要影響首頁快訊列表載入
- 導致用戶看到空白頁面，嚴重影響 UX

## 🔍 根本原因分析

### 技術原因
1. **Next.js undici polyfill 問題**：
   - Next.js 在某些環境（特別是 Cloud Run）使用編譯版的 `undici` 作為 fetch polyfill
   - 這個編譯版本在 Cloud Run 環境下有 bug，導致網路請求失敗

2. **環境差異**：
   - 本地端：使用瀏覽器原生 fetch 或 Node.js 標準 fetch
   - Cloud Run：強制使用 Next.js 編譯版 undici polyfill

3. **錯誤堆疊**：
   ```
   TypeError: fetch failed
   at Object.fetch (/var/task/node_modules/next/dist/compiled/undici/index.js:1:26684)
   cause: TypeError: Cannot read properties of undefined (reading 'reason')
   at makeAppropriateNetworkError (/var/task/node_modules/next/dist/compiled/undici/index.js:2:54604)
   ```

### 相關 Issue
- Next.js Issue #44062: undici fetch failed in server component since next 13.0.6
- 多個 Google Cloud Community 回報類似問題
- Vercel 部署也有類似問題報告

## ✅ 解決方案

### 採用方案：fetch-ponyfill
使用 `fetch-ponyfill` 替代 Next.js 內建的有問題 undici polyfill。

#### 安裝
```bash
npm install fetch-ponyfill
```

#### 實施
```typescript
// src/lib/api.ts
import fetchPonyfill from 'fetch-ponyfill';

// 使用 fetch-ponyfill 解決 Cloud Run 環境下 Next.js undici polyfill 問題
const { fetch } = fetchPonyfill();
```

#### 效果
- ✅ 完全解決 Cloud Run 環境下的 fetch 問題
- ✅ 保持與本地端完全一致的行為
- ✅ 不影響現有架構（SSR + CSR 混合模式）
- ✅ 零配置變更，只需替換 fetch 函數

## 🚫 不採用的方案

### 1. 環境變數 `__NEXT_USE_UNDICI`
- **問題**：Vercel 特定，不適用於 Cloud Run
- **風險**：依賴區域設定，不穩定

### 2. node-fetch 替代
- **問題**：Next.js 13.14.0+ 已移除 node-fetch 支援
- **風險**：未來版本不兼容

### 3. 動態 import node-fetch
- **問題**：型別複雜，webpack 兼容性問題
- **風險**：維護困難

### 4. 修改 runtime 設定
- **問題**：改變整體架構
- **風險**：影響其他功能

## 🔧 驗證步驟

### 本地測試
```bash
npm run build  # 應顯示 "SSR: Fetched flashes: 25"
```

### 生產環境測試
```bash
# API 端點測試
curl -s "https://kripto-saat-flash-4614722018.europe-west1.run.app/api/flashes/top" | jq '.success'
# 應返回：true

# 前端頁面測試
curl -s "https://kriptosaat.com/flash"
# 應顯示完整快訊列表，而非空數據
```

## 📝 預防措施

### 開發階段
1. 在本地端進行 Docker 建構測試
2. 模擬 Cloud Run 環境測試 SSR
3. 監控建構日誌中的 SSR 成功/失敗訊息

### 部署階段
1. 檢查 API 端點回應
2. 驗證前端頁面數據載入
3. 監控 Cloud Run 日誌

### 監控告警
- API 成功率 < 95%
- 頁面空數據率 > 5%
- SSR 錯誤率 > 1%

## 🚨 重要提醒

### 高危操作
- **禁止移除 fetch-ponyfill**：會導致問題復發
- **禁止回退到內建 fetch**：Cloud Run 環境下會失敗
- **禁止修改 runtime 到 edge**：會引發其他問題

### 相關檔案
- `src/lib/api.ts`：核心 API 服務，包含 fetch-ponyfill
- `package.json`：確保 fetch-ponyfill 依賴存在
- 建構日誌：監控 SSR 成功訊息

## 📚 參考資料

### GitHub Issues
- [Next.js #44062](https://github.com/vercel/next.js/issues/44062): undici fetch failed
- [Next.js #54588](https://github.com/vercel/next.js/issues/54588): Edge Runtime issues

### 社群解決方案
- [Medium: Fix Vercel + Next.JS fetch failed](https://medium.com/@kaloyan_17221/fix-vercel-next-js-fetch-failed-from-undici-polyfill-8c66346c9c2f)
- [Google Cloud Community](https://www.googlecloudcommunity.com/gc/Apigee/Nextjs-server-side-component-not-able-to-fetch-data-while/m-p/805465): 確認 runtime 設定解決方案

---

**最後更新**：2025-06-28  
**解決狀態**：✅ 已完全解決  
**驗證環境**：本地端 + Cloud Run 生產環境 