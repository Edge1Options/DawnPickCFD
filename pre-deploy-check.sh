#!/bin/bash

# 部署前检查脚本
# 确保所有必要条件都满足

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

echo "🔍 DawnPick CFD 部署前检查"
echo "========================="

# 检查项目结构
log_info "检查项目结构..."
required_files=(
    "package.json"
    "dfx.json"
    "src/index.tsx"
    "src/App.tsx"
    "webpack.config.js"
    "tsconfig.json"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        log_error "缺少必要文件: $file"
        exit 1
    fi
done
log_success "项目结构检查通过"

# 检查依赖
log_info "检查依赖安装..."
if [ ! -d "node_modules" ]; then
    log_warning "node_modules 不存在，需要安装依赖"
    npm install
fi
log_success "依赖检查通过"

# 检查 TypeScript 编译
log_info "检查 TypeScript 编译..."
if ! npx tsc --noEmit; then
    log_error "TypeScript 编译错误"
    exit 1
fi
log_success "TypeScript 编译检查通过"

# 检查 ESLint
log_info "检查代码质量..."
if ! npm run lint; then
    log_warning "代码质量检查发现问题，建议修复后再部署"
    read -p "是否继续? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
log_success "代码质量检查通过"

# 检查构建
log_info "测试构建..."
if ! npm run build; then
    log_error "构建失败"
    exit 1
fi
log_success "构建测试通过"

# 检查 dfx 配置
log_info "检查 dfx 配置..."
if ! dfx ping ic &> /dev/null; then
    log_error "无法连接到 IC 网络"
    exit 1
fi
log_success "IC 网络连接正常"

# 检查身份
log_info "检查 dfx 身份..."
IDENTITY=$(dfx identity whoami)
log_info "当前身份: $IDENTITY"

if [ "$IDENTITY" = "anonymous" ]; then
    log_warning "当前使用匿名身份，建议创建专用身份"
    log_info "运行: dfx identity new <name>"
fi

# 检查钱包
log_info "检查钱包状态..."
if dfx wallet balance --network ic &> /dev/null; then
    BALANCE=$(dfx wallet balance --network ic)
    log_info "钱包余额: $BALANCE"
    
    # 提取数字部分检查余额
    BALANCE_NUM=$(echo $BALANCE | grep -o '[0-9,]\+' | tr -d ',')
    if [ "$BALANCE_NUM" -lt 2000000000000 ]; then
        log_warning "钱包余额可能不足，建议至少有 2T cycles"
    fi
else
    log_warning "无法获取钱包余额，可能需要部署钱包"
    log_info "运行: dfx identity deploy-wallet --network ic"
fi

echo
log_success "🎉 部署前检查完成！"
log_info "现在可以运行部署脚本了"