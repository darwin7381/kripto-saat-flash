#!/bin/bash

# Kripto Saat Flash - 混合方式部署腳本
# 使用 Secret Manager + 環境變數檔案 + 直接環境變數

set -e

echo "🚀 Kripto Saat Flash - 混合方式部署開始..."
echo "📍 當前目錄：$(pwd)"
echo "⏰ 開始時間：$(date)"
echo ""

# 檢查必要檔案
if [[ ! -f "env-production.yaml" ]]; then
    echo "❌ 找不到 env-production.yaml 檔案"
    echo "💡 請先編輯 env-production.yaml 並設置正確的配置值"
    exit 1
fi

# 檢查必要工具
echo "🔍 檢查必要工具..."
for tool in docker gcloud; do
    if ! command -v $tool &> /dev/null; then
        echo "❌ $tool 未安裝或未在 PATH 中"
        exit 1
    fi
done

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
echo "   配置檔案：env-production.yaml"
echo ""

# 檢查可用的 Secrets
echo "🔍 檢查 Secret Manager 中的 Secrets..."
AVAILABLE_SECRETS=""
SECRETS_ARGS=""

# 檢查各個 secret 是否存在
for secret in strapi-api-token strapi-admin-token redis-password cloudflare-token jwt-secret; do
    if gcloud secrets describe "$secret" &>/dev/null; then
        echo "   ✅ $secret"
        AVAILABLE_SECRETS="$AVAILABLE_SECRETS $secret"
        
        # 根據 secret 名稱設置對應的環境變數
        case $secret in
            "strapi-api-token")
                SECRETS_ARGS="$SECRETS_ARGS,STRAPI_API_TOKEN=$secret:latest"
                ;;
            "strapi-admin-token")
                SECRETS_ARGS="$SECRETS_ARGS,STRAPI_ADMIN_TOKEN=$secret:latest"
                ;;
            "redis-password")
                SECRETS_ARGS="$SECRETS_ARGS,REDIS_PASSWORD=$secret:latest"
                ;;
            "cloudflare-token")
                SECRETS_ARGS="$SECRETS_ARGS,CLOUDFLARE_TOKEN=$secret:latest"
                ;;
            "jwt-secret")
                SECRETS_ARGS="$SECRETS_ARGS,JWT_SECRET=$secret:latest"
                ;;
        esac
    else
        echo "   ⚠️  $secret (未設置)"
    fi
done

# 移除開頭的逗號
SECRETS_ARGS=${SECRETS_ARGS#,}

if [[ -z "$AVAILABLE_SECRETS" ]]; then
    echo ""
    echo "⚠️  沒有找到任何 Secrets"
    echo "💡 建議執行 ./setup-secrets.sh 設置敏感資訊"
    echo ""
    read -p "是否繼續部署？(y/n): " continue_deploy
    if [[ $continue_deploy != "y" ]]; then
        echo "❌ 部署已取消"
        exit 1
    fi
fi

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

# 構建部署命令
echo "🚀 部署到 Cloud Run..."
START_DEPLOY=$(date +%s)

DEPLOY_CMD="gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME:$TAG \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --env-vars-file env-production.yaml"

# 如果有 Secrets，添加到部署命令
if [[ -n "$SECRETS_ARGS" ]]; then
    DEPLOY_CMD="$DEPLOY_CMD --set-secrets \"$SECRETS_ARGS\""
fi

DEPLOY_CMD="$DEPLOY_CMD --quiet"

echo "📋 執行部署命令："
echo "   環境變數檔案：env-production.yaml"
if [[ -n "$SECRETS_ARGS" ]]; then
    echo "   Secret Manager：$AVAILABLE_SECRETS"
else
    echo "   Secret Manager：無"
fi
echo ""

# 執行部署
eval $DEPLOY_CMD

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
    echo "🔐 安全資訊："
    echo "   配置檔案：env-production.yaml"
    if [[ -n "$AVAILABLE_SECRETS" ]]; then
        echo "   使用 Secrets：$AVAILABLE_SECRETS"
    else
        echo "   使用 Secrets：無"
    fi
    echo ""
    echo "🔗 快速測試："
    echo "   curl -I https://kripto-saat-flash-4614722018.europe-west1.run.app/flash"
    echo ""
    echo "✅ 部署完成時間：$(date)"
else
    echo "❌ 部署失敗"
    exit 1
fi 