#!/bin/bash

# DawnPick CFD 前端部署到 ICP 主网脚本 (已有账号用户版本)
# 作者: DawnPick Team
# 版本: 2.1 - 针对已有dfx账号用户优化

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
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_step() { echo -e "${PURPLE}🔄 $1${NC}"; }

# 快速环境检查（简化版）
quick_env_check() {
    log_step "快速环境检查..."
    
    # 检查 dfx
    if ! command -v dfx &> /dev/null; then
        log_error "dfx 未安装"
        exit 1
    fi
    
    # 检查 Node.js 和 npm
    if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
        log_error "Node.js 或 npm 未安装"
        exit 1
    fi
    
    log_success "环境检查完成"
}

# 检查现有部署状态
check_existing_deployment() {
    log_step "检查现有部署状态..."
    
    # 检查当前身份
    CURRENT_IDENTITY=$(dfx identity whoami)
    log_info "当前身份: $CURRENT_IDENTITY"
    
    # 检查是否已有部署的 canister
    if [ -f ".dfx/ic/canister_ids.json" ]; then
        log_info "发现现有部署配置"
        
        # 尝试获取现有的 canister ID
        if EXISTING_FRONTEND=$(dfx canister id dawnpick_frontend --network ic 2>/dev/null); then
            log_info "现有前端 Canister ID: $EXISTING_FRONTEND"
            log_info "现有前端 URL: https://$EXISTING_FRONTEND.ic0.app"
            
            # 询问是否更新现有部署
            echo
            log_warning "检测到已有部署，选择操作："
            echo "1) 更新现有部署 (推荐)"
            echo "2) 创建新的部署"
            echo "3) 取消部署"
            read -p "请选择 (1/2/3): " -n 1 -r
            echo
            
            case $REPLY in
                1)
                    DEPLOYMENT_MODE="update"
                    log_info "将更新现有部署"
                    ;;
                2)
                    DEPLOYMENT_MODE="new"
                    log_warning "将创建新的部署（会产生新的 Canister ID）"
                    ;;
                3)
                    log_error "部署已取消"
                    exit 1
                    ;;
                *)
                    log_info "默认选择更新现有部署"
                    DEPLOYMENT_MODE="update"
                    ;;
            esac
        else
            log_info "未找到现有的前端部署"
            DEPLOYMENT_MODE="new"
        fi
    else
        log_info "首次部署到此环境"
        DEPLOYMENT_MODE="new"
    fi
}

# 快速钱包检查
quick_wallet_check() {
    log_step "检查钱包状态..."
    
    if dfx wallet balance --network ic &> /dev/null; then
        WALLET_BALANCE=$(dfx wallet balance --network ic)
        log_info "钱包余额: $WALLET_BALANCE"
        
        # 简化的余额检查
        if echo "$WALLET_BALANCE" | grep -q "0.000"; then
            log_warning "钱包余额较低，可能需要充值"
            read -p "是否继续部署? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                log_error "部署已取消"
                exit 1
            fi
        fi
    else
        log_warning "无法获取钱包余额，但将继续部署"
    fi
}

# 智能依赖安装
smart_install_dependencies() {
    log_step "检查项目依赖..."
    
    # 检查 package-lock.json 的时间戳
    if [ -f "package-lock.json" ] && [ -d "node_modules" ]; then
        if [ "package.json" -nt "node_modules" ]; then
            log_info "检测到 package.json 更新，重新安装依赖"
            npm ci
        else
            log_info "依赖已是最新，跳过安装"
        fi
    else
        log_info "安装项目依赖..."
        if [ -f "package-lock.json" ]; then
            npm ci
        else
            npm install
        fi
    fi
    
    log_success "依赖检查完成"
}

# 优化的构建过程
optimized_build() {
    log_step "构建前端应用..."
    
    # 设置生产环境变量
    export NODE_ENV=production
    export REACT_APP_DFX_NETWORK=ic
    export REACT_APP_IC_HOST=https://ic0.app
    export REACT_APP_ENABLE_MOCK_DATA=false
    export REACT_APP_ENABLE_REAL_TRADING=true
    
    # 检查是否需要重新构建
    if [ -d "dist" ] && [ "src" -ot "dist" ] && [ "package.json" -ot "dist" ]; then
        log_info "检测到最新构建，跳过构建步骤"
        read -p "是否强制重新构建? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf dist
            npm run build
        fi
    else
        # 清理并构建
        [ -d "dist" ] && rm -rf dist
        npm run build
    fi
    
    # 检查构建结果
    if [ ! -d "dist" ]; then
        log_error "构建失败"
        exit 1
    fi
    
    BUILD_SIZE=$(du -sh dist | cut -f1)
    log_info "构建大小: $BUILD_SIZE"
    log_success "前端构建完成"
}

