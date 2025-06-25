#!/bin/bash

# 快速部署腳本 - 使用本地 Docker 建構
set -e

PROJECT_ID="kripto-saat"
SERVICE_NAME="kripto-saat-flash"
REGION="europe-west1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 開始快速部署..."

# 1. 本地建構 Docker 鏡像
echo "📦 建構 Docker 鏡像..."
docker build -t $IMAGE_NAME .

# 2. 推送鏡像到 Google Container Registry
echo "📤 推送鏡像..."
docker push $IMAGE_NAME

# 3. 部署到 Cloud Run
echo "🌐 部署到 Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --concurrency 80 \
  --timeout 300 \
  --set-env-vars="USE_MOCK_DATA=true,NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1"

echo "✅ 部署完成！"
echo "🔗 服務 URL: https://$SERVICE_NAME-4614722018.$REGION.run.app" 