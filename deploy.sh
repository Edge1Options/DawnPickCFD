#!/bin/bash

# DawnPick CFD 部署脚本
echo "🚀 Starting DawnPick CFD deployment..."

# 检查 dfx 是否安装
if ! command -v dfx &> /dev/null; then
    echo "❌ dfx is not installed. Please install dfx first."
    echo "Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/"
    exit 1
fi

# 检查 Node.js 和 npm
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# 安装依赖
echo "📦 Installing dependencies..."
npm install

# 构建前端
echo "🔨 Building frontend..."
npm run build

# 检查构建结果
if [ ! -d "dist" ]; then
    echo "❌ Build failed. dist directory not found."
    exit 1
fi

# 启动本地 dfx
echo "🔧 Starting local dfx..."
dfx start --background --clean

# 等待 dfx 启动
sleep 5

# 部署到本地网络
echo "🚀 Deploying to local network..."
dfx deploy --network local

if [ $? -eq 0 ]; then
    echo "✅ Local deployment successful!"
    echo "📱 Frontend URL: http://localhost:8000/?canisterId=$(dfx canister id dawnpick_frontend --network local)"
    echo "🔗 Backend Canister ID: $(dfx canister id dawnpick_backend --network local)"
else
    echo "❌ Local deployment failed!"
    exit 1
fi

echo "🎉 Deployment completed!"