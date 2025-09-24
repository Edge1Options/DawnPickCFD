#!/bin/bash

# DawnPick CFD 前端部署到 ICP 主网脚本
# 作者: DawnPick Team
# 版本: 2.0

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_step() {
    echo -e "${PURPLE}🔄 $1${NC}"
}

# 检查必要工具
check_prerequisites() {
    log_step "检查部署环境..."
    
    # 检查 dfx
    if ! command -v dfx &> /dev/null; then
        log_error "dfx 未安装。请先安装 dfx。"
        log_info "访问: https://internetcomputer.org/docs/current/developer-docs/setup/install/"
        exit 1
    fi
    
    # 检查 dfx 版本
    DFX_VERSION=$(dfx --version | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')
    log_info "dfx 版本: $DFX_VERSION"
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装。请先安装 Node.js。"
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    log_info "Node.js 版本: $NODE_VERSION"
    
    # 检查 npm
    if ! command -v npm &> /dev/null; then
        log_error "npm 未安装。请先安装 npm。"
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    log_info "npm 版本: $NPM_VERSION"
    
    log_success "环境检查完成"
}

# 检查网络连接
check_network() {
    log_step "检查网络连接..."
    
    if ! ping -c 1 ic0.app &> /dev/null; then
        log_error "无法连接到 Internet Computer 网络"
        exit 1
    fi
    
    log_success "网络连接正常"
}

# 检查身份和钱包
check_identity() {
    log_step "检查 dfx 身份和钱包..."
    
    # 检查当前身份
    CURRENT_IDENTITY=$(dfx identity whoami)
    log_info "当前身份: $CURRENT_IDENTITY"
    
    # 检查钱包余额
    log_step "检查钱包余额..."
    if ! dfx wallet balance --network ic &> /dev/null; then
        log_warning "无法获取钱包余额，可能需要设置钱包"
        log_info "请运行: dfx identity deploy-wallet --network ic"
        read -p "是否继续部署? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_error "部署已取消"
            exit 1
        fi
    else
        WALLET_BALANCE=$(dfx wallet balance --network ic)
        log_info "钱包余额: $WALLET_BALANCE"
        
        # 检查余额是否足够（至少需要 1T cycles）
        BALANCE_CYCLES=$(echo $WALLET_BALANCE | grep -o '[0-9,]\+' | tr -d ',')
        if [ "$BALANCE_CYCLES" -lt 1000000000000 ]; then
            log_warning "钱包余额可能不足，建议至少有 1T cycles"
            read -p "是否继续部署? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                log_error "部署已取消"
                exit 1
            fi
        fi
    fi
}

# 安装依赖
install_dependencies() {
    log_step "安装项目依赖..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    log_success "依赖安装完成"
}

# 构建前端
build_frontend() {
    log_step "构建前端应用..."
    
    # 设置生产环境变量
    export NODE_ENV=production
    export REACT_APP_DFX_NETWORK=ic
    export REACT_APP_IC_HOST=https://ic0.app
    export REACT_APP_ENABLE_MOCK_DATA=false
    export REACT_APP_ENABLE_REAL_TRADING=true
    
    # 清理之前的构建
    if [ -d "dist" ]; then
        rm -rf dist
        log_info "清理旧的构建文件"
    fi
    
    # 构建
    npm run build
    
    # 检查构建结果
    if [ ! -d "dist" ]; then
        log_error "构建失败，dist 目录未找到"
        exit 1
    fi
    
    # 检查构建文件大小
    BUILD_SIZE=$(du -sh dist | cut -f1)
    log_info "构建大小: $BUILD_SIZE"
    
    log_success "前端构建完成"
}

# 部署前端到 IC
deploy_frontend() {
    log_step "部署前端到 Internet Computer..."
    
    # 获取当前 canister ID（如果存在）
    if [ -f ".dfx/ic/canister_ids.json" ]; then
        EXISTING_CANISTER=$(cat .dfx/ic/canister_ids.json | grep -o '"dawnpick_frontend":{"ic":"[^"]*"' | cut -d'"' -f6)
        if [ ! -z "$EXISTING_CANISTER" ]; then
            log_info "现有前端 Canister ID: $EXISTING_CANISTER"
        fi
    fi
    
    # 部署前端 canister
    dfx deploy dawnpick_frontend --network ic --with-cycles 2000000000000
    
    if [ $? -eq 0 ]; then
        FRONTEND_CANISTER_ID=$(dfx canister id dawnpick_frontend --network ic)
        FRONTEND_URL="https://${FRONTEND_CANISTER_ID}.ic0.app"
        
        log_success "前端部署成功!"
        echo
        log_info "🌐 前端访问地址: $FRONTEND_URL"
        log_info "🆔 Canister ID: $FRONTEND_CANISTER_ID"
        
        # 检查 canister 状态
        log_step "检查 canister 状态..."
        dfx canister status dawnpick_frontend --network ic
        
        return 0
    else
        log_error "前端部署失败!"
        return 1
    fi
}

# 部署后验证
post_deploy_verification() {
    log_step "部署后验证..."
    
    FRONTEND_CANISTER_ID=$(dfx canister id dawnpick_frontend --network ic)
    FRONTEND_URL="https://${FRONTEND_CANISTER_ID}.ic0.app"
    
    # 检查网站是否可访问
    log_info "检查网站可访问性..."
    if curl -s --head "$FRONTEND_URL" | head -n 1 | grep -q "200 OK"; then
        log_success "网站可正常访问"
    else
        log_warning "网站可能需要几分钟才能完全生效"
    fi
    
    # 显示有用的命令
    echo
    log_info "📋 有用的命令:"
    echo "  查看 canister 状态: dfx canister status dawnpick_frontend --network ic"
    echo "  查看 canister 日志: dfx canister logs dawnpick_frontend --network ic"
    echo "  更新前端: dfx deploy dawnpick_frontend --network ic"
    echo "  删除 canister: dfx canister delete dawnpick_frontend --network ic"
}

# 主函数
main() {
    echo -e "${CYAN}"
    echo "🚀 DawnPick CFD 前端部署到 ICP 主网"
    echo "=================================="
    echo -e "${NC}"
    
    # 确认部署
    log_warning "即将部署到 Internet Computer 主网"
    log_info "这将消耗真实的 cycles"
    read -p "确认继续? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_error "部署已取消"
        exit 1
    fi
    
    # 执行部署步骤
    check_prerequisites
    check_network
    check_identity
    install_dependencies
    build_frontend
    
    if deploy_frontend; then
        post_deploy_verification
        echo
        log_success "🎉 前端部署完成!"
        echo
        FRONTEND_CANISTER_ID=$(dfx canister id dawnpick_frontend --network ic)
        echo -e "${GREEN}🌐 访问你的应用: https://${FRONTEND_CANISTER_ID}.ic0.app${NC}"
    else
        log_error "部署失败，请检查错误信息"
        exit 1
    fi
}

# 捕获中断信号
trap 'log_error "部署被中断"; exit 1' INT TERM

# 运行主函数
main "$@"