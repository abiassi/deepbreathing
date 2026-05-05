-- Sign-up cohort quality check.
-- Run via: psql $POSTGRES_URL_NON_POOLING -f docs/runbooks/sql/cohort-check.sql
-- Used by docs/runbooks/weekly-funnel-refresh.md

\echo '\n=== 1. Headline counts ==='
WITH us AS (
  SELECT "userId", MAX("updatedAt") AS last_active, MIN("createdAt") AS first_login
  FROM session GROUP BY "userId"
)
SELECT
  COUNT(*) AS total_users,
  COUNT(*) FILTER (WHERE u."createdAt" >= now() - interval '28 days') AS signed_up_last_28d,
  COUNT(*) FILTER (WHERE u."createdAt" >= now() - interval '7 days') AS signed_up_last_7d,
  COUNT(*) FILTER (WHERE us."userId" IS NULL) AS no_session_failed,
  COUNT(*) FILTER (WHERE us.last_active::date > u."createdAt"::date) AS returned_after_day1,
  COUNT(*) FILTER (WHERE st.total_minutes > 0) AS engaged_any_min,
  COUNT(*) FILTER (WHERE st.total_minutes >= 30) AS engaged_30plus_min,
  COUNT(*) FILTER (WHERE st.sessions_completed > 0) AS has_completed_session,
  COUNT(*) FILTER (WHERE us.last_active >= now() - interval '7 days') AS active_last_7d,
  COUNT(*) FILTER (WHERE us.last_active >= now() - interval '14 days') AS active_last_14d
FROM "user" u
LEFT JOIN us ON us."userId" = u.id
LEFT JOIN user_stats st ON st.user_id = u.id;

\echo '\n=== 2. Email domain breakdown ==='
SELECT split_part(email, '@', 2) AS domain, COUNT(*) AS users
FROM "user"
GROUP BY domain
ORDER BY users DESC;

\echo '\n=== 3. Per-user activity (most recent first) ==='
WITH us AS (
  SELECT
    "userId",
    MAX("updatedAt") AS last_active,
    (ARRAY_AGG("userAgent" ORDER BY "updatedAt" DESC))[1] AS recent_ua,
    (ARRAY_AGG("ipAddress" ORDER BY "updatedAt" DESC))[1] AS recent_ip
  FROM session GROUP BY "userId"
)
SELECT
  to_char(u."createdAt", 'MM-DD') AS signup,
  CASE WHEN length(u.email) > 28 THEN substring(u.email, 1, 25) || '...' ELSE u.email END AS email,
  CASE WHEN us.last_active IS NULL THEN '-'
       ELSE (CURRENT_DATE - us.last_active::date)::text || 'd' END AS last_seen,
  COALESCE(st.total_minutes, 0) AS min,
  COALESCE(st.sessions_completed, 0) AS done,
  CASE
    WHEN us.recent_ua IS NULL THEN '-'
    WHEN us.recent_ua LIKE '%Mobile%' OR us.recent_ua LIKE '%iPhone%' OR us.recent_ua LIKE '%Android%' THEN 'mobile'
    ELSE 'desktop'
  END AS device,
  COALESCE(settings.mode, '-') AS mode
FROM "user" u
LEFT JOIN us ON us."userId" = u.id
LEFT JOIN user_stats st ON st.user_id = u.id
LEFT JOIN user_settings settings ON settings.user_id = u.id
ORDER BY u."createdAt" DESC;

\echo '\n=== 4. Engaged-minute distribution (any user with > 0 min) ==='
SELECT
  total_minutes,
  sessions_completed,
  to_char(updated_at, 'YYYY-MM-DD HH24:MI') AS last_synced
FROM user_stats
WHERE total_minutes > 0
ORDER BY total_minutes DESC;
