# Exhibition Lead Capture Workflow

Goal: prevent exhibition business cards and leads from being lost after events.

## Problem

At exhibitions, Plantex collects many business cards, chats, samples requests, and informal commitments. Without a structured capture and follow-up workflow, leads become scattered across photos, WhatsApp, notebooks, and memory.

## Principle

Every card should become a trackable lead with owner, next action, due date, and follow-up history.

## Recommended Flow

```text
Business card photo / scan
→ OCR / manual correction
→ lead record
→ classification
→ task creation
→ follow-up reminder
→ conversion / closed-lost / nurture
```

## Lead Record Fields

### P0 Fields

| Field | Description |
|---|---|
| event_name | Exhibition name |
| event_date | Date collected |
| company_name | Company |
| contact_name | Person |
| title | Job title |
| country_region | Country / region |
| phone | Optional, access-controlled |
| email | Optional, access-controlled |
| website | Company website |
| product_interest | Interested products |
| conversation_summary | What they asked / need |
| lead_temperature | Hot / Warm / Cold |
| next_action | What to do next |
| owner | Responsible salesperson / agent |
| due_date | Follow-up due date |
| source_evidence | Card image / note / chat reference |
| privacy_level | L1/L2/L3/L4 |

### P1 Fields

| Field | Description |
|---|---|
| sample_requested | Yes/No |
| sample_items | Requested samples |
| estimated_volume | Potential volume |
| current_supplier | If mentioned |
| target_price | If safely shareable |
| certification_need | HALAL/FSSC/BRCGS/etc. |
| language | Preferred language |
| follow_up_channel | Email/WhatsApp/Lark/WeChat/etc. |

## Classification

| Type | Rule |
|---|---|
| Hot | Asked for quote/sample/meeting or has clear buying timeline |
| Warm | Relevant buyer/distributor, needs nurturing |
| Cold | General visitor, unclear fit |
| Partner | Supplier, service provider, media, association |
| Risk | Suspicious, competitor, sensitive info request |

## Follow-up SLA

| Lead type | First follow-up |
|---|---:|
| Hot | within 24 hours |
| Warm | within 3 days |
| Cold | within 7 days |
| Partner | case-by-case |
| Risk | review before reply |

## Agent Responsibilities

| Agent | Role |
|---|---|
| Chloe | Governance, workflow, task closure |
| Mason | System integration and lead cockpit |
| Ivy | Marketing message / collateral |
| Mina | Product/SOP/sample recommendation |
| Nina | Export/customer intelligence |
| Bella | E-commerce / digital follow-up if relevant |
| Claire | Legal/privacy/compliance risk |

## Data Safety

Do not dump raw card photos into external LLMs.

- OCR locally where possible.
- Store original card images in controlled storage.
- Mask personal phone/email for broad dashboards.
- Only assigned owner sees full contact details.
- Public reports should show counts, country, product interest, and status — not full personal data.

## jt-doc-tools Role

`jt-doc-tools` can be used as a local Document Safety Gateway / Document Ops utility:

- scan PDF/cards/docs;
- remove metadata;
- redact/mask sensitive information;
- extract text;
- compare documents;
- audit document operations.

Do not use official `curl | sudo` install blindly. Use reviewed local/user-mode deployment first.

## Dashboard Views

1. Event summary: total leads, hot/warm/cold, by country/product.
2. Follow-up board: overdue, due today, done.
3. Owner view: each salesperson’s assigned leads.
4. Sample request queue.
5. Risk/privacy review queue.

## Close Conditions

A lead is not complete until one of the following is true:

- quote sent;
- sample sent;
- meeting scheduled;
- assigned to nurture campaign;
- marked not relevant with reason;
- duplicate merged.
