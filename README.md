# OpenClaw 優化配置

這是我們自定義的 OpenClaw 配置，方便快速部署！

---

## 功能

| 功能 | 說明 |
|------|------|
| **Memory Engine** | AI 自動學習系統 |
| **Memory Optimization** | Logs → Wiki/Obsidian → Executive Memory → Task Closure |
| **自定義腳本** | 常用腳本集合 |
| **技能** | 已安裝的技能 |

---

## 文件

- [OpenClaw Memory Optimization](docs/openclaw-memory-optimization.md) — 把記憶從日誌升級成可累積的大腦
- [OpenClaw Intelligence Roadmap](docs/openclaw-intelligence-roadmap.md) — 讓 OpenClaw 比通用模型更適合 Plantex 員工日常工作

## 安裝方式

```bash
# Clone
git clone https://github.com/felizkuo/openclaw-optimizations.git

# 安裝 Memory Engine
cp -r memory-engine ~/.openclaw/

# 安裝腳本
cp scripts/*.sh ~/.openclaw/workspace-cos/scripts/
```

---

## 更新

```bash
cd openclaw-optimizations
git pull
cp -r memory-engine ~/.openclaw/
```

---

## 貢獻

有優化歡迎提交 PR！

---
*維護者：Feliz Kuo*
