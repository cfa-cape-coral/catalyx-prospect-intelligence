# Catalyx Prospect Intelligence Platform — Design Specification

**Date:** 2026-08-02  
**Status:** Approved for implementation planning  
**Repository:** `catalyx-prospect-intelligence`  
**Visibility:** Private  
**Primary user:** Daniel only

## 1. Product Goal

Build a private web application that turns a business card or manually entered lead into a complete Prospect Intelligence Report.

The system should help Catalyx understand a business well enough to start a useful conversation, offer a relevant free audit, and identify a possible first paid project.

The application is not a general CRM. It is a prospect research and consulting-intelligence platform.

## 2. Version 1 Success Criteria

Version 1 is successful when the user can:

1. Sign in privately.
2. Add a prospect manually.
3. Upload a business-card image.
4. Review and correct extracted card details.
5. Start an automatic research job.
6. Leave the page while research continues.
7. Return to a completed Prospect Intelligence Report.
8. Review sources and evidence.
9. View likely bottlenecks, AI opportunities, automation opportunities, cost-saving opportunities, discovery questions, a recommended audit, and one possible first project.
10. Generate outreach messages.
11. Move a prospect through a pipeline.
12. See the dashboard update automatically.

## 3. Scope

### Included in Version 1

- Single-user authentication
- Prospect creation and editing
- Business-card image upload
- OCR-assisted field extraction
- Public web research
- Background research jobs
- Source and evidence storage
- Structured intelligence reports
- Bottleneck hypotheses
- Opportunity scoring
- Outreach generation
- Pipeline tracking
- Timeline events
- Automatic dashboard metrics

### Excluded from Version 1

- Team accounts
- Automatic email or SMS sending
- Gmail integration
- CRM integrations
- Billing
- Client portals
- Multi-agent architecture
- Proprietary industry-learning engine
- Automatic proposal generation
- Mobile applications

## 4. Recommended Architecture

### Frontend and application layer

- Next.js with TypeScript
- App Router
- Server Components where practical
- Server Actions or API routes for mutations
- Responsive web interface

### Database and authentication

- Supabase Postgres
- Supabase Auth
- Supabase Storage for business-card images
- Row Level Security enabled
- One authorized user in Version 1

### AI and research

- OpenAI API for OCR assistance, classification, analysis, and structured report generation
- Public web search provider for company research
- Background job system for long-running research
- Structured JSON outputs validated before database insertion

### Hosting

- Vercel for the web application
- Supabase for database, authentication, and file storage

## 5. Core User Flow

1. User signs in.
2. User opens **New Prospect**.
3. User uploads a business card or enters information manually.
4. The application extracts card details when an image is uploaded.
5. User reviews and edits the extracted fields.
6. User selects **Save and Analyze**.
7. The prospect is saved immediately.
8. A research job is created with status `queued`.
9. The background worker researches the company and industry.
10. Sources and claims are stored.
11. The AI generates a structured report.
12. Opportunity score is calculated.
13. The research job becomes `complete` or `failed`.
14. Dashboard metrics update from database records.
15. User reviews the report, copies outreach, and updates pipeline status.

## 6. Main Screens

### 6.1 Login

Fields:

- Email
- Password
- Forgot password

Only one account is required in Version 1.

### 6.2 Dashboard

Top metrics:

- Total prospects
- Researching
- Ready to contact
- Waiting for reply
- Meetings booked
- Proposals sent
- Won clients

Sections:

- Priority prospects
- Follow-ups due
- Recent activity
- Research job status

All values are calculated automatically from the database.

### 6.3 New Prospect

Entry methods:

- Upload business card
- Manual entry

Fields:

- Contact name
- Company
- Role
- Phone
- Email
- Website
- LinkedIn
- Notes
- Relationship type

Actions:

- Save Draft
- Save and Analyze

### 6.4 Prospect Profile

Header:

- Contact name
- Company
- Role
- Pipeline status
- Opportunity score
- Last contact
- Next action
- Follow-up date

Tabs:

- Overview
- Research
- Bottlenecks
- Opportunities
- Questions
- Audit
- Outreach
- Sources
- Timeline

### 6.5 Research Status

Stages:

- Queued
- Researching company
- Reviewing sources
- Generating report
- Scoring opportunity
- Complete
- Failed

The job continues when the user leaves the page.

### 6.6 Pipeline

Statuses:

- New
- Researching
- Research complete
- Ready to contact
- Contacted
- Replied
- Meeting booked
- Audit complete
- Proposal sent
- Won
- Lost
- Partner

Changing status creates a timeline event and updates dashboard metrics.

## 7. Database Design

### `prospects`

- `id`
- `user_id`
- `contact_name`
- `company_name`
- `role`
- `phone`
- `email`
- `website`
- `linkedin_url`
- `notes`
- `relationship_type`
- `pipeline_status`
- `opportunity_score`
- `last_contact_at`
- `next_action`
- `follow_up_at`
- `business_card_image_path`
- `created_at`
- `updated_at`

### `research_jobs`

- `id`
- `prospect_id`
- `status`
- `current_step`
- `started_at`
- `completed_at`
- `error_message`
- `retry_count`
- `created_at`
- `updated_at`

