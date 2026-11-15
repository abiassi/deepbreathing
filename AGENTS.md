<!-- dkmt:deep-breathing:start -->
# Deep Breathing Exercises

Deep Breathing Exercises — Guided breathing exercises web app

## Command Center

| Endpoint | URL |
|----------|-----|
| Plugin | `https://commandcenter.darkmatter.is/api/v1/projects/deep-breathing/plugin` |
| Briefing | `https://commandcenter.darkmatter.is/api/v1/context/deep-breathing/briefing` |
| Notes | `https://commandcenter.darkmatter.is/api/v1/projects/deep-breathing/notes` |
| Secrets | `https://commandcenter.darkmatter.is/api/v1/projects/deep-breathing/env` |
| API spec | `https://commandcenter.darkmatter.is/api/v1/openapi` |

Auth: `Authorization: Bearer $DKMT_CC_KEY`

## Environments

- **production** (domain): https://deepbreathingexercises.com
- **production** (app): https://origin.deepbreathingexercises.com

## CLI Quick Reference

The `dkmt-cc` CLI is installed via:
```
curl -fsSL https://raw.githubusercontent.com/Darkmatter-AI/deploy-dashboard/main/scripts/install-dkmt-cc.sh | bash
```

| Command | What it does |
|---------|-------------|
| `dkmt-cc context deep-breathing` | Full project context |
| `dkmt-cc env deep-breathing --export` | Resolve secrets as env vars |
| `dkmt-cc note deep-breathing "text"` | Add a note |
| `dkmt-cc access list deep-breathing` | See who has access |
| `dkmt-cc projects` | List all projects |
| `dkmt-cc whoami` | Check current user |
<!-- dkmt:deep-breathing:end -->

# Deep Breathing Exercises — Command Center

This project is registered in the Darkmatter Command Center as **deep-breathing**.

## Command Center

| Endpoint | URL |
|----------|-----|
| Plugin | `https://commandcenter.darkmatter.is/api/v1/projects/deep-breathing/plugin` |
| Briefing | `https://commandcenter.darkmatter.is/api/v1/context/deep-breathing/briefing` |
| Notes | `https://commandcenter.darkmatter.is/api/v1/projects/deep-breathing/notes` |
| Secrets | `https://commandcenter.darkmatter.is/api/v1/projects/deep-breathing/env` |
| API spec | `https://commandcenter.darkmatter.is/api/v1/openapi` |

Auth: `Authorization: Bearer $DKMT_CC_KEY`

## CLI Quick Reference

| Command | What it does |
|---------|-------------|
| `dkmt-cc status deep-breathing` | Project dashboard |
| `dkmt-cc context deep-breathing` | Full project context |
| `dkmt-cc env deep-breathing --export` | Resolve secrets as env vars |
| `dkmt-cc note deep-breathing "text"` | Add a note |
| `dkmt-cc pm deep-breathing` | PM digest (Linear + commits) |
| `dkmt-cc whoami` | Check current user |

## Public repo: no personal names
- This repository is public, and old commits stay readable after a fix. Never write a customer's, user's, or support contact's name, email, or other identifying detail in a commit, branch, PR, issue, comment, doc, evidence file, screenshot or test data. Write "a customer" instead. Check every diff and commit message before you push. Details: `CLAUDE.md`, "Public repo: no personal names".

## Local Mac development
- Never run local dev against `vercel env pull --environment=development`. That env points at the production Neon host.
- Run `scripts/dev/setup-local-db.sh` once per checkout. It needs Homebrew Postgres on 127.0.0.1:5432. It creates the local `deepbreathing` database, writes `.env.local`, and applies the better-auth and `src/lib/db/migrations` schema. It is safe to rerun.
- Then run `pnpm dev`. Pages, guest sessions, and `/api/auth/get-session` work. Google, Apple, and magic-link sign-in need real keys and do not complete locally.

## Cursor Cloud specific instructions
- No Docker. Postgres 16 runs as a system service (postgres/postgres, db `deepbreathing`); `.cursor/start.sh` starts it, runs the better-auth CLI migration, and applies `src/lib/db/migrations/*.sql`. Production Neon is never reachable from here.
- Node 22 + pnpm (version from `packageManager`). The web app runs in the `web-dev` terminal on :3000. Google OAuth and Resend keys are absent unless injected as Cloud Agent secrets; magic-link and Google sign-in will not complete, everything else works.
- Verify with `pnpm test`; `pnpm build` runs the native-i18n `check:*` gates and the post-build SSR tests. Browser proof: `.cursor/skills/verify-deepbreathing` (Playwright Chromium is installed). WebAudio stays suspended in headless Chromium, so the orb's Start->Pause transition needs a headed run or an unlocked audio context.
- Follow `CLAUDE.md`: read `docs/SEO-EXPERIMENTS.md` before any SEO change and log product changes in `docs/PRODUCT-EXPERIMENTS.md`.
