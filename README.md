# Kripto Saat Flash - 快訊系統

基於 Next.js 和 shadcn/ui 建立的土耳其加密貨幣快訊系統，採用雙系統架構設計支援高負載和即時更新。

## 🚀 專案特色

- **🔥 雙系統 API 設計**: Hot/Cold 數據分離，支援 3000 萬 PV 流量
- **⚡ 無限滾動**: 無縫切換熱門頁面和歷史區段
- **🎨 現代化 UI**: 使用 shadcn/ui 組件和 Tailwind CSS
- **🔍 SEO 優化**: SSR 渲染確保搜尋引擎友好
- **📱 響應式設計**: 針對土耳其 70% 手機用戶優化
- **🌐 土耳其語支援**: 完整的土耳其語界面和內容

## 📋 技術棧

- **前端框架**: Next.js 15 (App Router)
- **UI 組件庫**: shadcn/ui + Radix UI
- **樣式**: Tailwind CSS
- **語言**: TypeScript
- **數據來源**: StrAPI CMS
- **部署**: Google Cloud Run (推薦)

## 🏗️ 專案結構

```
kripto-saat-flash/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API 路由
│   │   │   ├── flashes/       # 快訊相關 API
│   │   │   │   ├── top/       # 熱門頁面 API (系統一)
│   │   │   │   ├── segment/   # 歷史區段 API (系統二)
│   │   │   │   └── check-updates/ # 更新檢查 API
│   │   │   └── categories/    # 分類 API
│   │   ├── flash/             # 快訊頁面
│   │   │   ├── page.tsx       # 快訊首頁
│   │   │   └── [slug]/        # 快訊詳情頁
│   │   └── globals.css        # 全域樣式
│   ├── components/            # React 組件
│   │   ├── ui/               # shadcn/ui 基礎組件
│   │   └── flash/            # 快訊相關組件
│   │       ├── FlashCard.tsx        # 快訊卡片
│   │       └── FlashListContainer.tsx # 列表容器
│   ├── lib/                  # 工具函數
│   │   ├── api.ts            # API 服務層
│   │   ├── config.ts         # 配置管理
│   │   └── utils.ts          # 通用工具
│   └── types/                # TypeScript 類型定義
│       └── flash.ts          # 快訊相關類型
├── components.json           # shadcn/ui 配置
├── tailwind.config.ts        # Tailwind 配置
└── package.json
```

## 🛠️ 開發設置

### 環境要求

- Node.js >= 18.0.0
- npm >= 8.0.0

### 安裝與啟動

```bash
# 進入專案目錄
cd kripto-saat-flash

# 安裝依賴
npm install

# 複製環境變數範例文件（需要設置）
cp .env.example .env.local

# 啟動開發服務器
npm run dev
```

### 環境變數配置

在 `.env.local` 文件中設置以下變數：

```env
# StrAPI 配置
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_token

# Redis 配置
REDIS_URL=redis://localhost:6379

# Cloudflare 配置  
CLOUDFLARE_TOKEN=your_cloudflare_token
CLOUDFLARE_ZONE_ID=your_zone_id

# WordPress 整合
WORDPRESS_URL=http://localhost:8080
WORDPRESS_API_URL=http://localhost:8080/wp-json/wp/v2

# 網站配置
SITE_URL=https://kriptosaat.com
NEXT_PUBLIC_SITE_NAME="Kripto Saat"
```

## 📡 API 設計

### 系統一：熱門頁面 (Hot Data)
```
GET /api/flashes/top?page=1&limit=25
```
- 支援前 10 頁最新快訊
- 內容會因新增而推移
- 永久快取 + Webhook 清除

### 系統二：歷史區段 (Cold Data)  
```
GET /api/flashes/segment/[segmentId]
```
- 25 篇為一個區段
- 區段 ID 永久固定
- 永久快取，內容穩定

### 更新檢查
```
GET /api/flashes/check-updates?lastId=12345
```
- 檢查是否有新快訊
- 支援 1 分鐘輪詢
- 永久快取 + 即時清除

## 🎨 UI 組件

### FlashCard
快訊卡片組件，包含：
- 特色圖片
- 標題和摘要
- 分類和標籤
- 作者和時間信息
- 響應式設計

### FlashListContainer  
列表容器組件，支援：
- 無限滾動載入
- 雙系統 API 切換
- 載入狀態處理
- 錯誤處理
- 自動更新檢查

## 🚀 部署

### Google Cloud Run (推薦)

```bash
# 建立 Docker 映像
docker build -t kripto-saat-flash .

# 部署到 Cloud Run
gcloud run deploy kripto-saat-flash \
  --image gcr.io/your-project/kripto-saat-flash \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Vercel (簡單部署)

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel
```

## 📊 性能指標

- **首屏載入**: < 2 秒 (移動設備)
- **API 響應**: < 500ms
- **快取命中率**: > 90%
- **SEO 分數**: 95+ (Lighthouse)

## 🔧 開發命令

```bash
npm run dev          # 啟動開發服務器
npm run build        # 建立生產版本
npm run start        # 啟動生產服務器
npm run lint         # ESLint 檢查
npm run type-check   # TypeScript 類型檢查
```

## 📝 待辦事項

- [ ] 快訊詳情頁面開發
- [ ] 分類頁面實現
- [ ] Sitemap 生成功能
- [ ] Redis 快取整合
- [ ] Webhook 處理機制
- [ ] 單元測試撰寫
- [ ] 性能監控設置

## 🤝 貢獻指南

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 許可證

此專案為 Kripto Saat 私有專案。

## 📞 聯絡資訊

- **專案**: Kripto Saat Flash System
- **網站**: https://kriptosaat.com
- **技術支援**: 請通過 GitHub Issues 回報問題

---

Built with ❤️ by Kripto Saat Team