### `sources`

- `id`
- `prospect_id`
- `title`
- `url`
- `source_type`
- `accessed_at`
- `relevant_excerpt`
- `reliability_level`
- `created_at`

### `claims`

- `id`
- `prospect_id`
- `source_id`
- `report_section`
- `claim_text`
- `classification`
- `confidence_level`
- `created_at`

Claim classifications:

- Verified fact
- Evidence-backed inference
- Industry hypothesis
- Unknown

### `reports`

- `id`
- `prospect_id`
- `executive_summary`
- `company_snapshot`
- `business_model`
- `revenue_drivers`
- `industry_trends`
- `competitive_position`
- `hidden_constraints`
- `ai_opportunities`
- `automation_opportunities`
- `cost_saving_opportunities`
- `discovery_questions`
- `recommended_audit`
- `first_project`
- `meeting_strategy`
- `outreach_messages`
- `generated_at`
- `version`

Structured sections may be stored as JSONB.

### `bottlenecks`

- `id`
- `prospect_id`
- `name`
- `description`
- `evidence_summary`
- `root_cause_hypothesis`
- `financial_consequence`
- `confidence_level`
- `classification`
- `created_at`

Bottleneck classifications:

- Verified issue
- Evidence-backed hypothesis
- Industry hypothesis
- Unknown

### `timeline_events`

- `id`
- `prospect_id`
- `event_type`
- `title`
- `details`
- `occurred_at`
- `created_at`

## 8. Prospect Intelligence Report Structure

Each generated report must contain:

1. Executive summary
2. Company snapshot
3. Business model
4. Revenue drivers
5. Industry trends
6. Competitive position
7. Company-specific evidence
8. Likely bottlenecks
9. Hidden constraints
10. AI opportunities
11. Automation opportunities
12. Cost-saving opportunities
13. Discovery questions
14. Recommended free audit
15. Specific first project
16. Outreach messages
17. Meeting strategy

## 9. Evidence Rules

The system must never present an industry assumption as a confirmed company problem.

Every factual claim must include:

- Source
- URL
- Access date
- Relevant excerpt
- Confidence level
- Classification

The user must be able to distinguish:

- Verified facts
- Evidence-backed inferences
- Industry hypotheses
- Unknown information

## 10. Opportunity Score

The score estimates whether Catalyx should invest time pursuing the prospect.

Recommended factors:

- Decision-maker access: 20%
- Operational complexity: 20%
- Estimated budget: 15%
- Urgency: 15%
- Measurable ROI potential: 15%
- Ease of winning trust: 10%
- Referral value: 5%

The score is advisory. The user may override it.

## 11. Error Handling

- Prospect information is saved before research starts.
- A failed research job does not delete prospect data.
- Failed jobs show a clear error message.
- User can retry failed jobs.
- Existing sources and reports are preserved unless a new successful report replaces them.
- Invalid AI output is rejected and retried using schema validation.
- Missing public information is labeled `Unknown` rather than invented.

## 12. Security

- Private repository
- Environment variables for all API keys
- No secrets committed to GitHub
- Supabase Row Level Security enabled
- Only authenticated user can read or modify records
- Business-card images stored in a private bucket
- Server-side access to research and AI APIs
- Basic audit logging through timeline events

## 13. Testing Strategy

### Unit tests

- Opportunity score calculations
- Pipeline status transitions
- Report schema validation
- Claim classification rules
- Dashboard metric calculations

### Integration tests

- Create prospect
- Upload business card
- Create research job
- Store sources and claims
- Complete report generation
- Retry failed job

### End-to-end tests

- Sign in
- Add prospect manually
- Upload business card
- Review extracted details
- Start analysis
- View completed report
- Change pipeline status
- Confirm dashboard update

## 14. Implementation Milestones

### Milestone 1 — Foundation

- Next.js project
- Supabase connection
- Authentication
- Database migrations
- Dashboard shell
- Manual prospect creation
- Prospect profile
- Pipeline status

### Milestone 2 — Business Card Intake

- Image upload
- Private storage
- OCR extraction
- Review and correction flow

### Milestone 3 — Research Engine

- Background jobs
- Search provider
- Source collection
- Evidence storage
- Failure and retry handling

### Milestone 4 — Intelligence Report

- Structured AI generation
- Report tabs
- Bottleneck storage
- Opportunity score
- Sources and claims interface

### Milestone 5 — Outreach and Timeline

- Outreach generation
- Copy controls
- Follow-up fields
- Timeline events
- Dashboard completion

## 15. First Implementation Boundary

The first implementation task must include only:

- Create the Next.js project
- Configure TypeScript and linting
- Add a basic application shell
- Add a placeholder login page
- Add a placeholder dashboard page
- Add a placeholder new-prospect page
- Add a placeholder prospect-profile route
- Add a README with local setup steps

It must not include Supabase, AI, OCR, search, or background jobs yet.

## 16. Definition of Done for the First Task

- Project installs successfully
- Development server starts
- All placeholder routes render
- Navigation works
- Type checking passes
- Linting passes
- README explains how to run the project
- Changes are committed to GitHub

