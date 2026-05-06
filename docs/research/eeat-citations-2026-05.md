# E-E-A-T overhaul research — May 2026

Consolidated research backing the byline + lineage + citations + about-page work. Source: 5 parallel investigation agents (Apr–May 2026). Reference class: **wellness/breathwork sites** (Calm, Headspace, Wim Hof Method, Othership, Huberman Lab, mindbodygreen) — NOT medical sites (Healthline, Cleveland Clinic, WebMD).

## Decision log

| Decision | Choice | Rationale |
|---|---|---|
| Reference class | Wellness/breathwork | Not YMYL/medical; we don't have clinical staff and don't want to fake one |
| Schema for technique pages | `HowTo` (already emitted) + Article | NOT `MedicalWebPage` — over-claims YMYL we can't defend |
| Public byline | "Abi Abiassi" | Distinct from email; founder voice; saved to memory |
| Visible "Reviewed by" line when reviewer empty | Drop | Current "Resonance Editorial Review Team" fallback is misleading |
| Citation density | 1–3 inline hyperlinks/page | Calm/Othership norm; NOT footnotes or DOI reference lists |
| Medical reviewer | Skip | Wrong reference class; only Calm has one in audited set |
| `/about/methodology` | Rename to `/about/editorial-policy` + 301 | "Methodology" reads clinical; editorial fits wellness class |
| `/about/abi` | Multi-language (all locales) | User decision; mass-translate may be voice-lossy but acceptable |
| Yogi Bhajan caveat (Breath of Fire) | Silent | Tight prose; user choice |
| Twitter creator handle | `@abiassi_` | Personal handle, matches new byline |
| Inline citation rendering | Minimal `[text](url)` markdown in body content | Avoids schema change; mass-translate preserves URLs in `<a>` tags |

## Honesty corrections (soften BEFORE citing)

These are existing overclaims on the live pages. Citing peer-reviewed studies next to misrepresentations is worse than no citations.

| Page | Current overclaim | Fix |
|---|---|---|
| `/breathe/physiological-sigh` | "fastest stress reduction" | "produces measurable mood/arousal benefits within minutes" — Balban 2023 doesn't test "fastest" |
| `/breathe/box` | Navy SEAL framing as if study-validated | Reframe as adoption; cite Balban 2023 on "reduced state anxiety daily over a month" |
| `/breathe/4-7-8` | "fall asleep faster" stated as fact | "research suggests" — only one moderate RCT (Musa 2025) directly tests sleep onset |
| `/breathe/belly` | implied IBS symptom relief | Drop or reframe — Jurek 2022 was null on symptom severity |
| `/breathe/wim-hof` | "boosts mood / fights depression" | Reframe — Blades 2024 found WHM equivalent to slow breathing + warm showers |
| `/breathe/ujjayi` | "increases vagal tone via throat constriction" | Drop the throat-constriction-specific claim — Mason 2013 shows throat constriction *reduces* baroreflex vs. plain slow breathing |
| `/breathe/buteyko` | implied use for sleep apnea | Remove — no quality RCT evidence for OSA |
| `/breathe/coherent` | "permanently increases HRV" | "increases HRV during practice" — Balban 2023 showed no resting HRV change at 28 days |
| Hypertension page | "RESPeRATE works" without caveat | Mention AHA Class IIA endorsement *and* Landman 2014 IPD null finding |
| `/for/focus` | "30–40%" / "50–100%" specific numbers | Soften — not directly traceable to Lehrer 2020 / Tinello 2022 |
| `/for/lung-capacity` | "20–30% in 4–8 weeks" / "15–25%" tidal volume | Soften — unsourced |

## Lineage attributions (12)

Drop into a new `lineage` field on each `BreathingPageContent` entry.

### Box breathing
> Named and popularized by former US Navy SEAL commander Mark Divine, who taught it through his SEALFIT and Unbeatable Mind programs starting in the 2010s. The equal-ratio pattern itself is older — it appears as Sama Vritti in classical pranayama and in earlier military "tactical" breathing protocols that predate the "box" name.

