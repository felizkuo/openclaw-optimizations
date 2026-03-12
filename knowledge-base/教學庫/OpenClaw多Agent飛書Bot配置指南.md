# OpenClaw 多 Agent 飛書 Bot 完整配置指南

> 来源：飞书文档
> 版本：v2.1
> 日期：2026-03-08

---

## 📋 文档信息

- 适配场景：多独立 Agent 部署、跨 Agent 协作
- 基于飞书渠道开发

---

## 一、核心概念

### 1.1 什么是"一个 Agent"

Agent = 独立的大脑，每个 Agent 拥有：

| 组件 | 说明 | 路径 |
|------|------|------|
| Workspace | 工作区文件（SOUL.md、AGENTS.md、USER.md 等）| ~/.openclaw/workspace-<agentId>/ |
| AgentDir | 状态目录（认证、模型注册、配置）| ~/.openclaw/agents/<agentId>/agent/ |
| Sessions | 会话存储（聊天记录 + 路由状态）| ~/.openclaw/agents/<agentId>/sessions/ |
| Auth Profiles | 认证配置（每个 Agent 独立）| ~/.openclaw/agents/<agentId>/agent/auth-profiles.json |

### 1.2 关键术语

| 术语 | 说明 | 示例 |
|------|------|------|
| agentId | 一个"大脑"（独立工作区 + 独立认证 + 独立会话）| main, dev, content |
| accountId | 一个渠道账号实例（如飞书应用 A/B/C）| main, dev, content |
| binding | 路由规则：将入站消息路由到 agentId | {agentId: "main", match: {...}} |
| peer | 具体的聊天对象（私聊用户 ID 或群聊 ID）| ou_xxx（私聊）, oc_xxx（群聊）|

### 1.3 多 Agent 应用场景

| 场景 | 配置方式 | 说明 |
|------|---------|------|
| 多角色协作 | 6 个 Agent（main/dev/content/ops/law/finance）| 每个 Agent 专注一个领域 |
| 多渠道分离 | WhatsApp → chat Agent, Telegram → opus Agent| 不同渠道用不同模型 |
| 多账号管理 | 个人飞书 → home Agent, 工作飞书 → work Agent| 多个飞书应用账号 |
| 特定人员路由 | 老板消息 → opus Agent, 其他人 → chat Agent| 基于 peer.id 路由 |
| 群聊专属 | 家庭群 → family Agent, 工作群 → work Agent| 基于群 ID 路由 |

---

## 二、目录结构与路径

### 2.1 标准目录结构

```
~/.openclaw/
├── openclaw.json              # 核心配置文件
├── agents/                   # 各 Agent 状态目录
│   ├── main/agent/          # main Agent 状态
│   │   ├── auth-profiles.json
│   │   └── sessions/
│   ├── dev/agent/           # dev Agent 状态
│   └── content/agent/        # content Agent 状态
└── workspace/                # 主工作区
    ├── main/                 # main Agent 工作区
    │   ├── SOUL.md
    │   ├── AGENTS.md
    │   ├── USER.md
    │   └── memory/
    ├── dev/                  # dev Agent 工作区
    └── content/              # content Agent 工作区
```

### 2.2 路径映射表

| 配置项 | 默认路径 | 说明 |
|--------|---------|------|
| Config | ~/.openclaw/openclaw.json | 核心配置文件 |
| State Dir | ~/.openclaw | 状态根目录 |
| Workspace | ~/.openclaw/workspace | 默认工作区 |
| Agent Dir | ~/.openclaw/agents/<agentId>/agent | Agent 状态目录 |
| Sessions | ~/.openclaw/agents/<agentId>/sessions | 会话存储 |

---

## 三、配置文件完整模板

### 3.1 openclaw.json 完整模板（6 Agent 版）

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "custom/qwen3.5-plus"
      },
      "compaction": {
        "mode": "safeguard"
      }
    },
    "list": [
      {
        "id": "main",
        "default": true,
        "name": "大总管",
        "workspace": "~/.openclaw/workspace-main",
        "agentDir": "~/.openclaw/agents/main/agent"
      },
      {
        "id": "dev",
        "name": "开发助理",
        "workspace": "~/.openclaw/workspace-dev",
        "agentDir": "~/.openclaw/agents/dev/agent"
      },
      {
        "id": "content",
        "name": "内容助理",
        "workspace": "~/.openclaw/workspace-content",
        "agentDir": "~/.openclaw/agents/content/agent"
      },
      {
        "id": "ops",
        "name": "运营增长助理",
        "workspace": "~/.openclaw/workspace-ops",
        "agentDir": "~/.openclaw/agents/ops/agent"
      },
      {
        "id": "law",
        "name": "法务助理",
        "workspace": "~/.openclaw/workspace-law",
        "agentDir": "~/.openclaw/agents/law/agent"
      },
      {
        "id": "finance",
        "name": "财务助理",
        "workspace": "~/.openclaw/workspace-finance",
        "agentDir": "~/.openclaw/agents/finance/agent"
      }
    ]
  },
  "channels": {
    "feishu": {
      "enabled": true,
      "accounts": {
        "main": {
          "appId": "cli_xxx",
          "appSecret": "xxx"
        },
        "dev": {
          "appId": "cli_xxx",
          "appSecret": "xxx"
        }
      }
    }
  }
}
```

---

## 四、Agent 人设文件模板

每个 Agent 需要以下文件：

| 文件 | 说明 |
|------|------|
| SOUL.md | Agent 人设定义 |
| AGENTS.md | 协作通讯录 |
| USER.md | 用户信息 |
| memory/ | 记忆文件目录 |

---

## 五、飞书应用配置步骤

1. 创建飞书应用
2. 配置机器人能力
3. 设置事件订阅（im.message.receive_v1）
4. 添加权限（im:message, im:chat）
5. 发布应用

---

## 六、启动与校验

```bash
# 启动 Gateway
openclaw gateway start

# 查看状态
openclaw status

# 查看日志
tail -f ~/.openclaw/openclaw.log
```

---

## 七、问题排查清单

| 问题 | 解决方法 |
|------|---------|
| Agent 未启动 | 检查 openclaw.json 配置 |
| 消息未路由 | 检查 binding 配置 |
| 飞书无响应 | 检查 appId/appSecret |

---

## 八、高级配置

- 多账号管理
- 跨 Agent 通信
- 自定义路由规则

---
*存入知识库：2026-03-11*
