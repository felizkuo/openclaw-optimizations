#!/bin/bash

# OpenClaw 配置匯出腳本
# 用途：將所有 Agent 配置匯出為壓縮包，供其他電腦匯入使用

OUTPUT_FILE="openclaw-config-backup-$(date +%Y%m%d).tar.gz"

echo "📦 匯出 OpenClaw 配置..."
echo "========================"

# 匯出所有工作區
echo "📁 匯出工作區..."
tar -czvf "$OUTPUT_FILE" ~/.openclaw/workspace-cos/

# 匯出腳本目錄
echo "📁 匯出腳本..."
tar -czvf "$OUTPUT_FILE" scripts/

# 顯示結果
echo ""
echo "========================"
echo "✅ 匯出完成：$OUTPUT_FILE"
echo ""
echo "📋 檔案大小：$(ls -lh $OUTPUT_FILE | awk '{print $5}')"
echo ""
echo "========================"
echo "📝 傳輸到其他電腦的方法："
echo ""
echo "方法 1：USB 隨身碟"
echo "  1. 複製 $OUTPUT_FILE 到 USB"
echo "  2. 貼到目標電腦的 ~/.openclaw/workspace/"
echo "  3. 解壓縮覆蓋"
echo ""
echo "方法 2：網路傳輸"
echo "  scp user@your-computer:$OUTPUT_FILE ."
echo "  scp $OUTPUT_FILE user@target-computer:/home/user/"
echo ""
echo "方法 3：雲端硬碟"
echo "  1. 上傳到 Google Drive / Dropbox"
echo "  2. 在目標電腦下載"
echo ""
echo "========================"
echo "📝 匯入後執行："
echo "  tar -xzvf $OUTPUT_FILE -C ~/.openclaw/workspace/"
