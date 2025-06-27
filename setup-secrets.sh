#!/bin/bash

# Kripto Saat - Google Secret Manager 設置腳本
# 此腳本會幫您設置所有敏感的環境變數到 Secret Manager

set -e

echo "🔐 Kripto Saat 敏感資訊設置開始..."
echo "📋 此腳本將引導您設置以下 Secrets："
echo "   1. Strapi API Token"
echo "   2. Strapi Admin Token" 
echo "   3. Redis Password"
echo "   4. Cloudflare Token"
echo "   5. JWT Secrets"
echo ""

# 檢查是否已登入 Google Cloud
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ 請先登入 Google Cloud: gcloud auth login"
    exit 1
fi

# 確認專案
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
echo "📍 當前專案: $PROJECT_ID"
read -p "是否正確？(y/n): " confirm
if [[ $confirm != "y" ]]; then
    echo "請先設置正確的專案: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo ""
echo "🔑 開始建立 Secrets..."

# 1. Strapi API Token
echo ""
echo "1️⃣ 設置 Strapi API Token"
echo "   這是前端存取 Strapi API 用的 token"
read -s -p "請輸入 Strapi API Token: " STRAPI_API_TOKEN
echo ""
if [[ -n "$STRAPI_API_TOKEN" ]]; then
    echo "$STRAPI_API_TOKEN" | gcloud secrets create strapi-api-token --data-file=- 2>/dev/null || \
    echo "$STRAPI_API_TOKEN" | gcloud secrets versions add strapi-api-token --data-file=-
    echo "✅ strapi-api-token 設置完成"
else
    echo "⚠️  跳過 Strapi API Token"
fi

# 2. Strapi Admin Token
echo ""
echo "2️⃣ 設置 Strapi Admin Token"
echo "   這是管理員級別的 token，用於數據同步"
read -s -p "請輸入 Strapi Admin Token: " STRAPI_ADMIN_TOKEN
echo ""
if [[ -n "$STRAPI_ADMIN_TOKEN" ]]; then
    echo "$STRAPI_ADMIN_TOKEN" | gcloud secrets create strapi-admin-token --data-file=- 2>/dev/null || \
    echo "$STRAPI_ADMIN_TOKEN" | gcloud secrets versions add strapi-admin-token --data-file=-
    echo "✅ strapi-admin-token 設置完成"
else
    echo "⚠️  跳過 Strapi Admin Token"
fi

# 3. Redis Password
echo ""
echo "3️⃣ 設置 Redis Password"
echo "   用於快取服務的 Redis 密碼"
read -s -p "請輸入 Redis Password (如無密碼請直接按 Enter): " REDIS_PASSWORD
echo ""
if [[ -n "$REDIS_PASSWORD" ]]; then
    echo "$REDIS_PASSWORD" | gcloud secrets create redis-password --data-file=- 2>/dev/null || \
    echo "$REDIS_PASSWORD" | gcloud secrets versions add redis-password --data-file=-
    echo "✅ redis-password 設置完成"
else
    echo "⚠️  跳過 Redis Password"
fi

# 4. Cloudflare Token
echo ""
echo "4️⃣ 設置 Cloudflare Token"
echo "   用於 CDN 和快取管理"
read -s -p "請輸入 Cloudflare Token (可選): " CLOUDFLARE_TOKEN
echo ""
if [[ -n "$CLOUDFLARE_TOKEN" ]]; then
    echo "$CLOUDFLARE_TOKEN" | gcloud secrets create cloudflare-token --data-file=- 2>/dev/null || \
    echo "$CLOUDFLARE_TOKEN" | gcloud secrets versions add cloudflare-token --data-file=-
    echo "✅ cloudflare-token 設置完成"
else
    echo "⚠️  跳過 Cloudflare Token"
fi

# 5. JWT Secret
echo ""
echo "5️⃣ 設置 JWT Secret"
echo "   用於 JWT token 簽名"
read -s -p "請輸入 JWT Secret (可選): " JWT_SECRET
echo ""
if [[ -n "$JWT_SECRET" ]]; then
    echo "$JWT_SECRET" | gcloud secrets create jwt-secret --data-file=- 2>/dev/null || \
    echo "$JWT_SECRET" | gcloud secrets versions add jwt-secret --data-file=-
    echo "✅ jwt-secret 設置完成"
else
    echo "⚠️  跳過 JWT Secret"
fi

echo ""
echo "🎉 Secret Manager 設置完成！"
echo ""
echo "📋 已建立的 Secrets："
gcloud secrets list --filter="name:strapi OR name:redis OR name:cloudflare OR name:jwt"

echo ""
echo "🔗 下一步："
echo "   1. 執行 ./deploy-with-secrets.sh 進行部署"
echo "   2. 或手動部署: gcloud run deploy --set-secrets ..."
echo ""
echo "💡 提醒："
echo "   - Secrets 會產生少量費用 (~$0.06/月/secret)"
echo "   - 您可以隨時更新 Secret 版本"
echo "   - 使用 'gcloud secrets versions add SECRET_NAME --data-file=-' 更新" 