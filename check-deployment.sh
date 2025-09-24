#!/bin/bash

# 部署状态检查脚本

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

echo "🔍 DawnPick CFD 部署状态检查"
echo "=========================="

# 检查 canister 状态
log_info "检查 canister 状态..."
dfx canister status --all --network ic

echo
log_info "获取 canister ID..."
FRONTEND_ID=$(dfx canister id dawnpick_frontend --network ic 2>/dev/null || echo "未部署")
BACKEND_ID=$(dfx canister id dawnpick_backend --network ic 2>/dev/null || echo "未部署")

echo "前端 Canister ID: $FRONTEND_ID"
echo "后端 Canister ID: $BACKEND_ID"

if [ "$FRONTEND_ID" != "未部署" ]; then
    FRONTEND_URL="https://${FRONTEND_ID}.ic0.app"
    echo "前端访问地址: $FRONTEND_URL"
    
    # 检查网站可访问性
    log_info "检查前端可访问性..."
    if curl -s --head "$FRONTEND_URL" | head -n 1 | grep -q "200 OK"; then
        log_success "前端网站可正常访问"
    else
        log_warning "前端网站可能还在启动中"
    fi
fi

echo
log_info "钱包余额:"
dfx wallet balance --network ic

echo
log_success "状态检查完成"