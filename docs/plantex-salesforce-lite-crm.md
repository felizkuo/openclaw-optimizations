# Plantex Salesforce-lite CRM

Goal: build an affordable, company-native CRM for Plantex that captures exhibition leads, tracks follow-up, manages customer opportunities, and connects to AI agents.

Salesforce is powerful but expensive and overly broad for Plantex's immediate needs. Plantex should build a focused CRM that borrows the best concepts:

```text
Lead → Account / Contact → Opportunity → Activity / Task → Dashboard / Report
```

## Why Build This

Plantex loses value when exhibition business cards, WhatsApp chats, sample requests, and verbal buying signals are not tracked.

The system should ensure every customer signal has:

- owner;
- status;
- next action;
- due date;
- source evidence;
- follow-up history;
- conversion outcome.

## Salesforce Concepts to Borrow

| Salesforce concept | Plantex version | Purpose |
|---|---|---|
| Lead | Exhibition / inbound lead | Raw prospect before qualification |
| Account | Company / distributor / customer | Business entity |
| Contact | Person at the company | Human relationship |
| Opportunity | Sales chance / project | Potential deal, quote, sample request |
| Activity | Call / email / WhatsApp / meeting / sample follow-up | Interaction history |
| Task | Follow-up action | Closure and accountability |
| Report | Weekly sales / lead / pipeline report | Management visibility |
| Dashboard | CEO / Sales cockpit | Fast decision view |
| Permission / Profile | Role-based access | Protect sensitive contact/pricing data |
| App | Sales / Exhibition / Distributor / Sample modules | Role-specific workflows |

## What Not to Copy from Salesforce

- Too many fields before users understand the workflow.
- Heavy customization language that staff do not understand.
- Expensive license-per-user model.
- Complex enterprise automation before data quality is stable.
- Cloud-first handling of sensitive customer and pricing data.

## MVP Modules

### 1. Lead Capture

Input sources:

- business card photo;
- exhibition badge scan;
- manual form;
- WhatsApp/Telegram/Lark note;
- website sample request;
- Excel import.

Required fields:

| Field | Description |
|---|---|
| lead_id | Unique ID |
| source | Exhibition / Website / Referral / Existing customer |
| event_name | Exhibition name |
| collected_date | Date collected |
| company_name | Company |
| contact_name | Person |
| title | Job title |
| country_region | Country / region |
| phone | Restricted |
| email | Restricted |
| product_interest | Products discussed |
| conversation_summary | What they need |
| lead_temperature | Hot / Warm / Cold / Partner / Risk |
| owner | Responsible person |
| next_action | Next follow-up |
| due_date | Due date |
| status | New / Contacted / Qualified / Converted / Nurture / Closed-lost |
| source_evidence | Card image / note / file reference |
| privacy_level | L1-L4 |

### 2. Account & Contact

When a lead is qualified, convert it into:

- Account: company-level information;
- Contact: person-level information;
- Opportunity: specific sales project.

Account fields:

- company name;
- country;
- type: distributor / cafe chain / ingredient buyer / OEM / supplier / partner;
- existing customer?;
- credit status;
- owner;
- notes.

Contact fields:

- name;
- role/title;
- company;
- email/phone/WhatsApp;
- language;
- relationship strength;
- last contacted;
- consent/privacy note.

### 3. Opportunity Pipeline

Opportunity fields:

| Field | Description |
|---|---|
| opportunity_name | Example: ABC Distributor — Matcha powder supply |
| account_id | Linked account |
| stage | New / Discovery / Sample / Quote / Negotiation / Won / Lost |
| product_interest | SKU/category |
| estimated_value | Optional, restricted |
| estimated_volume | Optional |
| expected_close_date | Forecast |
| probability | % |
| owner | Sales owner |
| blockers | Price, certification, logistics, MOQ, etc. |
| next_action | Required next step |

### 4. Activity & Task Tracking

Every interaction should become an activity:

- call;
- email;
- WhatsApp;
- meeting;
- sample sent;
- quote sent;
- document sent;
- customer replied;
- no response.

