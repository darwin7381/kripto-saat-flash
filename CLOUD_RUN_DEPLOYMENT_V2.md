# Kripto Saat Flash - Cloud Run 部署指南 V2.1

## 📋 概述

本文件記錄了 Kripto Saat Flash Next.js 應用的三種 Cloud Run 部署方式，包括最新的**混合安全部署方式**，提供企業級安全性和最佳實踐。

## 🚀 部署方式對比

### 方式一：源碼直接部署（原方法）
```bash
gcloud run deploy kripto-saat-flash \
  --source . \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10
```

**優點：**
- ✅ 配置簡單，一條命令完成
- ✅ 自動處理依賴和建構
- ✅ 功能穩定可靠

**缺點：**
- ❌ 部署時間長（4分14秒）
- ❌ 每次都需要重新建構
- ❌ 資源消耗大

### 方式二：Docker 映像部署（快速方法）
```bash
# 使用部署腳本
./deploy-docker.sh
```

**優點：**
- ✅ 部署速度極快（16秒）
- ✅ 可重複使用映像
- ✅ 版本控制更好
- ✅ 適合 CI/CD 流程

**缺點：**
- ❌ 安全性基本
- ❌ 敏感資訊管理困難

### 方式三：混合安全部署（推薦方法）⭐
```bash
# 1. 一次性設置
cp env-production.yaml.example env-production.yaml
vim env-production.yaml  # 編輯非敏感配置
./setup-secrets.sh       # 設置敏感資訊到 Secret Manager

# 2. 日常部署
./deploy-with-secrets.sh
```

**優點：**
- ✅ **企業級安全性**：使用 Google Secret Manager
- ✅ **配置分離**：非敏感配置版本控制，敏感資訊雲端加密
- ✅ **團隊協作友好**：新成員只需設置一次 secrets
- ✅ **成本優化**：只為敏感資訊付費 (~$0.30/月)
- ✅ **審計日誌**：完整的存取記錄
- ✅ **版本管理**：支援 secret 版本控制和回滾

**適用場景：**
- 🎯 **生產環境** - 強烈推薦
- 🎯 **企業級專案** - 符合合規要求
- 🎯 **團隊協作** - 安全且便利

## 📊 性能與安全性對比

| 指標 | 源碼部署 | Docker 部署 | 混合安全部署 ⭐ |
|------|----------|-------------|---------------|
| 部署時間 | 4分14秒 | 16秒 | 18秒 |
| 速度提升 | 基準 | 15.75倍 | 14倍 |
| 安全性等級 | 🟡 基本 | 🟡 基本 | 🟢 **企業級** |
| 敏感資訊保護 | ❌ 無 | ❌ 無 | ✅ **Secret Manager** |
| 配置管理 | 🟡 基本 | 🟡 基本 | ✅ **分層管理** |
| 團隊協作 | 🟡 困難 | 🟡 困難 | ✅ **友好** |
| 生產適用性 | 🟡 適中 | 🟠 良好 | ✅ **優秀** |
| 合規要求 | ❌ 不符合 | ❌ 不符合 | ✅ **符合** |

## 🏗️ 架構配置要點

### 1. 區域選擇
```bash
# ✅ 正確：歐洲西部（最適合土耳其用戶）
--region europe-west1

# ❌ 錯誤：亞洲東部（延遲高）
--region asia-east1
```

### 2. 平台架構
```bash
# ✅ 必須指定 AMD64 架構（Cloud Run 要求）
docker build --platform linux/amd64
```

### 3. 資源配置
```bash
--memory 512Mi    # 記憶體：512MB（足夠）
--cpu 1          # CPU：1 vCPU
--min-instances 0 # 最小實例：0（節省成本）
--max-instances 10 # 最大實例：10（可擴展）
```

## 🚨 常見錯誤與解決方案

### 1. 架構不匹配錯誤
**問題：** 在 Apple Silicon Mac 上建構的映像無法在 Cloud Run 運行
```
Error: exec format error
```

**解決方案：**
```bash
# 強制指定 AMD64 架構
docker build --platform linux/amd64 -t your-image .
```

### 2. 區域選擇錯誤
**問題：** 部署到錯誤區域導致延遲高
```bash
# ❌ 錯誤示例
gcloud run deploy --region asia-east1
```

**解決方案：**
```bash
# ✅ 正確配置
gcloud run deploy --region europe-west1
```

### 3. Dockerfile 配置問題
**問題：** 缺少必要文件導致應用無法正常運行

**原始錯誤配置：**
```dockerfile
# ❌ 缺少 package.json
COPY --from=builder /app/.next/standalone ./
```

**修復後配置：**
```dockerfile
# ✅ 添加必要文件
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
```

### 4. ENV 語法警告
**問題：** 使用舊版 ENV 語法產生警告
```dockerfile
# ❌ 舊版語法
ENV NODE_ENV production
ENV PORT 3000
```

**修復：**
```dockerfile
# ✅ 新版語法
ENV NODE_ENV=production
ENV PORT=3000
```

### 5. 域名映射問題
**問題：** 嘗試重複創建已存在的域名映射
```
ERROR: Domain mapping already exists
```

**解決方案：**
```bash
# 檢查現有映射
gcloud beta run domain-mappings list --region europe-west1

# 如需更新，先刪除再重建
gcloud beta run domain-mappings delete flash.kriptosaat.com --region europe-west1
```

## 🔧 完整 Dockerfile

