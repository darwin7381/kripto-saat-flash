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
ENV HOSTNAME="0.0.0.0"

# 啟動應用
CMD ["node", "server.js"] 