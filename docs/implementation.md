Below is a concrete, minimal path to V1 that indexes cleanly and is easy to ship in one sitting.

---

## Target V1 (scope)

* Single-file site with box‑breathing visualizer + short explainer.
* Fast, mobile‑first, accessible, no dependencies.
* Basic SEO: title/description, canonical, open graph, JSON‑LD, sitemap, robots.txt.
* Hosted on a static host with HTTPS + redirect to a single canonical URL.

---

## Deploy plan (fastest happy path)

1. **Host + DNS**

   * Put DNS on your registrar or Cloudflare.
   * Pick one canonical: `https://deepbreathingexercises.com` (recommended) and 301 redirect `www → root`.

2. **Static hosting**

   * Use Vercel, Netlify, or Cloudflare Pages. Any is fine.
   * Create a project with the three files below: `index.html`, `robots.txt`, `sitemap.xml`.
   * Set a redirect rule for `www` to root (most hosts have a one‑click toggle or simple rule).

3. **Search Console**

   * Verify the **domain property** via DNS TXT (recommended).
   * After deploy, submit `https://deepbreathingexercises.com/sitemap.xml` and use URL Inspection on the homepage.

4. **Analytics (optional for V1)**

   * If you want GA4, add later to avoid shipping delay. V1 can run without it.

---

## Files (copy/paste as‑is)

### 1) `index.html`

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Box Breathing Visualizer – Deep Breathing Exercises</title>
  <meta name="description" content="An ultra‑simple box breathing visualizer. Inhale 4, hold 4, exhale 4, hold 4. Guided timing, accessible controls, mobile‑friendly." />
  <link rel="canonical" href="https://deepbreathingexercises.com/" />
  <meta name="robots" content="index,follow,max-image-preview:large" />
  <!-- Open Graph / Twitter -->
  <meta property="og:title" content="Box Breathing Visualizer" />
  <meta property="og:description" content="Inhale 4, hold 4, exhale 4, hold 4—simple on‑screen guide." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://deepbreathingexercises.com/" />
  <meta name="twitter:card" content="summary" />
  <style>
    :root {
      --bg: #0b0c10;
      --fg: #e8e9ed;
      --muted: #a7abbb;
      --accent: #4dc3ff;
      --surface: #15171e;
      --ring-min: 0.65;
      --ring-max: 1.00;
      --radius: 160px;
      --shadow: 0 10px 30px rgba(0,0,0,.35);
      font-synthesis-weight: none;
      color-scheme: light dark;
    }
    @media (prefers-color-scheme: light) {
      :root { --bg:#ffffff; --fg:#0b0c10; --surface:#f5f7fb; --muted:#6b7280; --accent:#2563eb; }
      body { background: var(--bg); color: var(--fg); }
    }
    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      margin: 0;
      font: 16px/1.5 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      background: var(--bg);
      color: var(--fg);
      display: grid;
      place-items: start center;
    }
    header, main, footer { width: min(960px, 100%); padding: 16px; }
    header { padding-top: 24px; }
    h1 { font-size: clamp(1.4rem, 2.6vw, 2rem); margin: 0 0 8px; }
    p.lead { color: var(--muted); margin-top: 0; }

    .app {
      display: grid;
      gap: 20px;
      grid-template-columns: 1fr;
      justify-items: center;
      padding: 20px;
      background: var(--surface);
      border-radius: 16px;
      box-shadow: var(--shadow);
    }

    .ring-wrap {
      display: grid;
      place-items: center;
      width: calc(var(--radius)*2 + 32px);
      height: calc(var(--radius)*2 + 32px);
      padding: 16px;
    }
    .ring {
      width: calc(var(--radius)*2);
      height: calc(var(--radius)*2);
      border-radius: 50%;
      background: radial-gradient(closest-side, rgba(255,255,255,.06), transparent 60%),
                  conic-gradient(from 0deg, var(--accent) 0deg, rgba(127,127,127,.25) 0deg);
      display: grid;
      place-items: center;
      transition: filter .25s ease;
      filter: drop-shadow(0 2px 8px rgba(0,0,0,.25));
    }
    .orb {
      width: calc(var(--radius)*1.2);
      height: calc(var(--radius)*1.2);
      border-radius: 50%;
      background: radial-gradient(60% 60% at 50% 40%, rgba(255,255,255,.18), rgba(255,255,255,.05) 70%, rgba(255,255,255,0) 100%);
      transform: scale(var(--ring-min));
      will-change: transform;
    }
    @media (prefers-reduced-motion: reduce) {
      .orb { transition: none !important; }
    }

    .phase {
      margin-top: 8px;
      font-size: 1.1rem;
      text-align: center;
    }
    .phase strong { letter-spacing: .3px; }

    .controls {
      display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: center;
    }
    .controls label { font-weight: 600; }
    .controls input[type="range"] { width: 220px; }
    .controls input[type="number"] {
      width: 64px; padding: 6px 8px; border-radius: 8px; border: 1px solid rgba(0,0,0,.15);
      background: transparent; color: inherit;
    }
    button {
      appearance: none; border: none; padding: 10px 16px; border-radius: 10px;
      background: var(--accent); color: white; font-weight: 700; cursor: pointer;
      box-shadow: 0 8px 20px rgba(37, 99, 235, .25);
    }
    button.secondary { background: transparent; color: var(--fg); box-shadow: inset 0 0 0 2px rgba(127,127,127,.35); }
    button:disabled { opacity: .6; cursor: not-allowed; }

    .content { width: 100%; max-width: 720px; margin: 6px auto 0; color: var(--muted); }
    .content h2 { color: var(--fg); font-size: 1.1rem; margin: 0 0 8px; }
    .content p { margin: 0 0 10px; }

    footer { opacity: .7; font-size: .9rem; text-align: center; padding-bottom: 40px; }
    a { color: var(--accent); text-underline-offset: 2px; }
  </style>
  <!-- JSON-LD: WebSite + minimal FAQ -->
  <script type="application/ld+json">
  {
    "@context":"https://schema.org",
    "@type":"WebSite",
    "name":"Deep Breathing Exercises",
    "url":"https://deepbreathingexercises.com/",
    "about":{"@type":"Thing","name":"Box breathing"}
  }
  </script>
  <script type="application/ld+json">
  {
    "@context":"https://schema.org",
    "@type":"FAQPage",
    "mainEntity":[
      {"@type":"Question","name":"What is box breathing?","acceptedAnswer":{"@type":"Answer","text":"A paced-breathing pattern with equal counts: inhale 4, hold 4, exhale 4, hold 4. This tool provides a visual guide with adjustable timing."}},
      {"@type":"Question","name":"How do I use this?","acceptedAnswer":{"@type":"Answer","text":"Press Start. Follow the on-screen phase labels. Adjust the seconds slider if you want a slower or faster pace. Use the spacebar to start/stop."}}
    ]
  }
  </script>
  <!-- (Optional) place your Google Search Console meta verification tag here -->
