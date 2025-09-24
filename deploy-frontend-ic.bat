@echo off
setlocal enabledelayedexpansion

REM DawnPick CFD 前端部署到 ICP 主网脚本 (Windows版本)
REM 作者: DawnPick Team
REM 版本: 2.0

echo 🚀 DawnPick CFD 前端部署到 ICP 主网
echo ==================================

REM 确认部署
echo ⚠️  即将部署到 Internet Computer 主网
echo ℹ️  这将消耗真实的 cycles
set /p confirm="确认继续? (y/N): "
if /i not "%confirm%"=="y" (
    echo ❌ 部署已取消
    pause
    exit /b 1
)

echo.
echo 🔄 检查部署环境...

REM 检查 dfx
where dfx >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ dfx 未安装。请先安装 dfx。
    echo ℹ️  访问: https://internetcomputer.org/docs/current/developer-docs/setup/install/
    pause
    exit /b 1
)

REM 获取 dfx 版本
for /f "tokens=*" %%i in ('dfx --version') do set dfx_version=%%i
echo ℹ️  dfx 版本: %dfx_version%

REM 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装。请先安装 Node.js。
    pause
    exit /b 1
)

REM 获取 Node.js 版本
for /f "tokens=*" %%i in ('node --version') do set node_version=%%i
echo ℹ️  Node.js 版本: %node_version%

REM 检查 npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm 未安装。请先安装 npm。
    pause
    exit /b 1
)

REM 获取 npm 版本
for /f "tokens=*" %%i in ('npm --version') do set npm_version=%%i
echo ℹ️  npm 版本: %npm_version%

echo ✅ 环境检查完成

echo.
echo 🔄 检查 dfx 身份和钱包...

REM 检查当前身份
for /f "tokens=*" %%i in ('dfx identity whoami') do set current_identity=%%i
echo ℹ️  当前身份: %current_identity%

REM 检查钱包余额
echo 🔄 检查钱包余额...
dfx wallet balance --network ic >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  无法获取钱包余额，可能需要设置钱包
    echo ℹ️  请运行: dfx identity deploy-wallet --network ic
    set /p continue_deploy="是否继续部署? (y/N): "
    if /i not "!continue_deploy!"=="y" (
        echo ❌ 部署已取消
        pause
        exit /b 1
    )
) else (
    for /f "tokens=*" %%i in ('dfx wallet balance --network ic') do set wallet_balance=%%i
    echo ℹ️  钱包余额: !wallet_balance!
)

echo.
echo 🔄 安装项目依赖...
if exist "package-lock.json" (
    npm ci
) else (
    npm install
)
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)
echo ✅ 依赖安装完成

echo.
echo 🔄 构建前端应用...

REM 设置生产环境变量
set NODE_ENV=production
set REACT_APP_DFX_NETWORK=ic
set REACT_APP_IC_HOST=https://ic0.app
set REACT_APP_ENABLE_MOCK_DATA=false
set REACT_APP_ENABLE_REAL_TRADING=true

REM 清理之前的构建
if exist "dist" (
    rmdir /s /q dist
    echo ℹ️  清理旧的构建文件
)

REM 构建
npm run build
if %errorlevel% neq 0 (
    echo ❌ 构建失败
    pause
    exit /b 1
)

REM 检查构建结果
if not exist "dist" (
    echo ❌ 构建失败，dist 目录未找到
    pause
    exit /b 1
)

echo ✅ 前端构建完成

echo.
echo 🔄 部署前端到 Internet Computer...

REM 检查现有 canister ID
if exist ".dfx\ic\canister_ids.json" (
    echo ℹ️  检查现有 canister...
)

REM 部署前端 canister
dfx deploy dawnpick_frontend --network ic --with-cycles 2000000000000
if %errorlevel% neq 0 (
    echo ❌ 前端部署失败!
    pause
    exit /b 1
)

REM 获取 canister ID 和 URL
for /f "tokens=*" %%i in ('dfx canister id dawnpick_frontend --network ic') do set frontend_canister_id=%%i
set frontend_url=https://!frontend_canister_id!.ic0.app

echo ✅ 前端部署成功!
echo.
echo 🌐 前端访问地址: !frontend_url!
echo 🆔 Canister ID: !frontend_canister_id!

echo.
echo 🔄 检查 canister 状态...
dfx canister status dawnpick_frontend --network ic

echo.
echo 🔄 部署后验证...
echo ℹ️  检查网站可访问性...
curl -s --head "!frontend_url!" | findstr "200 OK" >nul
if %errorlevel% equ 0 (
    echo ✅ 网站可正常访问
) else (
    echo ⚠️  网站可能需要几分钟才能完全生效
)

echo.
echo ℹ️  📋 有用的命令:
echo   查看 canister 状态: dfx canister status dawnpick_frontend --network ic
echo   查看 canister 日志: dfx canister logs dawnpick_frontend --network ic
echo   更新前端: dfx deploy dawnpick_frontend --network ic
echo   删除 canister: dfx canister delete dawnpick_frontend --network ic

echo.
echo ✅ 🎉 前端部署完成!
echo 🌐 访问你的应用: !frontend_url!

pause