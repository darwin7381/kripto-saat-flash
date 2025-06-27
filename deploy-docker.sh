#!/bin/bash

# Kripto Saat Flash - Docker 快速部署腳本
# 版本：2.0
# 最後更新：2025年1月

set -e  # 遇到錯誤立即退出

echo "🚀 Kripto Saat Flash - Docker 快速部署開始..."
echo "📍 當前目錄：$(pwd)"
echo "⏰ 開始時間：$(date)"
echo ""

# 檢查必要工具
echo "🔍 檢查必要工具..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安裝或未運行"
    exit 1
fi

if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI 未安裝"
    exit 1
fi

# 檢查 Google Cloud 認證
echo "🔐 檢查 Google Cloud 認證..."
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ 未登入 Google Cloud，請執行：gcloud auth login"
    exit 1
fi

# 檢查專案設置
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ "$PROJECT_ID" != "kripto-saat" ]; then
    echo "⚠️  當前專案：$PROJECT_ID"
    echo "🔄 切換到正確專案..."
    gcloud config set project kripto-saat
fi

echo "✅ 環境檢查完成"
echo ""

# 設置變數
IMAGE_NAME="gcr.io/kripto-saat/kripto-saat-flash"
TAG="latest"
REGION="europe-west1"
SERVICE_NAME="kripto-saat-flash"

echo "📋 部署配置："
echo "   映像名稱：$IMAGE_NAME:$TAG"
echo "   部署區域：$REGION"
echo "   服務名稱：$SERVICE_NAME"
echo ""

# 建構 Docker 映像
echo "📦 建構 Docker 映像..."
START_BUILD=$(date +%s)

docker build --platform linux/amd64 -t $IMAGE_NAME:$TAG .

if [ $? -ne 0 ]; then
    echo "❌ Docker 建構失敗"
    exit 1
fi

END_BUILD=$(date +%s)
BUILD_TIME=$((END_BUILD - START_BUILD))
echo "✅ 映像建構完成（耗時：${BUILD_TIME}秒）"
echo ""

# 推送映像到 GCR
echo "⬆️  推送映像到 Google Container Registry..."
START_PUSH=$(date +%s)

docker push $IMAGE_NAME:$TAG

if [ $? -ne 0 ]; then
    echo "❌ 映像推送失敗"
    exit 1
fi

END_PUSH=$(date +%s)
PUSH_TIME=$((END_PUSH - START_PUSH))
echo "✅ 映像推送完成（耗時：${PUSH_TIME}秒）"
echo ""

# 部署到 Cloud Run
echo "🚀 部署到 Cloud Run..."
START_DEPLOY=$(date +%s)

gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME:$TAG \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \

  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars USE_MOCK_DATA=true \
  --quiet

if [ $? -eq 0 ]; then
    END_DEPLOY=$(date +%s)
    DEPLOY_TIME=$((END_DEPLOY - START_DEPLOY))
    TOTAL_TIME=$((END_DEPLOY - START_BUILD))
    
    echo ""
    echo "🎉 部署成功完成！"
    echo ""
    echo "📊 部署統計："
    echo "   建構時間：${BUILD_TIME}秒"
    echo "   推送時間：${PUSH_TIME}秒"
    echo "   部署時間：${DEPLOY_TIME}秒"
    echo "   總計時間：${TOTAL_TIME}秒"
    echo ""
    echo "🌐 服務資訊："
    echo "   服務 URL：https://kripto-saat-flash-4614722018.europe-west1.run.app"
    echo "   管理控制台：https://console.cloud.google.com/run/detail/europe-west1/kripto-saat-flash"
    echo ""
    echo "🔗 快速測試："
    echo "   curl -I https://kripto-saat-flash-4614722018.europe-west1.run.app/flash"
    echo ""
    echo "✅ 部署完成時間：$(date)"
else
    echo "❌ 部署失敗"
    exit 1
fi 