### 4-7-8 breathing
> Developed by Dr. Andrew Weil, an integrative-medicine physician at the University of Arizona, who has taught the technique since the 1990s and describes it as "a natural tranquilizer for the nervous system." Weil draws explicitly on pranayama, the breath-control limb of classical yoga, where ratio-based holds and extended exhales are foundational.

### Coherent / Resonance breathing
> Developed by Stephen Elliott of COHERENCE LLC in 2005, building on the heart-rate-variability biofeedback research of Paul Lehrer and Evgeny Vaschillo, who identified the cardiovascular "resonance frequency" near 0.1 Hz (about six breaths per minute). Mainstreamed by science journalist James Nestor's 2020 book *Breath*, which fixed the rounded "5.5 breaths per minute" cadence in popular awareness.

### Physiological sigh
> The double-inhale-then-long-exhale reflex was mapped to a specific cluster of brainstem neurons by Jack Feldman (UCLA) and Mark Krasnow (Stanford), reported in *Science* in 2017. Stanford psychiatrist David Spiegel, neurobiologist Andrew Huberman, and Melis Yilmaz Balban turned that finding into a five-minute protocol — "cyclic sighing" — in a 2023 randomized study published in *Cell Reports Medicine*.

### Wim Hof Method
> Developed by Dutch athlete Wim Hof, who pairs hyperventilation-style breathing cycles with cold exposure and concentration. Hof acknowledges parallels to the Tibetan Buddhist practice of Tummo (inner-heat yoga) but frames his own method as derived from direct experimentation with cold rather than from religious lineage.

### Pursed-lip breathing
> Developed in clinical pulmonary medicine and respiratory therapy as a tool for patients with chronic obstructive pulmonary disease (COPD) — there is no single originator. It became a standard component of pulmonary rehabilitation programs and was endorsed by the American College of Chest Physicians and AACVPR in 1997.

### Nadi Shodhana
> A pranayama practice from the Hatha Yoga tradition, documented in the 15th-century *Hatha Yoga Pradipika* and the *Gheranda Samhita*, where it is described as a purification of the *nadis* (subtle energy channels) and is taught as a foundation for more advanced breath work.

### Ujjayi
> A pranayama with a slight glottal constriction that produces an audible whisper-like breath. It is described in B. K. S. Iyengar's *Light on Yoga* (1966) and is the continuous breath of Ashtanga vinyasa yoga as taught by K. Pattabhi Jois — both of whom studied under Tirumalai Krishnamacharya in 20th-century Mysore.

### Belly / diaphragmatic breathing
> There is no single originator. Diaphragm-led breathing is taught in clinical respiratory therapy, in pranayama (where it underlies most slower techniques), and in somatic and martial-arts traditions including tai chi — converging on the same physiology from different lineages.

### Buteyko
> Developed by Soviet physician Konstantin Buteyko (1923–2003), who began testing the method clinically in 1959 at the Leningrad Institute of Pulmonology. It is built around the premise that chronic over-breathing depletes carbon dioxide and that retraining toward slower, lighter, nasal breathing can ease asthma and related conditions.

### Tummo
> A Tibetan Vajrayana Buddhist inner-heat practice, transmitted as one of the Six Yogas of Naropa. The lineage runs from the Indian mahasiddhas Tilopa (c. 988–1069 CE) and Naropa to the Tibetan translator Marpa, and through Milarepa it became central to the Kagyu school.

### Breath of Fire (Kapalabhati)
> Documented as Kapalabhati ("skull-shining breath") in the 15th-century *Hatha Yoga Pradipika*, where it appears among the six purification practices (*shatkarmas*) of Hatha Yoga. The "Breath of Fire" name and faster, sustained variation were popularized in the West through the Kundalini Yoga lineage taught by Yogi Bhajan from the late 1960s onward.

## Citation database (47 placements across 22 pages)

