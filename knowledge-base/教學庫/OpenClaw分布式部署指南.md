# OpenClaw 分布式部署指南

> 来源：飞书文档
> 日期：2026-03-08

---

## 📋 文档信息

- 版本：v1.0
- 适用场景：多租户隔离、高可用部署、分布式 Agent 协作

---

## 一、架构设计

### 1.1 典型架构

```
Docker Host / Cluster
├── Container 1: OpenClaw-Main (飞书 Bot A, Port: 18789)
├── Container 2: OpenClaw-Dev (飞书 Bot B, Port: 18790)
├── Container 3: OpenClaw-Fin (飞书 Bot C, Port: 18791)
└── Docker Network (openclaw-net)
```

### 1.2 通信方案对比

| 方案 | 优点 | 缺点 | 推荐场景 |
|------|------|------|---------|
| 飞书中转 | 简单可靠，无需额外配置 | 依赖飞书，有延迟 | ⭐⭐⭐ 最推荐 |
| Gateway 直连 | 低延迟，不依赖第三方 | 需要网络配置，安全复杂 | 内网部署 |
| 消息队列 | 解耦，高可用 | 架构复杂 | 大型集群 |
| Agent-to-Agent | 原生支持，配置简单 | 需要同一 Gateway 下 | 单容器多 Agent |

### 1.3 推荐方案

**混合架构：飞书中转 + Gateway 直连**
- 日常消息 → 飞书中转（可靠，有审计）
- 实时协作 → Gateway 直连（低延迟）

---

## 二、前置条件

### 2.1 系统要求

| 要求 | 最低配置 | 推荐配置 |
|------|---------|---------|
| Docker | v20.10+ | v24.0+ |
| Docker Compose | v2.0+ | v2.20+ |
| 内存 | 2GB/容器 | 4GB/容器 |
| CPU | 1核/容器 | 2核/容器 |
| 存储 | 5GB/容器 | 10GB/容器 |

### 2.2 飞书应用要求

每个飞书应用需要：
- ✅ 应用已创建并发布
- ✅ 机器人能力已开启
- ✅ 事件订阅已配置（im.message.receive_v1）
- ✅ 权限已添加（im:message, im:chat）

### 2.3 网络要求

| 网络类型 | 端口 | 说明 |
|---------|------|------|
| 容器间网络 | 内部 | Docker 网络自动分配 |
| Gateway 端口 | 18789, 18790, 18791... | 每个容器独立端口 |

---

## 三、Docker 配置

### 3.1 目录结构

```
/opt/openclaw-cluster/
├── docker-compose.yml
├── .env
├── main/
│   ├── openclaw.json
│   └── workspace/
├── dev/
│   ├── openclaw.json
│   └── workspace/
├── finance/
│   ├── openclaw.json
│   └── workspace/
└── scripts/
    ├── start.sh
    ├── stop.sh
    └── backup.sh
```

### 3.2 环境变量 (.env)

```bash
FEISHU_MAIN_APP_ID=cli_xxx
FEISHU_MAIN_APP_SECRET=xxx
FEISHU_DEV_APP_ID=cli_xxx
FEISHU_DEV_APP_SECRET=xxx
FEISHU_FINANCE_APP_ID=cli_xxx
FEISHU_FINANCE_APP_SECRET=xxx
```

---

## 四、飞书应用配置

每个容器对应一个飞书 Bot：
- Container 1 → 飞书 Bot A (cli_xxx)
- Container 2 → 飞书 Bot B (cli_xxx)
- Container 3 → 飞书 Bot C (cli_xxx)

---

## 五、运维管理

### 启动
```bash
docker-compose up -d
```

### 停止
```bash
docker-compose down
```

### 备份
```bash
./scripts/backup.sh
```

---

## 六、注意事项

1. 每个容器需要独立端口
2. 飞书应用需要单独创建和配置
3. 建议使用 Docker 网络隔离
4. 生产环境建议使用高可用配置

---
*存入知识库：2026-03-11*