```dockerfile
# 使用官方 Node.js 18 Alpine 映像
FROM node:18-alpine AS base

# 安裝依賴
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 複製 package 文件
COPY package.json package-lock.json* ./
RUN npm ci --only=production --no-audit --no-fund

# 建構應用
FROM base AS builder
WORKDIR /app

# 先複製 package 文件
COPY package.json package-lock.json* ./
# 安裝所有依賴（包括開發依賴）
RUN npm ci --no-audit --no-fund

# 複製源碼
COPY . .

# 設置環境變數
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# 建構 Next.js 應用
RUN npm run build

# 生產映像
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 創建非 root 用戶
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 複製建構結果
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 複製必要的配置文件
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

# 暴露端口
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 啟動應用
CMD ["node", "server.js"]
```

## 🎯 最佳實踐

### 1. 開發流程建議
```bash
# 本地測試
npm run build
npm start

# Docker 測試
docker build --platform linux/amd64 -t test-image .
docker run -p 3000:3000 test-image

# 部署到 Cloud Run
./deploy-docker.sh
```

### 2. 版本管理
```bash
# 使用標籤管理版本
docker build --platform linux/amd64 -t gcr.io/kripto-saat/kripto-saat-flash:v1.0.0 .
docker build --platform linux/amd64 -t gcr.io/kripto-saat/kripto-saat-flash:latest .
```

### 3. 監控和日誌
```bash
# 查看服務狀態
gcloud run services describe kripto-saat-flash --region europe-west1

# 查看日誌
gcloud logs read "resource.type=cloud_run_revision" --limit=50
```

## 🚀 快速部署腳本

創建 `deploy-docker.sh`：
```bash
#!/bin/bash

echo "🚀 開始 Docker 快速部署..."

# 建構映像
echo "📦 建構 Docker 映像..."
docker build --platform linux/amd64 -t gcr.io/kripto-saat/kripto-saat-flash:latest .

if [ $? -ne 0 ]; then
    echo "❌ Docker 建構失敗"
    exit 1
fi

# 推送映像
echo "⬆️ 推送映像到 GCR..."
docker push gcr.io/kripto-saat/kripto-saat-flash:latest

if [ $? -ne 0 ]; then
    echo "❌ 映像推送失敗"
    exit 1
fi

# 部署服務
echo "🚀 部署到 Cloud Run..."
gcloud run deploy kripto-saat-flash \
  --image gcr.io/kripto-saat/kripto-saat-flash:latest \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10

if [ $? -eq 0 ]; then
    echo "✅ 部署成功！"
    echo "🌐 服務 URL: https://kripto-saat-flash-4614722018.europe-west1.run.app"
else
    echo "❌ 部署失敗"
    exit 1
fi
```

## 📝 部署檢查清單

### 部署前檢查
- [ ] 確認在正確目錄：`kripto-saat-flash/`
- [ ] 檢查 Docker 是否運行
- [ ] 確認 Google Cloud 認證
- [ ] 驗證專案 ID：`kripto-saat`

### 部署後驗證
- [ ] 檢查服務狀態：`gcloud run services list`
- [ ] 測試 URL 訪問：`curl -I [SERVICE_URL]/flash`
- [ ] 驗證功能完整性
- [ ] 檢查日誌無錯誤

## 🔄 故障排除

### 1. 服務無法啟動
```bash
# 檢查日誌
gcloud logs read "resource.type=cloud_run_revision" --limit=20

# 檢查映像
docker run -p 3000:3000 gcr.io/kripto-saat/kripto-saat-flash:latest
```

### 2. 404 錯誤
- 檢查路由配置
- 驗證 Next.js 建構結果
- 確認 `package.json` 是否正確複製

### 3. 記憶體不足
```bash
# 增加記憶體配置
gcloud run services update kripto-saat-flash \
  --memory 1Gi \
  --region europe-west1
```

## 📈 未來優化建議

1. **CI/CD 整合**：整合到 GitHub Actions
2. **多環境部署**：開發、測試、生產環境分離
3. **監控告警**：設置 Cloud Monitoring 告警
4. **備份策略**：定期備份映像和配置
5. **安全加固**：實施最小權限原則

## 🚀 快速部署指南

### 推薦工作流程
```bash
# 1. 一次性設置（新專案）
cp env-production.yaml.example env-production.yaml
vim env-production.yaml  # 編輯域名、URL等
./setup-secrets.sh       # 設置 Strapi tokens 等敏感資訊

# 2. 日常部署
./deploy-with-secrets.sh  # 企業級安全部署

# 3. 緊急部署（備用）
./deploy-docker.sh        # 快速部署
```

### 檔案管理
```bash
# ✅ 安全的檔案結構
kripto-saat-flash/
├── env-production.yaml.example  # 版本控制 ✅
├── env-production.yaml          # 本地配置 🚫 不進 Git
├── deploy-with-secrets.sh       # 主要部署腳本
├── deploy-docker.sh             # 備用部署腳本
└── setup-secrets.sh             # Secret 設置腳本
```

## ⚠️ 重要安全提醒

### 🔐 環境變數安全
- ✅ `env-production.yaml` 已加入 `.gitignore`
- ✅ 敏感資訊使用 Secret Manager 加密
- ✅ 非敏感配置可版本控制
- ❌ **絕對不要**將 tokens 直接寫在腳本中裡面

### 👥 團隊協作
- 新成員只需執行 `./setup-secrets.sh` 一次
- 配置更新使用 `cp env-production.yaml.example env-production.yaml`
- 敏感資訊統一由 Secret Manager 管理

---

**最後更新：** 2025年1月27日
**版本：** 2.1
**狀態：** ✅ 企業級安全，生產就緒 