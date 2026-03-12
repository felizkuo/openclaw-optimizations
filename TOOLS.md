# TOOLS.md - 工具与环境配置

## 📱 飞书配置

### 账户信息
- 用户 OpenID: (待获取)
- 用户 ID: (待获取)
- 租户 Key: (待获取)

### 常用群聊
| 群名 | ChatID | 用途 |
|-----|--------|------|
| 工作群 | oc_a83e423de0120acbace8d109134c2b64 | 日常工作沟通 |

### 日历配置
- 主日历: (待配置)
- 会议默认时长: 30 分钟
- 提醒设置: 提前 15 分钟
- 工作时间: 09:00-23:00

### 任务配置
- 默认任务清单: (待配置)
- 优先级规则: P0 > P1 > P2
- 默认截止时间: 当日 18:00

## 💻 开发环境

### 代码仓库
- GitHub: (待配置)
- 常用分支: main, develop, feature/*

### 技术栈
- OpenClaw: 2026.3.8
- Node.js: v22.22.0
- Python: 3.12

### 本地路径
- 工作区：~/.openclaw/workspace-cos/
- 下载区：~/downloads/

## 🌐 外部服务

### API 配置
| 服务 | 用途 | 状态 |
|-----|------|------|
| 天气 API | 天气提醒 | ✅ 可用 |
| Knowledge Distiller | 影片转文字 | ✅ 已安装 |
| GitHub | 代码管理 | 🔜 待登入 |

### 常用网站
- 飞书开放平台: https://open.larksuite.com
- OpenClaw 文档: https://docs.openclaw.ai
- GitHub: https://github.com

## 🔧 快捷命令

### 自定义命令
```bash
# 查看 Agent 状态
openclaw status

# 查看 Gateway 状态
openclaw gateway status

# 查看日志
tail -100 ~/.openclaw/openclaw-2026-03-10.log

# 影片转文字
kd process "URL" --no-summary
```

---
*此文件记录具体工具配置，方便 Agent 准确调用*
