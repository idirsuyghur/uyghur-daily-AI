# WhatsApp Automation Policy (Idirs)

Updated: 2026-03-04
Owner: Idirs
Operator: Tughluk

## Goal
Run WhatsApp with high automation safely:
- Auto-handle routine messages
- Keep human approval for sensitive items
- Maintain natural behavior and avoid risky mass actions

## Modes

### A) AUTO-SEND (safe)
Allowed without asking each time:
- Greetings and courtesy replies
- Ramadan/holiday duas and blessings
- Simple acknowledgment: “received / will reply later”
- Thank-you replies

### B) DRAFT-FIRST (default)
For most conversations:
- Tughluk drafts message
- Sends after user confirmation or explicit "send/reply now"

### C) APPROVAL-REQUIRED (strict)
Never send without user approval when message includes:
- Money, payment, debt, prices
- Commitments, promises, deadlines
- Legal/official statements
- Emotional conflict, arguments, accusations
- Sensitive personal info

## Priority Buckets

### P1 — Urgent/Family
- Target response: ASAP
- Style: warm + direct

### P2 — Important Friends/Work
- Target response: same day
- Style: concise + practical

### P3 — Low Priority/Noise
- Batch replies or ignore
- Archive/mute when appropriate

## Current Quick Commands (for daily use)
User can trigger with simple phrases:
- "reply unreplied now" → reply pending unread safely
- "reply all new messages" → batch-reply new non-sensitive chats
- "draft only" → no auto-send, drafts only
- "safe auto mode" → only AUTO-SEND category
- "stop whatsapp" → stop all actions

## Tone Profile
Default tone:
- Uyghur-first when sender uses Uyghur
- Polite, warm, concise
- Avoid long robotic text

## Rate & Safety Limits
- Avoid spam-like bursts
- Keep intervals natural
- Do not mass-send to unknown contacts
- Keep one clear reply per message context

## Logging / Verification Rule
Before reporting "done":
1. Confirm message actually sent (not draft)
2. Confirm target chat name
3. Report exact count sent/replied

## Immediate Operating Default
Starting now, use:
- Safe Auto Mode ON
- Approval-required rules ON
- Verification rule ON
