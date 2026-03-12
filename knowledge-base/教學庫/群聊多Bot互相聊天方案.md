# 群聊内多 Bot 互相聊天方案设计

> 来源：飞书文档
> 日期：2026-03-10

---

## 📋 概述

### 核心问题
飞书平台限制：机器人无法直接收到其他机器人发送的消息。
- `im.message.receive_v1` 事件只推送用户发送的消息。

### 解决思路

```
用户 @主Bot → 主Bot分析意图 → 以用户身份@子Bot → 子Bot执行 → 用户看到结果
```

---

## 🏗️ 架构设计

### 整体架构图

```
飞书群聊
│
用户 ──@主Bot──→ 主Bot ──用户身份@子Bot──→ 子BotA/B/C
│
↓ 解析用户意图
│ 判断调用哪个子Bot
│ 构造转发消息
└─────────────────────────────────────┘
```

### 角色定义

| 角色 | OpenID | 功能 | 所需权限 |
|------|--------|------|---------|
| 主 Bot | ou_xxx_main | 接收用户指令，调度子 Bot | im:message:receive_as_bot + 用户 OAuth |
| 子 Bot A | ou_xxx_a | 执行特定任务（如日程管理）| im:message:receive_as_bot |
| 子 Bot B | ou_xxx_b | 执行特定任务（如文档处理）| im:message:receive_as_bot |
| 子 Bot C | ou_xxx_c | 执行特定任务（如数据分析）| im:message:receive_as_bot |
| 用户 | ou_user_xxx | 发起指令，作为消息中转身份 | OAuth 授权 |

---

## 🔐 一、主 Bot 获取用户授权

### OAuth 授权流程

1. 用户点击授权链接
2. 飞书返回授权码 code
3. 主 Bot 用 code 换取 user_access_token
4. 存储 user_access_token 供后续使用

### 步骤 1：构造授权链接

```javascript
const authUrl = `https://open.feishu.cn/open-apis/authen/v1/authorize?
app_id=${APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${STATE}&response_type=code`;
```

### 步骤 3：用 code 换取 user_access_token

```bash
curl -X POST "https://open.feishu.cn/open-apis/authen/v1/access_token" \
-H "Content-Type: application/json" \
-d '{
  "grant_type": "authorization_code",
  "code": "AUTH_CODE_FROM_STEP_2"
}'
```

### 返回示例

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "access_token": "t-xxxxxxxxxxxxxxxxxxxxx",
    "refresh_token": "rt-xxxxxxxxxxxxxxxxxxx",
    "expires_in": 7200,
    "user_info": {
      "open_id": "ou_xxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "name": "张三"
    }
  }
}
```

---

## 📥 二、主 Bot 接收用户指令

用户在群聊中 @ 主 Bot

```
@主Bot 帮我查一下明天的日程
```

主 Bot 收到消息后：
1. 解析用户意图
2. 根据意图选择子 Bot
3. 以用户身份发送消息并 @ 子 Bot

---

## 📤 三、主 Bot 以用户身份 @ 子 Bot

### 关键 API

```bash
curl -X POST "https://open.feishu.cn/open-apis/im/v1/messages" \
-H "Authorization: Bearer {user_access_token}" \
-H "Content-Type: application/json" \
-d '{
  "receive_id": "oc_xxx_group_id",
  "msg_type": "text",
  "content": "{\"text\":\"<at id_type=\"user_id\" user_id=\"ou_xxx_subbot_a\">@子BotA</at> 查询明天的日程\"}",
  "receive_id_type": "chat_id"
}'
```

### 消息内容格式

| 类型 | 格式 | 示例 |
|------|------|------|
| 纯文本 | {"text":"内容"} | {"text":"你好"} |
| @用户 | <at user_id="ou_xxx">@名称</at> | <at user_id="ou_xxx">张三</at> |
| @机器人 | <at user_id="ou_xxx_bot">@Bot</at> | <at user_id="ou_xxx_bot">@Bot</at> |

### 要点总结

| 要点 | 说明 |
|------|------|
| Token 类型 | 使用 user_access_token 而非 tenant_access_token |
| @标签格式 | 必须包含 <at user_id="ou_xxx"> 标签 |
| 消息发送者 | 飞书显示为 用户 在发送消息 |
| 事件推送 | 子 Bot 会收到这条消息（因为发送者是用户）|

---

## 📥 四、子 Bot 处理并回复

子 Bot 收到用户（通过主 Bot 转发）的消息后：
1. 解析消息内容
2. 执行相应任务
3. 返回结果到群聊

---

## 💡 应用场景

1. **多 Agent 调度**：主 Bot 分析意图，分发给专业子 Bot
2. **任务分流**：不同子 Bot 处理不同类型请求
3. **协作处理**：复杂任务由多个子 Bot 协作完成

---

## ⚠️ 注意事项

1. 需要用户 OAuth 授权
2. token 需要存储和刷新
3. 需要正确处理权限

---
*存入知识库：2026-03-11*
