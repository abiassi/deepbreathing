# Apple team transfer and the 1.0.2 release

Status on 2026-11-12: **1.0.2 is not submitted.** Website Sign in with Apple works on the new team. The app needs a new build and one TestFlight test.

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
| Server Apple credentials | `src/lib/auth.ts` signs with `APPLE_TEAM_ID` and `APPLE_KEY_ID`. A Reentry value may fail for the transferred bundle ID. | Fixed 2026-11-12. See below. |
| Keychain | Users signed in on 1.0.1 are signed out once after the update. Practice history stays. | Accepted. |
| Private-relay email | Sending addresses are registered for Sign in with Apple email on Reentry Systems only. | Fixed 2026-11-12. See below. |

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

## Done on 2026-11-12

- Read both teams in the Apple developer portal. The Individual team owns the App ID
  `com.deepbreathing.app` and the Services ID `com.deepbreathing.app.web`, grouped
  together. The Individual team had no Sign in with Apple key.
- Created Sign in with Apple key `4H8RUTKW9M` on the Individual team. The private key
  is in 1Password, Agent Work vault, item "Deep Breathing - Sign in with Apple key
  4H8RUTKW9M". Apple allows one download only.
- Set `APPLE_TEAM_ID`, `APPLE_KEY_ID` and `APPLE_PRIVATE_KEY` in Vercel production and
  redeployed production from `main`.
- Abi signed in with Apple on the website at 10:57 UTC. The database shows one new
  Apple account with a stored Apple token, so the code exchange works with the new key.
- Registered `noreply@deepbreathingexercises.com` and `abi@deepbreathingexercises.com`
  under Sign in with Apple for Email Communication on the Individual team. Both show
  status SPF. Before that, all 3 private-relay signups in November bounced, against
  0 of 31 from August to October.

A fake authorization code cannot test the key. Apple answers `invalid_grant` for a
correct key and for a wrong key alike. Only a real sign-in proves the credentials.

## Before submitting 1.0.2

1. Build 1.0.2 from current `main`. Build 24 predates the Expo patch updates.
2. Test the new build from TestFlight. Sign in with Apple must succeed in the app.
3. Confirm that a new private-relay signup receives the welcome email.
4. Create version 1.0.2 in App Store Connect and submit it for review.

## Open

- Three private-relay addresses from November sit in `email_suppressions` as bounces.
  They receive no mail until someone removes those rows.
- The Reentry Systems certificates area is closed to the `tzolking@gmail.com` Apple ID.
