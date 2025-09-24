#!/bin/bash

# DawnPick CFD 快速部署脚本 (一键部署)
# 适用于已配置好环境的用户

set -e

# 简单的颜色输出
info() { echo -e "\033[0;34mℹ️  $1\033[0m"; }
success() { echo -e "\033[0;32m✅ $1\033[0m"; }
error() { echo -e "\033[0;31m❌ $1\033[0m"; }

echo "🚀 DawnPick CFD 一键快速部署"
echo "=========================="

# 显示当前身份
IDENTITY=$(dfx identity whoami)
info "当前身份: $IDENTITY"

# 检查是否有现有部署
if EXISTING=$(dfx canister id dawnpick_frontend --network ic 2>/dev/null); then
    info "更新现有部署: $EXISTING"
    CYCLES="500000000000"  # 更新用较少 cycles
else
    info "首次部署"
    CYCLES="2000000000000"  # 首次部署用更多 cycles
fi

# 快速构建和部署
info "构建应用..."
NODE_ENV=production REACT_APP_DFX_NETWORK=ic npm run build

info "部署到 IC..."
dfx deploy dawnpick_frontend --network ic --with-cycles $CYCLES

# 获取结果
CANISTER_ID=$(dfx canister id dawnpick_frontend --network ic)
URL="https://${CANISTER_ID}.ic0.app"

success "部署完成!"
echo "🌐 访问地址: $URL"
echo "🆔 Canister ID: $CANISTER_ID"

# 可选：自动打开浏览器 (如果在桌面环境)
if command -v xdg-open &> /dev/null; then
    read -p "是否在浏览器中打开? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        xdg-open "$URL"
    fi
fi