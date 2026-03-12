# AI 实时热点自动抓取系统 - 从 0 到 1 完整实现指南

> 来源：飞书文档
> 作者：OpenClaw 社区用户
> 日期：2026-03-09

---

## 📋 文档信息

- 适用人群：想实现自动化选题抓取的创作者、运营人员

---

## 🎯 本文解决什么问题？

每天手动刷 AI 资讯网站找选题太累？想要一个**全自动系统**，每天定时抓取热门选题，自动写入飞书多维表格？

本文手把手教你搭建一套完整的 AI 选题自动抓取系统，让机器帮你干活！

---

## 📋 目录

- 效果演示
- 系统架构
- 前置准备
- 详细部署步骤
- 代码解析
- 定时任务配置
- 常见问题 FAQ

---

## 🎬 效果演示

### 每日自动运行

| 时间 | 任务 | 输出 |
|------|------|------|
| 08:00 | 抓取 ai.hubtoday.app + radarai.top | P0/P1 选题摘要 |
| 12:00 | 从选题库生成口播文案 | 飞书云文档 |

### 抓取结果

自动写入飞书多维表格，包含：
- 选题标题
- 来源网站
- 优先级（P0/P1）
- 摘要内容
- 原文链接
- 抓取时间

---

## 🏗️ 系统架构

```
┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│ ai.hubtoday.app │ │ radarai.top     │ │ 其他资讯源      │
└────────┬────────┘ └────────┬─────────┘ └────────┬────────┘
         │                  │                   │
         └───────────────────────┼────────────────────────┘
                                 │
                        ┌────────▼────────┐
                        │ OpenClaw       │
                        │ (定时任务)      │
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │ 飞书多维表格    │
                        │ (选题库)       │
                        └─────────────────┘
```

---

## 🛠️ 核心组件

| 组件 | 作用 | 技术选型 |
|------|------|---------|
| 爬虫引擎 | 抓取网页内容 | OpenClaw + web_fetch |
| 数据处理 | 解析、清洗、优先级判定 | 内置逻辑 |
| 存储系统 | 持久化选题数据 | 飞书多维表格 |
| 定时调度 | 每日 08:00 自动执行 | OpenClaw HEARTBEAT |

---

## 📝 详细部署步骤

### Step 1：创建 HEARTBEAT.md 配置文件

```markdown
# HEARTBEAT.md - 心跳任务配置
**时区：北京时间 (UTC+8)**

---

## ⏰ 每日固定任务

### 08:00 选题抓取
- 抓取 ai.hubtoday.app + radarai.top
- 生成选题写入飞书多维表格
- 输出 P0/P1 选题摘要

### 12:00 口播文案生成
- 从选题库挑选最佳选题
- 生成飞书口播文案文档
```

### Step 2：配置飞书多维表格 Token

打开创建的多维表格，从 URL 中复制 app_token，在 OpenClaw 配置中填入。

### Step 3：编写抓取逻辑

```javascript
// 伪代码示例
async function fetchTopics() {
  const sources = [
    'https://ai.hubtoday.app',
    'https://radarai.top'
  ];
  
  for (const url of sources) {
    const content = await web_fetch(url);
    const topics = parseContent(content);
    await saveToBitable(topics);
  }
}
```

### Step 4：配置定时任务

在 OpenClaw 中配置定时触发：
- 每天 08:00 触发选题抓取
- 每天 12:00 触发文案生成

---

## 💻 代码解析

### 核心函数说明

#### 1. 网页抓取函数

```javascript
async function web_fetch(url, extractMode = 'markdown') {
  // 调用 OpenClaw web_fetch 工具
  // 返回网页的 Markdown 内容
}
```

#### 2. 内容解析函数

```javascript
function parseContent(html) {
  // 提取标题、摘要、链接
  // 根据关键词判定优先级（P0/P1）
  return topics;
}
```

#### 3. 写入多维表格

```javascript
async function saveToBitable(topics) {
  // 调用 feishu_bitable_app_table_record
  // 批量创建记录
}
```

---

## ⏰ 定时任务配置

OpenClaw HEARTBEAT 机制通过 HEARTBEAT.md 文件配置定时任务：

| 配置项 | 说明 |
|--------|------|
| 时间 | 北京时间 08:00 / 12:00 |
| 触发方式 | 系统自动轮询 |
| 执行环境 | OpenClaw 运行时 |

---

## ❓ 常见问题 FAQ

### Q1：抓取失败怎么办？

A：检查以下几点：
- 网络连接是否正常
- 目标网站是否可访问
- 是否有反爬限制（可添加 User-Agent）

### Q2：多维表格写入失败？

A：确认：
- app_token 是否正确
- 是否有写入权限
- 字段类型是否匹配

### Q3：如何调整抓取时间？

A：修改 HEARTBEAT.md 中的时间配置即可。

### Q4：可以抓取其他网站吗？

A：可以！在 sources 数组中添加新 URL 即可。

---

## 🎁 扩展玩法

### 1. 添加更多资讯源

```javascript
const sources = [
  'https://ai.hubtoday.app',
  'https://radarai.top',
  'https://new-site.com'  // 添加新网站
];
```

### 2. 多语言支持

### 3. 社交媒体分发

---
*存入知识库：2026-03-11*
