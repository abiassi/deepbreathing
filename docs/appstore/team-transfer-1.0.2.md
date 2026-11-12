# Apple team transfer and the 1.0.2 release

Status on 2026-11-12: **1.0.2 is not ready to submit.** Build 24 is in TestFlight only.

## What happened

- The App Store app `6786431781` (`com.deepbreathing.app`) moved from Reentry Systems
  Unipessoal Lda (`M29XZH5LMJ`) to Amorim Ferreira, Individual (`7ZCKCVM4C5`).
- Abi confirmed the transfer on 2026-11-10 and dated it to the week of November 2.
  Nobody has read the exact date from App Store Connect yet.
- Reentry Systems signed every build through the live 1.0.1 (22). Older docs and the
  October 8 screenshot name Reentry Systems because that was correct then.
- Build 1.0.2 (24) is the first build signed by the Individual team. Apple warned with
  ITMS-90076 that the app loses access to the old keychain.

## What the transfer changes for users

| Risk | Effect | State |
|---|---|---|
| Sign in with Apple user IDs | Apple gives each user a new ID on the new team. The server would open a new, empty account. | Accepted. See the decision below. |
| Server Apple credentials | `src/lib/auth.ts` signs with `APPLE_TEAM_ID` and `APPLE_KEY_ID`. A Reentry value may fail for the transferred bundle ID. | Unknown. Vercel returns these values empty. |
| Keychain | Users signed in on 1.0.1 are signed out once after the update. Practice history stays. | Accepted. |
| Private-relay email | Sending addresses are registered for Sign in with Apple email on Reentry Systems only. | Open. |

## Evidence from production, read-only, 2026-11-12

- 50 accounts use Sign in with Apple and 199 use Google.
- The newest Apple account is from 2026-11-07. No Apple user has a new session since.
- Earlier gaps between Apple signups ran up to four days, so the five-day gap suggests a
  fault but does not prove one.

## Decision, 2026-11-12: no Apple user migration

Abi chose not to run Apple's user migration. Apple users who update to 1.0.2 sign in
again and may receive a new, empty account. Their old history stays on the server
under the old account.

- 18 of the 50 Apple accounts practiced in the last 30 days. 11 of those use a
  private-relay email and cannot be relinked by email.
- The app does not copy local history into a different account. The storage is
  scoped per account in `apps/mobile/src/sync/session-sync-client.ts`.
- Accounts with a real email should relink by email through Better Auth. Untested.

## Before submitting 1.0.2

1. Find which team owns the website Services ID and the Sign in with Apple key.
2. Point the server Apple credentials at the Individual team for both the app and
   the website. A person gets one account only when both sit on the same team.
3. Register the sending addresses for Sign in with Apple email on the Individual team.
4. Test build 24 from TestFlight. Sign in with Apple must succeed.
5. Submit 1.0.2 for review.
