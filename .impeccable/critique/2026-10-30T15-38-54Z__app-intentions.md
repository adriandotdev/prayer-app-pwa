---
target: the intentions page
total_score: 26
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:/Users/nads/Desktop/prayer-app/app/intentions"
timestamp: 2026-10-30T15-38-54Z
slug: app-intentions
---
# Critique: Intentions page (app/intentions)

Method: dual-agent. Source-only review (route needs sign-in). Detector: 0 findings.

Score 26/40 (Acceptable). Heuristics: 1=3, 2=3, 3=2, 4=3, 5=2, 6=3, 7=2, 8=3, 9=3, 10=2.

## Priority issues
- [P1] "Mark answered" is the loudest element on every card (intention-item.tsx:53). Demote; group actions. -> quieter, layout
- [P1] Marking answered is silent and focus is lost (page.tsx:49 vs :65). Settle animation, return focus, clearer toast. -> animate, harden
- [P1] Permanent delete 4px from Edit, boilerplate copy (intention-item.tsx:49-73). Widen/move, warm copy, optional undo. -> harden
- [P2] Form leads with markdown hint and 7-tool toolbar; Cancel below keyboard and discards text (intention-form.tsx:34). -> distill, clarify
- [P2] Thin loading skeleton, heavy header chrome on phones, dates pop in after hydration. -> adapt, polish

## Personas
Casey: adjacent Edit/Delete, Cancel below keyboard. Sam: focus loss, summary-as-heading, identical Delete labels, opacity-80 contrast check across seasons. Jordan: "Answered" undefined, privacy unstated. Grieving user: no state other than answered or delete.
