#!/bin/bash

# 清除 Header 相關的 Cloudflare 快取
# 需要設置以下環境變數：
# CLOUDFLARE_ZONE_ID - 您的Cloudflare Zone ID
# CLOUDFLARE_API_TOKEN - 您的Cloudflare API Token

echo "🔄 開始清除 Header 相關快取..."

# 檢查必要的環境變數
if [ -z "$CLOUDFLARE_ZONE_ID" ] || [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "❌ 錯誤：需要設置 CLOUDFLARE_ZONE_ID 和 CLOUDFLARE_API_TOKEN 環境變數"
    echo ""
    echo "請先設置："
    echo "export CLOUDFLARE_ZONE_ID=your_zone_id"
    echo "export CLOUDFLARE_API_TOKEN=your_api_token"
    exit 1
fi

# 清除新版本的快取標籤
CACHE_TAGS='["header-config","header-v2","header-navigation-new","header-global","header-fallback"]'

echo "📤 清除快取標籤: $CACHE_TAGS"

# 調用 Cloudflare API
RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     -H "Content-Type: application/json" \
     --data "{\"tags\":$CACHE_TAGS}")

# 檢查回應
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "✅ 快取清除成功！"
    echo "📋 回應: $RESPONSE"
else
    echo "❌ 快取清除失敗！"
    echo "📋 回應: $RESPONSE"
    exit 1
fi

echo ""
echo "🎉 Header 快取清除完成！新版本導航應該會在幾分鐘內生效。"
echo ""
echo "您也可以使用以下方法清除："
echo "1. Cloudflare Dashboard → Caching → Purge Everything"
echo "2. 或者清除特定 URL：https://your-domain.com/api/header" 