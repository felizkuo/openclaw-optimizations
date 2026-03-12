#!/bin/bash

# OpenClaw 快速安装脚本
# 使用方法：bash install-openclaw.sh

echo "🚀 OpenClaw 安装脚本"
echo "========================"

# 1. 检查系统
echo "📋 检查系统要求..."

if ! command -v curl &> /dev/null; then
    echo "❌ 需要 curl，请先安装 curl"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ 需要 git，请先安装 git"
    exit 1
fi

echo "✅ 系统检查通过"

# 2. 安装 Node.js (如果需要)
echo "📦 检查 Node.js..."
if ! command -v node &> /dev/null; then
    echo "📥 安装 Node.js 18+..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js: $NODE_VERSION"

# 3. 安装 OpenClaw
echo "📦 安装 OpenClaw..."
npm install -g openclaw

# 4. 初始化
echo "⚙️ 初始化 OpenClaw..."
openclaw init

# 5. 启动 Gateway
echo "🚀 启动 Gateway..."
openclaw gateway start

echo ""
echo "========================"
echo "✅ 安装完成！"
echo ""
echo "📋 后续步骤："
echo "1. 配置渠道：openclaw channels add"
echo "2. 查看状态：openclaw status"
echo "3. 查看帮助：openclaw --help"
