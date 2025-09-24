#!/bin/bash

# DawnPick CFD 部署更新脚本
# 专门用于更新已有的部署

set -e

info() { echo -e "\033[0;34mℹ️  $1\033[0m"; }
success() { echo -e "\033[0;32m✅ $1\033[0m"; }
warning() { echo -e "\033[1;33m⚠️  $1\033[0m"; }
error() { echo -e "\033[0;31m❌ $1\033[0m"; }

echo "🔄 DawnPick CFD 部署更新"
echo "====================="

# 检查是否有现有部署
if ! EXISTING=$(dfx canister id dawnpick_frontend --network ic 2>/dev/null); then
    error "未找到现有部署，请先运行首次部署"
    exit 1
fi

info "现有部署: $EXISTING"
info "URL: https://$EXISTING.ic0.app"

# 检查钱包余额
if BALANCE=$(dfx wallet balance --network ic 2>/dev/null); then
    info "钱包余额: $BALANCE"
else
    warning "无法获取钱包余额"
fi

# 询问更新类型
echo
echo "选择更新类型:"
echo "1) 快速更新 (仅重新部署，不重新构建)"
echo "2) 完整更新 (重新构建并部署)"
echo "3) 强制更新 (清理缓存后重新构建并部署)"
read -p "请选择 (1/2/3): " -n 1 -r
echo

case $REPLY in
    1)
        info "执行快速更新..."
        if [ ! -d "dist" ]; then
            error "未找到构建文件，请选择完整更新"
            exit 1
        fi
        ;;
    2)
        info "执行完整更新..."
        NODE_ENV=production REACT_APP_DFX_NETWORK=ic npm run build
        ;;
    3)
        info "执行强制更新..."
        rm -rf dist node_modules/.cache
        npm ci
        NODE_ENV=production REACT_APP_DFX_NETWORK=ic npm run build
        ;;
    *)
        info "默认执行完整更新..."
        NODE_ENV=production REACT_APP_DFX_NETWORK=ic npm run build
        ;;
esac

# 执行部署更新
info "更新部署..."
dfx deploy dawnpick_frontend --network ic --with-cycles 500000000000

success "更新完成!"
echo "🌐 访问地址: https://$EXISTING.ic0.app"

# 显示状态
info "Canister 状态:"
dfx canister status dawnpick_frontend --network ic