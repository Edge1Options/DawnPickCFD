#!/bin/bash

# DawnPick CFD 生产环境部署脚本
echo "🚀 Starting DawnPick CFD production deployment..."

# 检查是否有足够的 cycles
echo "💰 Checking wallet balance..."
dfx wallet balance --network ic

read -p "Do you want to continue with production deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled."
    exit 1
fi

# 安装依赖
echo "📦 Installing dependencies..."
npm install

# 构建前端（生产模式）
echo "🔨 Building frontend for production..."
NODE_ENV=production npm run build

# 检查构建结果
if [ ! -d "dist" ]; then
    echo "❌ Build failed. dist directory not found."
    exit 1
fi

# 部署到 IC 主网
echo "🌐 Deploying to Internet Computer mainnet..."
dfx deploy --network ic --with-cycles 1000000000000

if [ $? -eq 0 ]; then
    echo "✅ Production deployment successful!"
    echo "🌐 Frontend URL: https://$(dfx canister id dawnpick_frontend --network ic).ic0.app"
    echo "🔗 Backend Canister ID: $(dfx canister id dawnpick_backend --network ic)"
    echo "📊 Check status: dfx canister status --all --network ic"
else
    echo "❌ Production deployment failed!"
    exit 1
fi

echo "🎉 Production deployment completed!"