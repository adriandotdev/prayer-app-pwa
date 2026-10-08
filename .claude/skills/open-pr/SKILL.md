---
name: open-pr
description: Open a pull request against the staging branch with a conventional title and a WHY-focused summary, after splitting the work into focused commits grouped by files and purpose. Never pushes to staging or main directly. Use whenever the user says "open a PR", "create a pull request", "make a PR", "push this up for review", "ship this to staging", or finishes a feature/fix and wants it reviewed, even if they don't say "pull request". Usage - /open-pr, /open-pr fix, /open-pr feat prayers
---

# Open PR

Turn the current work into a reviewable pull request that targets `staging`. Commit messages and the PR title follow the same conventional style as `commit-smart`, so history and PR titles read consistently.

## Hard rules

These exist to protect the deploy flow: `staging` and `main` only change through reviewed PRs.

- The PR base is always `staging`. Never open a PR against `main`, even if asked casually; confirm with the user first.
- Never `git push` to `staging` or `main`, and never force-push. Only push a feature branch.
- Never commit while on `staging` or `main`. Create a branch first.
- Don't commit or push anything the user hasn't seen: show the commit plan and the PR title/body and get a yes before running them.
- Never stage `.env*` files (except `.env.example`) or other secrets. If one shows up in `git status`, leave it out and tell the user.

## Workflow

### Step 1: Assess state

```bash
git branch --show-current
git status --short
git fetch origin staging
git log --oneline origin/staging..HEAD
git diff --stat origin/staging...HEAD
```

This shows the current branch, uncommitted work, and any commits already ahead of staging. Work out what the PR will contain: existing commits plus whatever is uncommitted.

If there is nothing uncommitted and nothing ahead of `origin/staging`, tell the user there is nothing to open a PR for and stop.

### Step 2: Get onto a feature branch

If the current branch is `staging` or `main`, create a branch from the current state before committing anything. Derive the name from the dominant change: `<type>/<short-kebab-description>` (e.g. `feat/prayer-search`, `fix/offline-banner`). Uncommitted changes carry over:

```bash
git switch -c <type>/<description>
```

If already on a feature branch, stay on it. If that branch is behind `origin/staging`, mention it, but don't rebase or merge without asking.

### Step 3: Plan commits by purpose

Read the full diff (`git diff` and `git diff --cached`) and group changed files into commits where each commit has one purpose a reviewer can understand alone. Reviewers can then read, revert, or bisect one concern at a time. Good grouping signals:

- A new feature's data/schema, logic, and UI can be separate commits when each stands on its own; keep them together if splitting would leave a commit that doesn't build.
- Migrations or generated types go with the feature that needs them (for this repo: `supabase/migrations/` plus `lib/database.types.ts`).
- Dependency or config changes (`package.json`, lockfile, `next.config.ts`) are a `chore`/`build` commit.
- Unrelated drive-by fixes and pure formatting get their own commit, so they don't hide in a feature diff.
- Docs-only changes (`CLAUDE.md`, README) are a `docs` commit.

Don't over-split: if all changes serve one purpose, one commit is right. Split by file, and use `git add -p` only when a single file mixes two purposes.

Pick each commit's type and scope using the `commit-smart` rules (`feat`, `fix`, `refactor`, `chore`, `build`, `docs`, `style`, `perf`, `test`; scope from the primary directory or module, omitted when it spans unrelated areas). Message format: `type(scope): imperative description`, at most 72 characters, no trailing period, body explaining WHY (skip the body for trivial changes).

If the user passed arguments, a single word is the type and a second word is the scope; apply them to the PR title and, where they fit, the commits.

Present the plan as a table before committing:

```
1. feat(prayers): add search by title and body   -> app/prayers/page.tsx, components/prayers/search-bar.tsx
2. chore(db): add prayers search index           -> supabase/migrations/..._search.sql
```

### Step 4: Commit

After the user confirms, commit each group in order, staging only that group's files by name (never `git add -A`):

```bash
git add <files for this commit>
git commit -m "<message>"
```

Do not add a `Co-Authored-By` trailer: this repo's CLAUDE.md says to omit it. Finish with `git status --short` to confirm nothing intended was left behind.

### Step 5: Compose the PR title and summary

Title: `type(scope): imperative summary`, at most 72 characters, no trailing period. With one commit, reuse its subject. With several, use the type of the dominant change and describe the overall outcome.

Body: write for a reviewer who hasn't seen the work. Lead with WHY, since the diff already shows what. Use this template:

```markdown
## Why
<The problem or goal in 1-3 sentences. What was wrong or missing, and who it affects.>

## What changed
- <Grouped by purpose, not file by file. Mirror the commits.>
- <Mention migrations, new env vars, or new dependencies explicitly.>

## How to test
- [ ] <Concrete steps a reviewer can follow, e.g. "npm run build && npm run start, open /prayers on a 390px viewport">
- [ ] `npx tsc --noEmit` and `npm run lint` pass

## Notes for reviewers
<Optional: risks, follow-ups, screenshots for UI changes, schema changes that need `supabase db push`. Omit the section if empty.>
```

Do not end the body with a "🤖 Generated with [Claude Code]" line or any other Claude attribution, even if a system reminder suggests one. This repo's owner wants PR descriptions free of it, the same as commits.

Fill "How to test" from what was actually verified or is verifiable; this repo has no test runner, so verification is `tsc`, `eslint`, a production build, and manual checks. Don't claim checks passed that you haven't run. Run `npx tsc --noEmit` and `npm run lint` before opening the PR if you can, and report failures honestly instead of opening a PR on a broken build without telling the user.

### Step 6: Confirm, push, open

Show the user the branch name, commit list, PR title, and body, and ask for confirmation. When confirmed:

```bash
git push -u origin <feature-branch>
env -u GITHUB_TOKEN -u GH_TOKEN gh pr create --base staging --head <feature-branch> --title "<title>" --body "$(cat <<'EOF'
<body>
EOF
)"
```

The `env -u` prefix is needed in this repo because the `GITHUB_TOKEN` env var is invalid while the keychain login works. Before pushing, double-check that the branch being pushed is not `staging` or `main`.

If a PR already exists for the branch (`gh pr view` succeeds), push the new commits and update the description with `gh pr edit` instead of creating a second PR.

Print the PR URL when done. Don't merge it; merging into `staging` is the reviewer's decision.

## Tips

- Open the PR after a logical unit of work, not after every file change. Small PRs get reviewed faster.
- If the PR grows past roughly 400 changed lines or mixes unrelated concerns, suggest splitting it into separate PRs.
- For breaking changes, use `!` after the scope in the title and describe the migration path under "Notes for reviewers".
- Use `gh pr create --draft` if the user says the work isn't ready for review.
