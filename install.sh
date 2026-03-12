#!/bin/bash
# OpenClaw 優化一鍵安裝

echo "=== OpenClaw 優化安裝 ==="

# Memory Engine
echo "安裝 Memory Engine..."
mkdir -p ~/.openclaw/memory-engine
cp -r memory-engine/* ~/.openclaw/memory-engine/
echo "✅ Memory Engine 完成"

# 腳本
echo "安裝腳本..."
mkdir -p ~/.openclaw/workspace-cos/scripts
cp scripts/*.sh ~/.openclaw/workspace-cos/scripts/
chmod +x ~/.openclaw/workspace-cos/scripts/*.sh
echo "✅ 腳本完成"

echo ""
echo "=== 安裝完成 ==="
echo "查看: https://github.com/felizkuo/openclaw-optimizations"
