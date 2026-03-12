#!/bin/bash

# OpenClaw 工作区初始化脚本
# 使用方法：bash init-openclaw.sh [agent-name]

AGENT_NAME="${1:-main}"
WORKSPACE_DIR="$HOME/.openclaw/workspace-${AGENT_NAME}"

echo "🚀 开始初始化 OpenClaw 工作区: $AGENT_NAME..."

# 创建目录结构
echo "📁 创建目录结构..."
mkdir -p "$WORKSPACE_DIR/memory"

# 创建 SOUL.md
echo "📝 创建 SOUL.md..."
cat > "$WORKSPACE_DIR/SOUL.md" << 'EOF'
# SOUL.md - Agent 人设
# 参考模板见：OPTIMIZATION.md 附录 D.1
EOF

# 创建 AGENTS.md
echo "📝 创建 AGENTS.md..."
cat > "$WORKSPACE_DIR/AGENTS.md" << 'EOF'
# AGENTS.md - 协作通讯录
# 参考模板见：OPTIMIZATION.md 附录 D.2
EOF

# 创建 USER.md
echo "📝 创建 USER.md（请根据实际情况填写）..."
cat > "$WORKSPACE_DIR/USER.md" << 'EOF'
# USER.md - 用户信息
# 参考模板见：OPTIMIZATION.md 附录 D.3
EOF

# 创建 IDENTITY.md
echo "📝 创建 IDENTITY.md..."
cat > "$WORKSPACE_DIR/IDENTITY.md" << 'EOF'
# IDENTITY.md - Agent 身份
# 参考模板见：OPTIMIZATION.md 附录 D.4
EOF

# 创建 TOOLS.md
echo "📝 创建 TOOLS.md（请根据实际情况填写）..."
cat > "$WORKSPACE_DIR/TOOLS.md" << 'EOF'
# TOOLS.md - 工具配置
# 参考模板见：OPTIMIZATION.md 附录 D.5
EOF

# 创建 MEMORY.md
echo "📝 创建 MEMORY.md..."
cat > "$WORKSPACE_DIR/MEMORY.md" << 'EOF'
# MEMORY.md - 长期记忆
# 参考模板见：OPTIMIZATION.md 附录 D.6
EOF

# 创建今日记忆文件
echo "📝 创建今日记忆文件..."
TODAY=$(date +%Y-%m-%d)
cat > "$WORKSPACE_DIR/memory/$TODAY.md" << 'EOF'
# 日常记忆 - YYYY-MM-DD
# 参考模板见：OPTIMIZATION.md 附录 D.7
EOF

echo "✅ 初始化完成！"
echo ""
echo "📋 下一步："
echo "1. 编辑 USER.md，填写用户信息"
echo "2. 编辑 TOOLS.md，配置工具环境"
echo "3. 编辑 MEMORY.md，添加核心偏好"
echo "4. 重启 Gateway: openclaw gateway restart"
echo "5. 开始第一次对话！"
