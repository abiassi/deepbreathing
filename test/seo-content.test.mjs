import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const boxPage = readFileSync(
  "/Users/abi/Sites/deepbreathing/src/app/box-breathing-app/page.tsx",
  "utf8"
);
const twoMinutePage = readFileSync(
  "/Users/abi/Sites/deepbreathing/src/app/2-minute-breathing-exercise/page.tsx",
  "utf8"
);
const breathingAppPage = readFileSync(
  "/Users/abi/Sites/deepbreathing/src/app/breathing-app/page.tsx",
  "utf8"
);
const homePage = readFileSync(
  "/Users/abi/Sites/deepbreathing/src/app/page.tsx",
  "utf8"
);
const breathingPages = readFileSync(
  "/Users/abi/Sites/deepbreathing/src/data/breathing-pages.ts",
  "utf8"
);
const useCasePages = readFileSync(
  "/Users/abi/Sites/deepbreathing/src/data/use-case-pages.ts",
  "utf8"
);

test("box breathing app page targets exact app intent", () => {
  assert.match(
    boxPage,
    /title:\s*"Box Breathing App: Free Online 4-4-4-4 Timer"/
  );
  assert.match(
    boxPage,
    /description:\s*"Free box breathing app with a guided 4-4-4-4 timer\. Use box breathing online for stress, focus, anxiety, and quick resets\. No download or signup\."/
  );
  assert.match(
    boxPage,
    /This free box breathing app gives you a guided 4-4-4-4 timer in your browser\./
  );
});

test("2 minute breathing exercise page emphasizes guided reset intent", () => {
  assert.match(
    twoMinutePage,
    /title:\s*"2 Minute Breathing Exercise: Free Guided Reset"/
  );
  assert.match(
    twoMinutePage,
    /description:\s*"Follow a free 2 minute breathing exercise online\. Choose box breathing or coherent breathing for a fast guided reset you can start now\."/
  );
  assert.match(
    twoMinutePage,
    /A guided 2 minute breathing exercise gives you a fast reset:/
  );
});

test("tummo page covers intent variants and safety modifiers", () => {
  assert.match(
    breathingPages,
    /title:\s*"Tummo Breathing: How to Do the Tibetan Inner Fire Technique \(Free Timer\)"/
  );
  assert.match(breathingPages, /heading:\s*"What is tummo breathing\?"/);
  assert.match(breathingPages, /heading:\s*"Tummo breathing benefits"/);
  assert.match(
    breathingPages,
    /heading:\s*"Is tummo breathing dangerous\?"/
  );
  assert.match(breathingPages, /"how to do tummo breathing"/);
  assert.match(breathingPages, /"tumo breathing"/);
});

test("running page broadens from side stitches to full running-breathing intent", () => {
  assert.match(
    useCasePages,
    /title:\s*"Breathing for Running: How to Breathe Better and Recover Faster"/
  );
  assert.match(
    useCasePages,
    /"how to breathe while running"/
  );
  assert.match(
    useCasePages,
    /question:\s*"How do you breathe while running\?"/
  );
  assert.match(
    useCasePages,
    /The best breathing for running depends on the moment/
  );
});

test("breathing app hub links to the current internal-link targets", () => {
  assert.match(breathingAppPage, /href="\/2-minute-breathing-exercise"/);
  assert.match(breathingAppPage, /href="\/for\/running"/);
  assert.match(breathingAppPage, /href="\/breathe\/tummo"/);
});

test("homepage highlights current SEO priority destinations", () => {
  assert.match(homePage, /href="\/box-breathing-app"/);
  assert.match(homePage, /href="\/2-minute-breathing-exercise"/);
  assert.match(homePage, /href="\/for\/running"/);
  assert.match(homePage, /href="\/breathe\/tummo"/);
});
