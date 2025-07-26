#!/bin/bash

echo "🚀 Starting Frontend-only deployment..."

# 构建前端
echo "🔨 Building frontend for production..."
NODE_ENV=production npm run build

# 检查构建结果
if [ ! -d "dist" ]; then
    echo "❌ Build failed. dist directory not found."
    exit 1
fi

# 部署前端到IC主网
echo "🌐 Deploying frontend to Internet Computer mainnet..."
dfx deploy dawnpick_frontend --network ic --with-cycles 1000000000000

if [ $? -eq 0 ]; then
    echo "✅ Frontend deployment successful!"
    echo "🌐 Frontend URL: https://$(dfx canister id dawnpick_frontend --network ic).ic0.app"
else
    echo "❌ Frontend deployment failed!"
    exit 1
fi

echo "🎉 Frontend deployment completed!"