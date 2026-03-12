#!/bin/bash

# 會議逐字稿分析腳本
# 使用方式：bash meeting-analysis.sh

echo "📝 會議逐字稿分析"
echo "=================="
echo ""
echo "請選擇輸入方式："
echo "1. 貼上文字逐字稿"
echo "2. 上傳音頻/影片檔案"
echo "3. 輸入 YouTube/影片連結"
echo ""
read -p "請選擇 (1/2/3): " choice

case $choice in
  1)
    echo "請貼上逐字稿內容（輸入完成後按 Ctrl+D）："
    cat > /tmp/transcript.txt
    echo ""
    echo "✅ 已獲取逐字稿，開始分析..."
    ;;
  2)
    echo "請輸入檔案路徑："
    read filepath
    if [ -f "$filepath" ]; then
      echo "✅ 檔案存在，開始轉錄..."
      # 使用 ffmpeg 提取音頻
      ffmpeg -i "$filepath" -vn -acodec libmp3lame /tmp/audio.mp3 2>/dev/null
      echo "⚠️ 音頻已提取，請使用 AI 分析"
    else
      echo "❌ 檔案不存在"
      exit 1
    fi
    ;;
  3)
    echo "請輸入影片連結："
    read url
    echo "✅ 開始下載並分析..."
    kd process "$url" --no-summary 2>/dev/null || echo "使用 AI 直接分析連結內容"
    ;;
  *)
    echo "無效選項"
    exit 1
    ;;
esac

echo ""
echo "請告訴我以上逐字稿的重點，我會幫您分析："
echo "- 合作模式"
echo "- 痛點"
echo "- 商機"
echo "- 建議"
