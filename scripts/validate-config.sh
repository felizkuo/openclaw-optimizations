#!/bin/bash

# OpenClaw 配置文件校验脚本
# 使用方法：bash validate-config.sh [agent-name]

AGENT_NAME="${1:-cos}"
WORKSPACE_DIR="$HOME/.openclaw/workspace-${AGENT_NAME}"

echo "🔍 开始校验配置文件: $AGENT_NAME..."
echo ""

# 检查必需文件
echo "=== 必需文件 ==="
REQUIRED_FILES=("SOUL.md" "AGENTS.md" "USER.md" "MEMORY.md")

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$WORKSPACE_DIR/$file" ]; then
    echo "✅ $file 存在"
  else
    echo "❌ $file 缺失"
  fi
done

# 检查可选文件
echo ""
echo "=== 可选文件 ==="
OPTIONAL_FILES=("IDENTITY.md" "TOOLS.md" "OPTIMIZATION.md")

for file in "${OPTIONAL_FILES[@]}"; do
  if [ -f "$WORKSPACE_DIR/$file" ]; then
    echo "✅ $file 存在"
  else
    echo "⚠️ $file 缺失（建议创建）"
  fi
done

# 检查 memory 目录
echo ""
echo "=== 记忆目录 ==="
if [ -d "$WORKSPACE_DIR/memory" ]; then
  echo "✅ memory 目录存在"
  FILE_COUNT=$(ls -1 "$WORKSPACE_DIR/memory" 2>/dev/null | wc -l)
  echo "  包含 $FILE_COUNT 个记忆文件"
else
  echo "❌ memory 目录缺失"
fi

# 检查 scripts 目录
echo ""
echo "=== 脚本目录 ==="
if [ -d "$WORKSPACE_DIR/scripts" ]; then
  echo "✅ scripts 目录存在"
  SCRIPT_COUNT=$(ls -1 "$WORKSPACE_DIR/scripts" 2>/dev/null | wc -l)
  echo "  包含 $SCRIPT_COUNT 个脚本"
else
  echo "⚠️ scripts 目录缺失"
fi

# 检查 config.json
echo ""
echo "=== 系统配置 ==="
if [ -f "$HOME/.openclaw/openclaw.json" ]; then
  echo "✅ openclaw.json 存在"
else
  echo "❌ openclaw.json 缺失"
fi

echo ""
echo "📊 校验完成！"