</head>
<body>
  <header>
    <h1>Box Breathing Visualizer</h1>
    <p class="lead">Inhale 4, hold 4, exhale 4, hold 4. Simple, clean, no distractions.</p>
  </header>

  <main class="app" role="application" aria-label="Box breathing tool">
    <div class="ring-wrap">
      <div class="ring" aria-hidden="true">
        <div class="orb" id="orb"></div>
      </div>
    </div>

    <div class="phase" aria-live="polite" aria-atomic="true">
      <strong id="phaseLabel">Ready</strong> <span id="phaseCount"></span>
    </div>

    <div class="controls">
      <label for="seconds">Seconds per side:</label>
      <input id="seconds" type="range" min="3" max="8" step="1" value="4" aria-label="Seconds per phase" />
      <input id="secondsNum" type="number" min="3" max="8" step="1" value="4" aria-label="Seconds per phase number" />
      <button id="startBtn">Start</button>
      <button id="stopBtn" class="secondary" disabled>Stop</button>
    </div>

    <section class="content" id="about">
      <h2>What is box breathing?</h2>
      <p>Box breathing is a paced breathing pattern with four equal phases. Many people find it helpful for focus and calm.</p>
      <p>Typical pattern: inhale for 4 seconds, hold for 4, exhale for 4, hold for 4. Adjust the seconds if needed.</p>
      <h2>How to use this visualizer</h2>
      <p>Press Start. Follow the phase label (“Inhale”, “Hold”, “Exhale”, “Hold”). Spacebar toggles start/stop. Timing is adjustable.</p>
    </section>
  </main>

  <footer>
    © <span id="y"></span> deepbreathingexercises.com • No cookies or trackers in V1.
  </footer>

  <noscript>This site needs JavaScript enabled to animate the breathing orb and show timing.</noscript>

  <script>
    // Helpers
    const orb = document.getElementById('orb');
    const phaseLabel = document.getElementById('phaseLabel');
    const phaseCount = document.getElementById('phaseCount');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const secondsRange = document.getElementById('seconds');
    const secondsNum = document.getElementById('secondsNum');
    document.getElementById('y').textContent = new Date().getFullYear();

    // Sync range + number
    function syncSeconds(val) {
      const v = Math.max(3, Math.min(8, Number(val) || 4));
      secondsRange.value = v; secondsNum.value = v;
      return v;
    }
    secondsRange.addEventListener('input', e => syncSeconds(e.target.value));
    secondsNum.addEventListener('input',  e => syncSeconds(e.target.value));

    let running = false;
    let timers = [];
    let countdownTimer = null;
    const minScale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ring-min')) || 0.65;
    const maxScale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ring-max')) || 1.00;

    function clearTimers() {
      timers.forEach(t => clearTimeout(t));
      timers = [];
      if (countdownTimer) clearInterval(countdownTimer);
      countdownTimer = null;
    }

    function setPhase(name, seconds) {
      phaseLabel.textContent = name;
      phaseCount.textContent = seconds ? `• ${seconds}s` : '';
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (name === 'Inhale') {
        orb.animate([{transform:`scale(${minScale})`},{transform:`scale(${maxScale})`}],
                    {duration: seconds*1000, fill:'forwards', easing:'ease-in-out'});
      } else if (name === 'Exhale') {
        orb.animate([{transform:`scale(${maxScale})`},{transform:`scale(${minScale})`}],
                    {duration: seconds*1000, fill:'forwards', easing:'ease-in-out'});
      } // holds keep current scale
    }

    function countdown(seconds) {
      let remaining = seconds;
      phaseCount.textContent = `• ${remaining}s`;
      if (countdownTimer) clearInterval(countdownTimer);
      countdownTimer = setInterval(() => {
        remaining--;
        if (remaining >= 0) phaseCount.textContent = `• ${remaining}s`;
      }, 1000);
    }

    function runCycle() {
      if (!running) return;
      const s = syncSeconds(secondsRange.value);

      // Inhale
      setPhase('Inhale', s); countdown(s);
      timers.push(setTimeout(() => {
        // Hold 1
        setPhase('Hold', s); countdown(s);
      }, s*1000));

      // Exhale
      timers.push(setTimeout(() => {
        setPhase('Exhale', s); countdown(s);
      }, s*2000));

      // Hold 2
      timers.push(setTimeout(() => {
        setPhase('Hold', s); countdown(s);
      }, s*3000));

      // Loop to next cycle
      timers.push(setTimeout(() => {
        if (running) runCycle();
      }, s*4000));
    }

    function start() {
      if (running) return;
      running = true;
      startBtn.disabled = true;
      stopBtn.disabled = false;
      runCycle();
    }
    function stop() {
      running = false;
      clearTimers();
      startBtn.disabled = false;
      stopBtn.disabled = true;
      phaseLabel.textContent = 'Paused';
      phaseCount.textContent = '';
    }

    startBtn.addEventListener('click', start);
    stopBtn.addEventListener('click', stop);
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') { e.preventDefault(); running ? stop() : start(); }
    });

    // Initialize display
    syncSeconds(4);
  </script>