Citation map applied to body copy as inline `[text](URL)` hyperlinks. Wellness-class density: 1–3 per page max. See `src/data/breathing-pages.ts` and `src/data/use-case-pages.ts` for actual placements.

### Foundational sources
- **Balban et al. 2023** — *Cell Reports Medicine*. RCT, n=100, 28-day breathwork. https://doi.org/10.1016/j.xcrm.2022.100895
- **Lehrer & Gevirtz 2014** — *Frontiers in Psychology*. Canonical HRV biofeedback review. https://doi.org/10.3389/fpsyg.2014.00756
- **Joseph et al. 2005** — *Hypertension*. Slow breathing → baroreflex sensitivity. https://doi.org/10.1161/01.HYP.0000179581.68566.7d
- **Russo et al. 2017** — *Breathe*. Slow breathing physiology review. https://doi.org/10.1183/20734735.009817
- **Zaccaro et al. 2018** — *Frontiers in Human Neuroscience*. Slow breathing systematic review. https://doi.org/10.3389/fnhum.2018.00353
- **Steffen et al. 2017** — *Frontiers in Public Health*. Resonance frequency mood/BP. https://doi.org/10.3389/fpubh.2017.00222

### Technique-specific
- **Vierra et al. 2022** — *Physiological Reports*. 4-7-8 HRV. https://doi.org/10.14814/phy2.15389
- **Musa et al. 2025** — *Jurnal Respirologi Indonesia*. 4-7-8 sleep RCT. https://doi.org/10.36497/jri.v45i4.948
- **Aktaş & İlgin 2023** — *Obesity Surgery*. 4-7-8 anxiety RCT. https://doi.org/10.1007/s11695-022-06405-1
- **Li et al. 2016** — *Nature*. Sigh circuit (mouse). https://doi.org/10.1038/nature16964
- **Yackle et al. 2017** — *Science*. preBötC arousal (mouse). https://doi.org/10.1126/science.aai7984
- **Kox et al. 2014** — *PNAS*. Wim Hof endotoxin. https://doi.org/10.1073/pnas.1322174111
- **Zwaag et al. 2022** — *Psychosomatic Medicine*. WHM dismantling. https://doi.org/10.1097/PSY.0000000000001065
- **Almahayni & Hammond 2024** — *PLoS ONE*. WHM systematic review. https://doi.org/10.1371/journal.pone.0286933
- **Buijze et al. 2016** — *PLoS ONE*. Cold shower RCT. https://doi.org/10.1371/journal.pone.0161749
- **Blades et al. 2024** — *Comp Psychoneuroendocrinology*. WHM mood RCT (null vs slow breathing). https://doi.org/10.1016/j.cpnec.2024.100272
- **Holland et al. 2012** — *Cochrane*. COPD breathing exercises. https://doi.org/10.1002/14651858.CD008250.pub2
- **Mayer et al. 2018** — *Physiotherapy*. PLB exercise meta-analysis. https://doi.org/10.1016/j.physio.2017.08.007
- **Bianchi et al. 2004** — *Chest*. PLB chest wall mechanism. https://doi.org/10.1378/chest.125.2.459
- **Ghiya 2017** — *IJRMS*. ANB systematic review. https://doi.org/10.18203/2320-6012.ijrms20173523
- **Telles et al. 2014** — ANB BP/HRV. https://doi.org/10.12659/MSMBR.892063
- **Telles et al. 2017** — ANB vigilance. https://doi.org/10.12659/msmbr.906502
- **Critchley et al. 2015** — *PLoS ONE*. Slow breathing fMRI. https://doi.org/10.1371/journal.pone.0127082
- **Santino et al. 2020** — *Cochrane*. Buteyko/asthma. https://doi.org/10.1002/14651858.CD001277.pub4
- **Cooper et al. 2003** — *Thorax*. Buteyko RCT. https://doi.org/10.1136/thorax.58.8.674

