# OpenClaw Memory Engine
不只是記憶，而是懂得學習。

學習不犯同樣的問題，學習如何進步。
AI 也像個學生，適合自己一再迴圈成長。

---

## 功能

### 1. 學生迴圈（Student Loop）
每次對話結束，AI 自動做三件事：
1. **抄筆記** - 記下做了什麼，改了哪些檔案、關鍵決策
2. **串連** - 標記屬於哪個專案，跟之前的筆記連起來
3. **找規律** - 掃描對話，偵測踩坑模式

### 2. 智慧載入（Smart Context）
根據對話內容自動載入相關記憶

### 3. 自動學習（Auto Learn）
踩坑時自動記錄問題和解法，下次不再犯

---

## 安裝

```bash
# 複製到 plugins
cp -r memory-engine ~/.openclaw/plugins/
```

---

## 使用方式

### 自動學習（每次對話結束）
AI 自動記錄學習筆記到 `memory/`

### 手動觸發 `/反思`
回顧最近對話，產出學習報告

---

## 檔案結構

```
memory-engine/
├── hooks/
│   ├── after-message.js   # 訊息後鉤子
│   └── before-response.js # 回應前鉤子
├── data/
│   ├── notes/           # 學習筆記
│   ├── mistakes/        # 踩坑記錄
│   └── patterns/        # 規律分析
└── scripts/
    ├── learn.js         # 學習腳本
    └── reflect.js        # 反思腳本
```

## 推薦記憶分層

Memory Engine 應配合四層記憶架構使用：

1. `memory/YYYY-MM-DD.md` — 每日工作日誌。
2. `~/wiki/docs/topics/` 或 Obsidian vault — 主題化、交叉引用的知識庫。
3. `MEMORY.md` — 精簡長期記憶與操作原則。
4. `TASK_POOL.json` — 需要閉環的任務、風險與決策。

詳細設計見：`docs/openclaw-memory-optimization.md`。

---
*For OpenClaw*