# 智能部署
smart_deploy() {
    log_step "部署前端到 Internet Computer..."
    
    # 根据部署模式选择不同的策略
    if [ "$DEPLOYMENT_MODE" = "update" ]; then
        log_info "更新现有部署..."
        # 更新现有 canister，使用较少的 cycles
        dfx deploy dawnpick_frontend --network ic --with-cycles 500000000000
    else
        log_info "创建新部署..."
        # 新部署，使用更多的 cycles
        dfx deploy dawnpick_frontend --network ic --with-cycles 2000000000000
    fi
    
    if [ $? -eq 0 ]; then
        FRONTEND_CANISTER_ID=$(dfx canister id dawnpick_frontend --network ic)
        FRONTEND_URL="https://${FRONTEND_CANISTER_ID}.ic0.app"
        
        log_success "前端部署成功!"
        echo
        log_info "🌐 前端访问地址: $FRONTEND_URL"
        log_info "🆔 Canister ID: $FRONTEND_CANISTER_ID"
        
        return 0
    else
        log_error "前端部署失败!"
        return 1
    fi
}

# 快速验证
quick_verification() {
    log_step "快速验证部署..."
    
    FRONTEND_CANISTER_ID=$(dfx canister id dawnpick_frontend --network ic)
    FRONTEND_URL="https://${FRONTEND_CANISTER_ID}.ic0.app"
    
    # 检查 canister 状态
    log_info "Canister 状态:"
    dfx canister status dawnpick_frontend --network ic
    
    # 简单的网络检查
    log_info "检查网站可访问性..."
    if curl -s --connect-timeout 10 --head "$FRONTEND_URL" | head -n 1 | grep -q "200 OK"; then
        log_success "网站可正常访问"
    else
        log_warning "网站可能需要几分钟才能完全生效"
    fi
}

# 显示有用信息
show_useful_info() {
    echo
    log_info "📋 常用命令:"
    echo "  查看状态: dfx canister status dawnpick_frontend --network ic"
    echo "  查看日志: dfx canister logs dawnpick_frontend --network ic"
    echo "  更新部署: ./deploy-frontend-ic-existing-user.sh"
    echo "  钱包余额: dfx wallet balance --network ic"
    echo "  身份信息: dfx identity whoami"
    
    FRONTEND_CANISTER_ID=$(dfx canister id dawnpick_frontend --network ic)
    echo
    log_info "🔗 重要链接:"
    echo "  应用地址: https://${FRONTEND_CANISTER_ID}.ic0.app"
    echo "  IC Dashboard: https://dashboard.internetcomputer.org/canister/${FRONTEND_CANISTER_ID}"
}

# 主函数
main() {
    echo -e "${CYAN}"
    echo "🚀 DawnPick CFD 前端快速部署 (已有账号版本)"
    echo "============================================="
    echo -e "${NC}"
    
    # 显示当前用户信息
    CURRENT_IDENTITY=$(dfx identity whoami 2>/dev/null || echo "未知")
    log_info "当前 dfx 身份: $CURRENT_IDENTITY"
    
    # 简化的确认流程
    if [ "$1" != "--skip-confirm" ]; then
        log_warning "即将部署到 Internet Computer 主网"
        read -p "确认继续? (Y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Nn]$ ]]; then
            log_error "部署已取消"
            exit 1
        fi
    fi
    
    # 执行优化的部署流程
    quick_env_check
    check_existing_deployment
    quick_wallet_check
    smart_install_dependencies
    optimized_build
    
    if smart_deploy; then
        quick_verification
        show_useful_info
        echo
        log_success "🎉 部署完成!"
        
        FRONTEND_CANISTER_ID=$(dfx canister id dawnpick_frontend --network ic)
        echo -e "${GREEN}🌐 立即访问: https://${FRONTEND_CANISTER_ID}.ic0.app${NC}"
    else
        log_error "部署失败，请检查错误信息"
        exit 1
    fi
}

# 捕获中断信号
trap 'log_error "部署被中断"; exit 1' INT TERM

# 运行主函数
main "$@"