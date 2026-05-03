# OpenClaw Memory Optimization: From Logs to a Learning Brain

OpenClaw should not only remember conversations. It should become smarter over time by compiling raw events into reusable knowledge, decisions, and action loops.

This document captures the intended memory architecture for our OpenClaw setup.

## Goal

Turn OpenClaw from a chat assistant into a compounding operating brain:

- remember important facts, decisions, preferences, SOPs, and risks;
- synthesize scattered notes into topic pages;
- keep project knowledge searchable in Obsidian / Markdown;
- preserve evidence without mixing raw logs into executive memory;
- close loops through tasks, follow-ups, and review gates.

## Four-Layer Memory Model

### 1. Raw Source Layer

Immutable or minimally edited source material.

Examples:

- chat transcripts;
- documents and PDFs;
- Lark / Feishu / Telegram / email exports;
- SQL / CSV exports;
- meeting notes;
- screenshots and attachments.

Purpose: preserve evidence and provenance.

Rule: raw sources are read and referenced, not rewritten as truth.

### 2. Daily Log Layer

Daily working memory.

Typical location:

```text
memory/YYYY-MM-DD.md
```

Purpose:

- what happened today;
- what was done;
- what changed;
- what is blocked;
- what needs follow-up.

Rule: daily logs can be detailed, but they are not the final knowledge base.

### 3. Wiki / Obsidian Synthesis Layer

Compiled knowledge, organized by topic.

Typical locations:

```text
~/wiki/docs/topics/
~/ai-shared/vault/Memory/wiki_topics/
~/ai-shared/vault/Projects/
```

Purpose:

- topic pages for agents, products, operations, compliance, finance, supply chain, customers, and system architecture;
- cross-links between related ideas;
- contradiction and stale-data flags;
- durable pages that can be browsed in Obsidian or built with MkDocs.

Rule: important daily knowledge should be integrated into the relevant topic page, not only appended as another dated note.

### 4. Executive Memory Layer

Small, curated, high-impact memory.

Typical location:

```text
MEMORY.md
```

Purpose:

- user preferences;
- long-term decisions;
- operating principles;
- red lines;
- unresolved strategic risks;
- workflows the assistant must follow in future sessions.

Rule: keep this layer dense. Do not dump raw logs here.

## Action Loop Layer

Memory is not enough. OpenClaw also needs closure.

Typical location:

```text
TASK_POOL.json
```

Purpose:

- convert decisions and risks into trackable tasks;
- assign owner, priority, due date, evidence required, and close condition;
- avoid losing important follow-ups inside narrative notes.

Recommended task fields:

```json
{
  "title": "Short task title",
  "type": "task | risk | decision | fyi",
  "owner_role": "Responsible person or agent role",
  "department": "Finance / Ops / Compliance / etc.",
  "priority": "P0 | P1 | P2 | P3",
  "due_date": "YYYY-MM-DD",
  "evidence_required": "What proof closes this",
  "close_condition": "Specific done condition",
  "source": "Where this came from"
}
```

## Ingestion Workflow

When new durable knowledge appears:

1. Save or reference the raw source.
2. Append a short factual note to the daily log.
3. Decide whether it deserves wiki synthesis.
4. If yes, update the relevant topic page and cross-links.
5. If it changes future behavior, update `MEMORY.md`.
6. If it requires follow-up, create or update a task.
7. Append a wiki log entry if the wiki changed.

## What Should Go Where?

| Content | Daily log | Wiki / Obsidian | MEMORY.md | Task pool |
|---|---:|---:|---:|---:|
| Routine work notes | Yes | Maybe | No | No |
| Important decision | Yes | Yes | Yes | Maybe |
| SOP / workflow | Yes | Yes | Yes if core | Maybe |
| Project status | Yes | Yes | Only strategic | Yes if actionable |
| Risk / blocker | Yes | Yes | Yes if recurring | Yes |
| User preference | Maybe | Maybe | Yes | No |
| Raw meeting transcript | Raw source | Summary only | No | Follow-ups only |

## Maintenance Cadence

### Every session / meaningful work block

- Write daily log.
- Update topic page when the information is durable.

### Daily or heartbeat

- Detect stale tasks and unresolved risks.
- Promote important daily notes into topic pages.
- Flag contradictions and missing links.

### Weekly

- Compress daily logs into a weekly executive digest.
- Update `MEMORY.md` only with durable changes.
- Review task pool for overdue / stale items.

## Design Principle

```text
Raw sources are evidence.
Daily logs are chronology.
Wiki / Obsidian is compiled knowledge.
MEMORY.md is executive instinct.
TASK_POOL is action closure.
```

If all five layers are maintained, OpenClaw becomes smarter with use instead of just accumulating text.
