# OpenClaw Intelligence Roadmap

Goal: make OpenClaw feel more useful than generic public LLMs for Plantex employees.

Generic models are smart, but they do not know Plantex's people, SOPs, data, deadlines, files, risks, or operating rhythm. OpenClaw should win by being contextual, connected, proactive, and action-oriented.

## Core Strategy

```text
Generic LLM = high IQ assistant
OpenClaw = company-aware operating assistant
```

OpenClaw should improve across five dimensions:

1. Memory and knowledge compilation
2. Speed and context loading
3. Tool/action integration
4. Employee-facing UX
5. Proactive operating intelligence

## 1. Company Knowledge Brain

### What to build

- Department-specific wiki pages: Sales, Finance, Compliance, R&D, Procurement, Ops, Marketing.
- SOP cards: short, searchable, step-by-step answers.
- Product / ingredient / supplier knowledge pages.
- Decision history: why a decision was made, not just what was decided.
- Contradiction flags: old vs new pricing, old vs new SOP, expired certification claims.

### Why it beats generic models

Employees do not need to re-explain context. The assistant already knows company language, internal files, people, and constraints.

### Implementation

- Daily logs → topic wiki pages.
- Important answers → reusable SOP/FAQ pages.
- Weekly memory review → update `MEMORY.md` and task pool.

## 2. Fast Context Router

### What to build

Before answering, OpenClaw should classify the request:

| Request type | Load |
|---|---|
| Product/SOP | product wiki + SOP files |
| Finance | finance memory + approved sheets |
| Compliance | certification deadlines + legal red lines |
| Sales/customer | product FAQ + price rules + customer history if authorized |
| Internal IT | OpenClaw docs + local config |

### Why it beats generic models

Generic models search broadly. OpenClaw should load the right small context quickly.

### Implementation

- Lightweight routing rules.
- Department indexes.
- Few-shot answer templates per department.

## 3. Action Closure, Not Just Answers

### What to build

Every actionable result should end as one of:

- task created / updated;
- document updated;
- Lark Base row prepared;
- reminder scheduled;
- responsible person identified;
- blocker escalated.

### Why it beats generic models

Employees hate copying AI answers into another system. OpenClaw should move work forward.

### Implementation

- `TASK_POOL.json` schema.
- task/risk/decision/fyi classification.
- close condition and evidence required on every task.

## 4. Department Copilots

### What to build

Role-specific assistant modes:

| Department | OpenClaw should do |
|---|---|
| Sales | product answers, quotations drafts, customer FAQ, follow-up reminders |
| Finance | reconcile files, explain variances, chase missing docs |
| Compliance | certification tracker, claim checker, audit prep |
| R&D | SOP formatting, formula test logs, ingredient comparisons |
| Procurement | supplier risk, cost comparison, MOQ/lead-time tracking |
| Marketing | SEO checks, campaign calendar, product content drafts |
| Ops | stock alerts, delivery issues, workflow checklists |

### Why it beats generic models

Each employee gets an assistant that speaks their workflow, not a blank chatbot.

## 5. One-Click Employee UX

### What to build

Employees should not need prompt engineering.

Recommended shortcuts:

- `/ask-sop` — ask product/SOP question
- `/summarize-doc` — summarize uploaded document
- `/make-task` — turn chat into task
- `/check-risk` — compliance/legal/finance risk scan
- `/draft-reply` — customer/vendor reply draft
- `/find-file` — locate internal document
- `/daily-brief` — department daily brief

### Why it beats generic models

Speed and reliability. A button beats a prompt.

## 6. Proactive Alerts

### What to build

OpenClaw should interrupt only for meaningful events:

- overdue certification;
- low stock;
- gross margin anomaly;
- supplier risk;
- external competitor move;
- missing finance close documents;
- stale task with high impact.

### Why it beats generic models

Generic models wait. OpenClaw watches.

## 7. Trust and Safety Layer

### What to build

- Sensitive-data policy enforcement.
- External send confirmation.
- Legal/compliance claim checks.
- Source citation for important answers.
- Human confirmation before purchase, payment, quote, or public statement.

### Why it beats generic models

Employees can safely use it in real work without leaking or overclaiming.

## 8. Performance Improvements

### What to build

- Smaller context packs by department.
- Cached wiki summaries.
- Precomputed indexes.
- Use cheaper/faster model for routing and non-sensitive summaries.
- Use premium model for contracts, finance, legal, and high-stakes decisions.
- Avoid loading giant raw logs unless necessary.

### Why it beats generic models

Faster answers with less noise and lower cost.

## 9. Quality Feedback Loop

### What to build

Every employee interaction can be marked:

- useful;
- wrong;
- missing context;
- too slow;
- needs SOP;
- needs automation.

Weekly, Chloe should review patterns and improve skills, prompts, wiki pages, and shortcuts.

### Why it beats generic models

The system learns from company usage instead of resetting every chat.

## 30-Day Priority Plan

### Week 1 — Foundation

- Finish memory layering: daily log → wiki → MEMORY.md → task pool.
- Build department indexes.
- Create top 20 employee shortcuts.
- Add OpenClaw optimization docs to GitHub.

### Week 2 — Employee Value

- Sales/R&D/Compliance first because they have clear SOP/product/certification needs.
- Create FAQ/SOP cards.
- Add `/draft-reply`, `/ask-sop`, `/check-risk` workflows.

### Week 3 — Operating Intelligence

- Connect Control Tower outputs.
- Create low-stock, overdue AR/AP, certification, and gross-margin alerts.
- Build daily executive brief.

### Week 4 — Feedback and Optimization

- Collect employee pain points.
- Improve slow/failed workflows.
- Add missing wiki pages.
- Publish internal usage guide.

## Success Metrics

| Metric | Target |
|---|---:|
| Employee repeated usage | increasing weekly |
| Time-to-answer for SOP/product questions | < 20 seconds |
| Tasks with owner + close condition | > 90% |
| Important answers with source/context | > 80% |
| Manual re-explanation needed | decreasing weekly |
| Employee feedback: “better than ChatGPT for work” | majority positive |

## Guiding Principle

```text
Do not compete with generic models on raw intelligence alone.
Win by being company-native, context-aware, tool-connected, proactive, and safe.
```
