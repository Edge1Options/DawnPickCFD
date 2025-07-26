@echo off
echo 🚀 Starting DawnPick CFD deployment...

REM 检查 dfx 是否安装
where dfx >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ dfx is not installed. Please install dfx first.
    echo Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/
    pause
    exit /b 1
)

REM 检查 Node.js 和 npm
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM 安装依赖
echo 📦 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies.
    pause
    exit /b 1
)

REM 构建前端
echo 🔨 Building frontend...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed.
    pause
    exit /b 1
)

REM 检查构建结果
if not exist "dist" (
    echo ❌ Build failed. dist directory not found.
    pause
    exit /b 1
)

REM 启动本地 dfx
echo 🔧 Starting local dfx...
start /b dfx start --clean

REM 等待 dfx 启动
echo Waiting for dfx to start...
timeout /t 10 /nobreak >nul

REM 部署到本地网络
echo 🚀 Deploying to local network...
dfx deploy --network local
if %errorlevel% neq 0 (
    echo ❌ Local deployment failed!
    pause
    exit /b 1
)

echo ✅ Local deployment successful!
for /f "tokens=*" %%i in ('dfx canister id dawnpick_frontend --network local') do set FRONTEND_ID=%%i
for /f "tokens=*" %%i in ('dfx canister id dawnpick_backend --network local') do set BACKEND_ID=%%i

echo 📱 Frontend URL: http://localhost:8000/?canisterId=%FRONTEND_ID%
echo 🔗 Backend Canister ID: %BACKEND_ID%
echo 🎉 Deployment completed!
pause