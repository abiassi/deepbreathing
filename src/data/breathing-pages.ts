import { ModeName } from "@/components/resonance/types";

export interface BreathingPageContent {
  slug: string;
  mode: ModeName;
  heroTitle: string;
  heroSubtitle: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  benefits: { title: string; description: string }[];
  practiceTips: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
}

export const breathingPages: BreathingPageContent[] = [
  {
    slug: "box",
    mode: ModeName.Box,
    heroTitle: "Box Breathing Visualizer",
    heroSubtitle: "Equal counts + gentle holds to steady arousal and attention.",
    metaTitle: "Box Breathing Visualizer – 4×4×4×4 Guided Practice",
    metaDescription:
      "Follow equal inhale–hold–exhale–hold timing. Slow, even pacing can increase vagally mediated HRV and reduce perceived stress when kept comfortable.",
    intro:
      "The orb guides four equal phases: inhale, hold, exhale, hold. Pick counts that feel easy (e.g., 3–6 seconds). Keep holds light; the goal is smoothness, not strain.",
    benefits: [
      {
        title: "Autonomic downshift",
        description:
          "Slow, even breathing increases vagally mediated heart‑rate variability (HRV) for many people—one marker of lower physiological arousal."
      },
      {
        title: "Fast, portable reset",
        description:
          "Short bouts (1–5 minutes) can lower state anxiety and respiration rate. Good between meetings, pre‑performance, or before bed."
      },
      {
        title: "Flexible pacing",
        description:
          "You can shorten counts or skip the holds on days you feel breathless or light‑headed and still get benefit from the even rhythm."
      }
    ],
    practiceTips: [
      {
        title: "Comfort first",
        description:
          "Start at 3–4 seconds per side. If you feel air hunger, dizziness, or chest tightness, shorten counts or remove holds."
      },
      {
        title: "Quiet mechanics",
        description:
          "Inhale through the nose with a gentle belly rise; keep shoulders soft. Exhale quietly through nose or pursed lips."
      },
      {
        title: "Duration",
        description:
          "Run 3–6 cycles to sample. Extend to 1–3 minutes for a clearer shift."
      }
    ],
    faqs: [
      {
        question: "Does box breathing raise HRV?",
        answer:
          "Often, yes—when the pace is slow and relaxed. For maximizing HRV amplitude, ~6 breaths/min with no holds commonly performs best in lab settings; use what feels sustainable."
      },
      {
        question: "Who should avoid long holds?",
        answer:
          "Skip or shorten holds if you’re pregnant, have cardiopulmonary disease, a history of fainting, or feel dizzy. Focus on easy, continuous breathing."
      }
    ]
  },
  {
    slug: "4-7-8",
    mode: ModeName.Relax,
    heroTitle: "4‑7‑8 Breathing Guide",
    heroSubtitle: "Long exhale cadence to calm the body quickly.",
    metaTitle: "4‑7‑8 Breathing Visualizer – Long‑Exhale Relaxation",
    metaDescription:
      "Inhale 4, hold 7 (gentle), exhale 8. Exhale‑emphasized, slow breathing lowers respiratory rate and can reduce state anxiety.",
    intro:
      "Inhale through the nose for 4 counts, hold lightly for 7, then exhale through pursed lips for 8. Keep the hold soft; reduce counts if it feels tight.",
    benefits: [
      {
        title: "Exhale‑led calming",
        description:
          "Lengthening the exhale tends to slow breathing and increase markers of parasympathetic activity (e.g., HF‑HRV) in many people."
      },
      {
        title: "Sleep wind‑down",
        description:
          "A few rounds before lights out can help shift into a quieter physiological state."
      },
      {
        title: "Simple routine",
        description:
          "Three to four cycles is a practical start. Build gradually if comfortable."
      }
    ],
    practiceTips: [
      {
        title: "Gentle holds",
        description:
          "The 7‑count hold should feel easy. If uncomfortable, try 4‑4‑6 or 4‑4‑8 and progress slowly."
      },
      {
        title: "Nasal inhale, slow release",
        description:
          "Nasal inhale with a quiet belly rise; exhale through pursed lips for a smooth, controlled ‘whoosh.’"
      },
      {
        title: "Stop if dizzy",
        description:
          "Light‑headed? Shorten counts or switch to 4‑6 (no hold) until you feel steady."
      }
    ],
    faqs: [
      {
        question: "Is there evidence specific to 4‑7‑8?",
        answer:
          "Direct trials are limited but suggest reduced state anxiety in clinical settings. Broader slow‑breathing RCTs show small‑to‑moderate improvements in stress and mood."
      },
      {
        question: "Is it okay during the day?",
        answer:
          "Yes. Use seated. If long holds feel edgy, shorten or omit them and keep the exhale longer than the inhale."
      }
    ]
  },
  {
    slug: "coherent",
    mode: ModeName.Coherent,
    heroTitle: "Coherent Breathing Trainer",
    heroSubtitle: "Breathe ~5–6 times/min to maximize HRV resonance.",
    metaTitle: "Coherent Breathing Visualizer – ~0.1 Hz Resonance",
    metaDescription:
      "Train near 0.1 Hz (about 5–6 breaths/min). This rate often maximizes respiratory sinus arrhythmia and baroreflex gain, though the exact best pace varies by person.",
    intro:
      "Match equal‑length inhales and exhales around 5–6 breaths/min. This ‘resonant’ pace tends to amplify heart‑breath coupling and is commonly used for HRV training.",
    benefits: [
      {
        title: "HRV amplification",
        description:
          "Breathing near 0.1 Hz acutely increases HRV amplitude and baroreflex sensitivity; regular practice can raise resting HRV for some."
      },
      {
        title: "Focus support",
        description:
          "Higher vagally mediated HRV correlates with better executive control in several studies. Effects on mood vs. well‑matched placebo are mixed."
      },
      {
        title: "Personal fit matters",
        description:
          "Optimal rate varies (often 4.5–6.5 breaths/min). 5‑second in/5‑second out or ~5.5‑second in/out are common starting points—adjust by feel."
      }
    ],
    practiceTips: [
      {
        title: "Stay easy",
        description:
          "Breathe quietly through the nose with a light belly rise. Avoid large tidal volumes; smoothness beats depth."
      },
      {
        title: "5–10 minutes",
        description:
          "Aim for 5 minutes daily; 10+ minutes builds a clearer HRV training effect."
      },
      {
        title: "Avoid over‑breathing",
        description:
          "If you feel tingly or light‑headed, you may be ventilating too much. Soften the inhale or shorten the session."
      }
    ],
    faqs: [
      {
        question: "Why ~0.1 Hz?",
        answer:
          "At this pace, cardiovascular and respiratory loops tend to synchronize, maximizing respiratory sinus arrhythmia and baroreflex effects in many adults."
      },
      {
        question: "Does coherent breathing beat other patterns for mood?",
        answer:
          "Not reliably. A large placebo‑controlled RCT found similar mental‑health gains vs. matched paced breathing at 12 breaths/min, though both improved with practice."
      }
    ]
  },
  {
    slug: "physiological-sigh",
    mode: ModeName.Sigh,
    heroTitle: "Physiological Sigh Coach",
    heroSubtitle: "Double inhale, long exhale—rapid downshift.",
    metaTitle: "Physiological Sigh Visualizer – Fast‑Acting Relief",
    metaDescription:
      "Two inhales followed by a long exhale. Sighs reinflate alveoli and can quickly lower arousal; brief daily practice improved mood in RCTs.",
    intro:
      "Take a deep nasal inhale, add a small top‑up inhale, then exhale slowly through the mouth for ~6–10 seconds. Use during spikes of stress or as a short daily drill.",
    benefits: [
      {
        title: "Rapid calming",
        description:
          "Daily 5‑minute exhale‑focused cyclic sighing improved mood and lowered respiratory rate more than mindfulness in a month‑long RCT."
      },
      {
        title: "Better lung mechanics",
        description:
          "Sighs reinflate collapsed alveoli and improve compliance, supporting effective gas exchange. The double‑inhale pattern leverages this reflex."
      },
      {
        title: "Easy to deploy",
        description:
          "Helpful in the moment (a few cycles) or as a short practice block. No equipment, minimal instruction."
      }
    ],
    practiceTips: [
      {
        title: "Keep the top‑up small",
        description:
          "Let the second inhale gently fill the upper lungs without shrugging the shoulders."
      },
      {
        title: "Long, relaxed exhale",
        description:
          "Exhale until comfortably empty; avoid forceful squeezing."
      },
      {
        title: "As‑needed or timed",
        description:
          "Use 1–3 sighs for an in‑the‑moment reset. For training effects, run 2–5 minutes."
      }
    ],
    faqs: [
      {
        question: "How many repetitions?",
        answer:
          "Use a few cycles when stressed. In research, 5 minutes daily produced the clearest changes in mood and breathing rate."
      },
      {
        question: "Is it better than box breathing?",
        answer:
          "In one month‑long RCT, exhale‑focused cyclic sighing outperformed box breathing on mood and respiratory‑rate change."
      }
    ]
  }
];

export const breathingPageMap: Record<string, BreathingPageContent> = Object.fromEntries(
  breathingPages.map((page) => [page.slug, page])
) as Record<string, BreathingPageContent>;

export const modeToBreathingPage = breathingPages.reduce(
  (acc, page) => {
    acc[page.mode] = page;
    return acc;
  },
  {} as Partial<Record<ModeName, BreathingPageContent>>
);