### Outcome-level
- **Leyro et al. 2021** — *Clin Psychol Rev*. Anxiety meta-analysis g=-0.68. https://doi.org/10.1016/j.cpr.2021.101980
- **Brown & Gerbarg 2005** — *J Altern Complement Med*. Anxiety/depression clinical foundations. https://doi.org/10.1089/acm.2005.11.711
- **Meuret et al. 2008** — *J Psychiatric Res*. CART panic. https://doi.org/10.1016/j.jpsychires.2007.06.005
- **Meuret et al. 2010** — *J Consult Clin Psych*. Mediator panic. https://doi.org/10.1037/a0019552
- **Tsai et al. 2015** — *Psychophysiology*. Paced breathing for insomnia. https://doi.org/10.1111/psyp.12333
- **Laborde et al. 2019** — *J Clin Med*. 30-day slow paced breathing sleep. https://doi.org/10.3390/jcm8020193
- **Chaddha et al. 2019** — *Comp Ther Med*. Slow breathing BP meta-analysis (modest +). https://doi.org/10.1016/j.ctim.2019.03.005
- **Landman et al. 2014** — *JAMA Internal Medicine*. Device-guided breathing IPD null. https://doi.org/10.1001/jamainternmed.2014.4336
- **Brook et al. 2013** — *Hypertension*. AHA Scientific Statement. https://doi.org/10.1161/HYP.0b013e318293645f
- **Tinello et al. 2022** — *J Cog Enhancement*. HRVB executive function. https://doi.org/10.1007/s41465-021-00218-3
- **Lehrer et al. 2020** — *Appl Psychophys Biofeedback*. HRVB performance meta. https://doi.org/10.1007/s10484-020-09466-z
- **Issac et al. 2023** — *J Glob Health*. Breathing & labor duration. https://doi.org/10.7189/jogh.13.04023
- **HajGhanbari et al. 2013** — *J Strength Cond Res*. RMT in athletes. https://doi.org/10.1519/JSC.0b013e318269f73f
- **Yang et al. 2022** — *Physiother Theory Pract*. PLB+diaphragmatic COPD. https://doi.org/10.1080/09593985.2020.1805834
- **Hopper et al. 2019** — *JBI*. Diaphragmatic breathing systematic review. https://doi.org/10.11124/JBISRIR-2017-003848
- **Ma et al. 2017** — *Frontiers in Psychology*. Diaphragmatic breathing cortisol/attention. https://doi.org/10.3389/fpsyg.2017.00874
- **Tsakona et al. 2025** — *Children*. Pediatric diaphragmatic breathing. https://doi.org/10.3390/children12010059
- **Dunning et al. 2019** — *J Child Psychol Psych*. Mindfulness in youth meta. https://doi.org/10.1111/jcpp.12980
- **Fincham et al. 2023** — *Scientific Reports*. Breathwork meta-analysis. https://doi.org/10.1038/s41598-022-27247-y
- **Garg et al. 2023** — *Int J Cardiol*. BP meta-analysis. https://doi.org/10.1016/j.ijcrp.2023.200232

## Reference-class notes (wellness, not medical)

What peers in the wellness class consistently do (from audit of Wim Hof, Breathwrk, Othership, Calm, Headspace, Insight Timer, Nestor, mindbodygreen, Huberman, Hyman):

- Bylines are person-led, often with no formal credentials. "Founder" suffices in this class.
- Citations 0–3 per page. Inline hyperlinks on key claim phrases. NO numbered footnotes, NO DOI reference lists.
- Lineage attribution ("developed by X" / "rooted in Y tradition") replaces formal authorship as the authority signal.
- Trust elements: editorial-policy page, contact, social proof when real ("trusted by N users" only with real numbers).
- Schema: most ship default `Article` / `BlogPosting`. `HowTo` is a small differentiator nobody audited uses.

What peers DON'T do (so we shouldn't either):
- "Medically reviewed by [X], MD/RN/PT" line (only Calm in audited set)
- `MedicalWebPage` schema with `reviewedBy` / `lastReviewed`
- ICD-10 codes / `MedicalCondition` schema
- HONcode (program shut down 2022) or URAC (too expensive)
- Numbered references at article end with DOIs
