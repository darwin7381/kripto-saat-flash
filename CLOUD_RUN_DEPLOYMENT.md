# Kripto Saat Flash - Google Cloud Run 部署指南

## 📋 概述

本指南將協助您將 Kripto Saat Flash Next.js 應用部署到 Google Cloud Run，解決 Vercel 代理檢測問題。

## 💰 成本估算

基於預期流量（每月 100 萬次請求）：
- **CPU 成本**：約 $2.40/月
- **記憶體成本**：約 $0.25/月
- **請求成本**：前 200 萬次免費
- **總計**：約 $2.65-10/月（取決於實際使用量）

## 🚀 快速部署

### 前置需求

1. **Google Cloud 帳戶**
   - 前往 [Google Cloud Console](https://console.cloud.google.com/)
   - 創建新專案或選擇現有專案

2. **安裝 Google Cloud CLI**
   ```bash
   # macOS
   brew install --cask google-cloud-sdk
   
   # Windows
   # 下載並安裝：https://cloud.google.com/sdk/docs/install
   
   # Linux
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   ```

### 步驟 1：設置 Google Cloud

```bash
# 1. 登入 Google Cloud
gcloud auth login

# 2. 設置專案 ID（替換為您的專案 ID）
export PROJECT_ID="kripto-saat"
gcloud config set project $PROJECT_ID

# 3. 啟用必要的 API
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com

# 4. 設置預設區域（建議使用歐洲區域，最適合土耳其用戶）
gcloud config set run/region europe-west1
```

### 步驟 2：準備應用

```bash
# 1. 進入專案目錄
cd kripto-saat-flash

# 2. 確保所有依賴已安裝
npm install

# 3. 測試本地建構
npm run build
```

### 步驟 3：部署到 Cloud Run

#### 方法 A：直接從源碼部署（推薦新手）

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
  --max-instances 10 \
  --concurrency 80 \
  --timeout 300
```

#### 方法 B：使用 Docker 部署（推薦進階用戶）

```bash
# 1. 建構 Docker 映像
docker build -t gcr.io/$PROJECT_ID/kripto-saat-flash .

# 2. 推送映像到 Container Registry
docker push gcr.io/$PROJECT_ID/kripto-saat-flash

# 3. 部署到 Cloud Run
gcloud run deploy kripto-saat-flash \
  --image gcr.io/$PROJECT_ID/kripto-saat-flash \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10
```

### 步驟 4：設置自定義域名

```bash
# 1. 映射域名到 Cloud Run 服務
gcloud run domain-mappings create \
  --service kripto-saat-flash \
  --domain flash.kriptosaat.com \
  --region europe-west1

# 2. 記錄顯示的 DNS 記錄資訊
# 您需要在 Cloudflare 中添加這些 DNS 記錄
```

### 步驟 5：更新 DNS 設置

在 Cloudflare Dashboard 中：

1. **添加 CNAME 記錄**：
   ```
   Type: CNAME
   Name: flash
   Content: ghs.googlehosted.com
   Proxy status: DNS only (灰雲)
   ```

2. **或添加 A 記錄**（如果 Google 提供 IP）：
   ```
   Type: A
   Name: flash
   Content: [Google 提供的 IP 地址]
   Proxy status: DNS only (灰雲)
   ```

### 步驟 6：更新 Cloudflare Worker

修改 Worker 中的後端地址：

```javascript
// 舊的 Vercel 地址
// const FLASH_BACKEND = 'flash.kriptosaat.com';

// 新的 Cloud Run 地址（從部署輸出中獲取）
const FLASH_BACKEND = 'kripto-saat-flash-xxx-uc.a.run.app';

// 或者如果自定義域名已設置
const FLASH_BACKEND = 'flash.kriptosaat.com';
```

## 🔧 進階配置

### 環境變數設置

```bash
# 設置環境變數
gcloud run services update kripto-saat-flash \
  --set-env-vars="NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1" \
  --region europe-west1
```

### 自動擴展配置

```bash
# 調整自動擴展設置
gcloud run services update kripto-saat-flash \
  --min-instances=1 \
  --max-instances=20 \
  --concurrency=100 \
  --region europe-west1
```

### 記憶體和 CPU 調整

```bash
# 增加資源配置（如果需要）
gcloud run services update kripto-saat-flash \
  --memory=1Gi \
  --cpu=2 \
  --region europe-west1
```

## 📊 監控和日誌

### 查看服務狀態

```bash
# 列出所有 Cloud Run 服務
gcloud run services list

# 查看特定服務詳情
gcloud run services describe kripto-saat-flash --region europe-west1
```

### 查看日誌

```bash
# 即時查看日誌
gcloud logs tail "resource.type=cloud_run_revision AND resource.labels.service_name=kripto-saat-flash"

# 查看歷史日誌
gcloud logs read "resource.type=cloud_run_revision AND resource.labels.service_name=kripto-saat-flash" --limit=50
```

### 查看指標

前往 [Google Cloud Console](https://console.cloud.google.com/run) 查看：
- 請求數量
- 回應時間
- 錯誤率
- CPU 和記憶體使用率

## 🚨 故障排除

### 常見問題

1. **部署失敗**
   ```bash
   # 查看建構日誌
   gcloud builds list
   gcloud builds log [BUILD_ID]
   ```

2. **應用無法啟動**
   ```bash
   # 檢查服務日誌
   gcloud logs read "resource.type=cloud_run_revision" --limit=50
   ```

3. **域名無法訪問**
   - 確認 DNS 記錄已正確設置
   - 等待 DNS 傳播（最多 48 小時）
   - 檢查 SSL 憑證狀態

### 本地測試 Docker

```bash
# 本地建構和測試
docker build -t kripto-saat-flash .
docker run -p 3000:3000 kripto-saat-flash

# 訪問 http://localhost:3000 測試
```

## 🔄 CI/CD 自動部署

### 設置 GitHub Actions（可選）

創建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - id: 'auth'
      uses: 'google-github-actions/auth@v1'
      with:
        credentials_json: '${{ secrets.GCP_SA_KEY }}'
    
    - name: 'Set up Cloud SDK'
      uses: 'google-github-actions/setup-gcloud@v1'
    
    - name: 'Deploy to Cloud Run'
      run: |
        gcloud run deploy kripto-saat-flash \
          --source . \
          --region europe-west1 \
          --platform managed \
          --allow-unauthenticated
```

## 📝 部署檢查清單

- [ ] Google Cloud 專案已創建
- [ ] 必要的 API 已啟用
- [ ] 應用已成功部署到 Cloud Run
- [ ] 自定義域名已設置（如需要）
- [ ] DNS 記錄已更新
- [ ] Cloudflare Worker 已更新後端地址
- [ ] 應用可以正常訪問
- [ ] 監控和告警已設置

## 💡 優化建議

1. **啟用 CDN**：在 Cloudflare 中啟用代理（橙雲）
2. **設置快取**：配置適當的快取標頭
3. **監控成本**：設置預算告警
4. **備份策略**：定期備份配置和數據

## 📞 支援

如果遇到問題：
1. 查看 [Google Cloud Run 文檔](https://cloud.google.com/run/docs)
2. 檢查 [Cloud Run 故障排除指南](https://cloud.google.com/run/docs/troubleshooting)
3. 聯絡技術支援團隊

---

**注意**：首次部署可能需要 5-10 分鐘，請耐心等待。部署完成後，記得測試所有功能是否正常運作。 