Every open activity that needs action should create a task:

- owner;
- due date;
- priority;
- close condition;
- evidence link.

### 5. Sample Request Queue

Food ingredient sales often moves through samples. This should be first-class.

Fields:

- request_id;
- lead/account/contact;
- requested items;
- quantity;
- shipping address;
- courier/tracking;
- sent date;
- follow-up due date;
- feedback;
- conversion result.

### 6. AI Assistant Layer

AI agents should help with:

- extracting text from business cards;
- deduplicating leads;
- assigning lead temperature;
- recommending next action;
- drafting follow-up messages;
- reminding overdue tasks;
- summarizing weekly pipeline;
- flagging high-value or high-risk leads.

External sending still requires human confirmation.

## Permissions

| Role | Access |
|---|---|
| CEO | All dashboards, masked sensitive fields by default but can unlock |
| Sales owner | Own leads/accounts/opportunities/contact details |
| Sales manager | Team pipeline and follow-up status |
| Marketing | Lead source, campaign/event performance, masked contacts |
| Finance | Credit/payment status, not full conversation history unless needed |
| Compliance/Legal | Risk cases, certification claims, document review |
| Agent/System | Write structured records and tasks, no external send without approval |

## Dashboards

### CEO Dashboard

- hot leads by event;
- overdue follow-ups;
- opportunities by stage;
- sample requests pending;
- top countries/product interests;
- potential high-value accounts;
- risk/blocked deals.

### Sales Dashboard

- my leads due today;
- no-response leads;
- quote/sample follow-ups;
- stage pipeline;
- lost reasons.

### Exhibition Dashboard

- total cards captured;
- hot/warm/cold;
- by country;
- by product interest;
- follow-up completion rate;
- conversion rate.

## Recommended Tech Path

### Phase 1 — Local JSONL/CSV + Agent CLI

Already started:

- local CLI: `/home/felizkuo/.local/bin/exhibition-lead-capture`
- storage: `/home/felizkuo/ai-shared/vault/Business/Leads/exhibition_leads.jsonl`

Use this for quick capture and proof of workflow.

### Phase 2 — Lark Base CRM

Create tables:

1. Leads
2. Accounts
3. Contacts
4. Opportunities
5. Activities
6. Tasks
7. Sample Requests
8. Events/Exhibitions

Lark Base is good for staff UI and collaboration if performance is acceptable.

### Phase 3 — Plantex CRM Web App

Build a lightweight internal web app if Lark becomes slow or too limiting.

Backend:

- SQLite/Postgres;
- FastAPI;
- local-first file storage;
- role-based permissions;
- audit log.

Frontend:

- dashboard;
- Kanban pipeline;
- lead capture form;
- activity timeline;
- sample request board.

### Phase 4 — Control Tower Integration

Connect CRM with:

- sales order;
- invoice;
- stock;
- sample inventory;
- AR/AP;
- product master.

Then the system can answer:

- Which exhibition leads became real orders?
- Which samples converted?
- Which countries/products are trending?
- Which salesperson follows up fastest?
- Which customers are stuck because of certification, price, MOQ, or stock?

## First Build Priority

1. Lead Capture table/schema.
2. Follow-up task queue.
3. Sample request tracking.
4. Simple dashboard.
5. AI extraction from business cards.
6. Deduplication and lead scoring.
7. Lark Base or web UI.

## Success Metrics

| Metric | Target |
|---|---:|
| Business cards captured into system | > 95% |
| Hot leads followed up within 24h | > 90% |
| Warm leads followed up within 3 days | > 80% |
| Leads with owner + next action | > 95% |
| Duplicate lead rate | decreasing weekly |
| Sample requests with follow-up date | > 95% |
| Exhibition ROI visible by event | yes |

## Key Decision

Build this as Plantex's own CRM brain, not a Salesforce clone.

Salesforce is broad enterprise CRM. Plantex needs:

```text
Exhibition leads + B2B food ingredient sales + samples + quotes + follow-up closure + AI reminders
```
