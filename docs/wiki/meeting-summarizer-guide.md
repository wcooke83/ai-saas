---
title: Meeting Summarizer
description: Transform meeting transcripts into structured summaries with action items, key decisions, and attendee lists using AI
category: ai-tools
order: 4
---

# Meeting Summarizer

Turn raw meeting transcripts into organized summaries with key decisions, action items, next steps, and attendee lists.

## How It Works

1. Select a **meeting type** to optimize the summary structure
2. Paste your **transcript** or upload a VTT/SRT file
3. Choose which **sections** to include
4. Optionally add a title, date, and additional context
5. Click **Generate** to create your summary
6. Copy or download the result as Markdown or plain text

## Meeting Types

| Type | Focus Areas |
|------|-------------|
| **General** | Balanced summary with all section types |
| **Sales** | Client needs, next steps, deal status |
| **Team Standup** | Status updates, blockers, priorities |
| **Client** | Requirements, feedback, action items |
| **Strategy** | Decisions, trade-offs, direction |
| **Project Review** | Progress, risks, milestones |
| **Interview** | Candidate assessment, fit evaluation |
| **1-on-1** | Feedback, goals, concerns |

Selecting a meeting type automatically enables the most relevant sections for that type.

## Input Methods

### Paste Transcript

Paste raw meeting notes or transcript text directly. The AI handles various formats:
- Speaker-labeled lines (`John: I think we should...`)
- Plain paragraph text
- Timestamped notes
- Bullet-point notes

### Upload File

Click **Upload** to import a subtitle file:
- **VTT** (WebVTT) — Common format from Zoom, Teams, and Google Meet
- **SRT** — Standard subtitle format
- **TXT** — Plain text files

Timestamps and sequence numbers are automatically stripped from VTT and SRT files.

## Summary Sections

| Section | Description |
|---------|-------------|
| **Summary** | High-level overview of what was discussed (always included) |
| **Key Decisions** | Decisions made during the meeting with context |
| **Action Items** | Tasks assigned with owners and deadlines when mentioned |
| **Next Steps** | Follow-up activities and future meeting plans |
| **Attendees** | Participants identified from the transcript with roles |

## Additional Context

Use this optional field to help the AI produce more accurate summaries:

- **Project names** — "Project Phoenix is our Q2 migration initiative"
- **Acronyms** — "OKR = Objective and Key Result, P0 = highest priority"
- **Team context** — "Sarah is the frontend lead, Mike handles infrastructure"
- **Focus areas** — "This meeting was primarily about budget approval"

## Export Options

- **Copy** — Copies the full summary as Markdown to your clipboard
- **Download as Markdown** — .md file for documentation or wikis
- **Download as Text** — .txt file for email or messaging

## Tips for Better Summaries

- **Longer transcripts = better summaries** — The minimum is 50 characters, but 500+ characters produces much better results
- **Include speaker names** — Helps the AI attribute action items and identify attendees
- **Choose the right meeting type** — This significantly affects which information the AI prioritizes
- **Add context for jargon** — If your team uses internal terminology, explain it in Additional Context