</body>
</html>
```

### 2) `robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://deepbreathingexercises.com/sitemap.xml
```

### 3) `sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://deepbreathingexercises.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

---

## On-page SEO checklist (do now)

* Unique `<title>` + meta description (done).
* Clear H1 matching intent: “Box Breathing Visualizer” (done).
* Fast: single HTML file, no fonts, no frameworks (done).
* Mobile friendly + accessible labels and ARIA live (done).
* Canonical tag set to root (done).
* JSON‑LD WebSite + FAQ (done).
* robots.txt + sitemap.xml (done).
* 301 redirect `www → root` at host level.

---

## Search Console checklist (do now)

* Verify domain property via DNS TXT at the registrar.
* Inspect `https://deepbreathingexercises.com/` → “Request indexing”.
* Submit sitemap.
* Check Mobile Usability and Core Web Vitals reports once data accumulates.

---

## Post‑V1 quick wins (later)

* Add a tiny **/about** and **/privacy** page (helps trust + thin‑content mitigation).
* Add another visualizer variant (e.g., 4‑7‑8) on its own URL to capture adjacent queries.
* Create a small OG image (static PNG) for better link previews.
* Add a single, relevant outbound link (e.g., an evidence‑based overview of paced breathing) to increase topical completeness.

---

## Notes

* Keep changes minimal until indexed.
* Avoid heavy analytics, cookie banners, and third‑party scripts; they hurt performance and add friction.
* If you later internationalize, use separate paths (`/es/`) and `hreflang`.

If you want, I can also provide lightweight `netlify.toml` or `vercel.json` for redirects/cache and a privacy page stub.
