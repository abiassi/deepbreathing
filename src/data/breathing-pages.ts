import { ModeName } from "@/components/resonance/types";

export interface HeroContent {
  title: string;
  subtitle: string;
  intro: string;
}

export interface MetaContent {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  author: string;
  reviewer: string;
  datePublished: string;
  dateModified: string;
}

export interface BodySection {
  heading: string;
  content: string;
}

export interface Benefit {
  title: string;
  description: string;
}

export interface PracticeTip {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  instruction: string;
  duration?: string;
}

export interface HowToContent {
  totalTime: string;
  difficulty: string;
  tools: string[];
  supplies: string[];
  steps: HowToStep[];
}

export interface UseCase {
  name: string;
  description: string;
  dose?: string;
}

export interface ResearchStudy {
  title: string;
  summary: string;
  url?: string;
}

export interface ResearchQuote {
  text: string;
  attribution: string;
}

export interface ResearchContent {
  studies: ResearchStudy[];
  safety: string[];
  quotes: ResearchQuote[];
}

export interface RelatedPattern {
  slug: string;
  reason: string;
}

export interface RelatedUseCase {
  slug: string;
  title: string;
  teaser: string;
}

export interface VideoEmbed {
  youtubeId: string;
  title: string;
  description: string;
}

export interface BreathingPageContent {
  slug: string;
  mode: ModeName;
  hero: HeroContent;
  meta: MetaContent;
  body: BodySection[];
  benefits: Benefit[];
  practiceTips: PracticeTip[];
  faqs: FaqItem[];
  howTo: HowToContent;
  useCases: UseCase[];
  research: ResearchContent;
  related: RelatedPattern[];
  relatedUseCases?: RelatedUseCase[];
  keywords: string[];
  synonyms: string[];
  frequency: string;
  video?: VideoEmbed;
}

export const breathingPages: BreathingPageContent[] = [
  {
    slug: "box",
    mode: ModeName.Box,
    hero: {
      title: "Box Breathing (4‑4‑4‑4) Visualizer",
      subtitle: "Equal counts to steady arousal and sharpen focus.",
      intro: "Box (square) breathing uses four equal phases: inhale, hold, exhale, hold. The pattern slows respiration and stabilizes attention. Keep counts comfortable (e.g., 3–6 seconds each). If holds feel tight or dizzying, shorten them or remove holds and keep the rhythm even."
    },
    meta: {
      title: "Box Breathing: Navy SEAL Technique to Stop Anxiety Fast (Free Tool)",
      description: "The same breathing technique Navy SEALs use before combat. Stop panic attacks in 1 minute. Free visualizer + Stanford research. Try now.",
      ogTitle: "Box Breathing: Navy SEAL Technique to Stop Anxiety Fast",
      ogDescription: "The same breathing technique Navy SEALs use before combat. Stop panic attacks in 1 minute. Free visualizer + research-backed method.",
      ogImage: "og/breathe-box.png",
      twitterTitle: "Box Breathing: Navy SEAL Technique to Stop Anxiety Fast",
      twitterDescription: "The same breathing technique Navy SEALs use before combat. Stop anxiety in 60 seconds. Free visualizer.",
      author: "Resonance Editorial Team",
      reviewer: "",
      datePublished: "2025-11-17",
      dateModified: "2026-01-06"
    },
    body: [
      {
        heading: "What it is",
        content: "Four equal phases: inhale (4s), hold (4s), exhale (4s), hold (4s). Adjust counts to 3–6 seconds for comfort. Breathe quietly through the nose, keep shoulders and jaw soft, let your belly lead. If holds feel uncomfortable or cause dizziness, drop them and maintain an even inhale/exhale instead."
      },
      {
        heading: "Why Navy SEALs Use Box Breathing",
        content: "Box breathing became a cornerstone of Navy SEAL training through Mark Divine, a retired SEAL Commander who introduced it to BUD/S (Basic Underwater Demolition/SEAL) training in the early 2000s. SEALs use it before high-stakes missions, during underwater drownproofing exercises, and in any situation where panic could be fatal. The technique works because the structured counting occupies the prefrontal cortex—the thinking brain—while the slow rhythm activates the parasympathetic nervous system. This dual action interrupts the amygdala's fear response, allowing SEALs to stay calm and make clear decisions under fire. Divine calls it 'taking control of your physiology before your physiology takes control of you.' The same technique that helps operators stay composed during combat works just as well before your next presentation, difficult conversation, or sleepless night."
      },
      {
        heading: "Benefits",
        content: "Slows breathing and increases parasympathetic tone in 1–5 minutes. Easy to remember and use anywhere. Flexible dosing: shorten, lengthen, or skip holds to fit your comfort."
      },
      {
        heading: "When to use",
        content: "Before meetings, between tasks, after stress, or before bed. Great for people who like clear structure. For maximum HRV boost, coherent breathing (5–6 breaths/min, no holds) often works better."
      },
      {
        heading: "When to skip",
        content: "Avoid strained holds if pregnant, have cardiopulmonary disease, syncope history, or high blood pressure. If dizzy or tingly, drop the holds or pause. During panic, try a physiological sigh instead."
      }
    ],
    benefits: [
      {
        title: "Steadies arousal",
        description: "Slow, even pacing increases parasympathetic activity and can lower perceived stress in minutes."
      },
      {
        title: "Portable structure",
        description: "Memorable 4‑step rhythm you can use at your desk, during transit, or on the sidelines."
      },
      {
        title: "Flexible dosing",
        description: "Adjust counts (3–6 s) or remove holds to keep comfort and CO₂ balance."
      }
    ],
    practiceTips: [
      {
        title: "Comfort over intensity",
        description: "Start at 3–4‑second sides. If you feel air hunger or dizziness, shorten holds or skip them and keep breaths light and quiet."
      },
      {
        title: "Nasal, quiet, low",
        description: "Inhale through the nose with a gentle belly rise; soften the jaw and shoulders; exhale unforced through nose or pursed lips."
      },
      {
        title: "Short sets, repeat",
        description: "Run 60–180 seconds, check in, then add another set if helpful."
      }
    ],
    faqs: [
      {
        question: "Does box breathing increase HRV as well as other patterns?",
        answer: "Slow breathing generally increases vagally mediated HRV. A 2025 comparative study found 6 breaths/min (with equal or slightly longer exhales) increased HRV more than square (box) or 4‑7‑8 in healthy young adults, with a small risk of over‑breathing at 6 bpm. Practically: box breathing is still effective for many users and may be easier to adhere to; if your goal is maximal HRV amplitude, try equal in/out at ~5–6 breaths/min with minimal or no holds."
      },
      {
        question: "How many cycles and how often should I practice?",
        answer: "For quick resets, use 1–3 minutes (about 4–10 cycles at 4‑4‑4‑4). For deeper effects, stack 5–10 minutes of slow, comfortable breathing daily. Reviews of breathing interventions suggest sessions ≥5 minutes and repeated practice over weeks outperform one‑off, very short sessions for stress reduction."
      },
      {
        question: "Are the holds necessary?",
        answer: "No. Benefits mainly come from slow, smooth pacing. Holds can help some people focus but may feel uncomfortable or air‑hungry for others. If holds feel strained, especially during pregnancy or with cardiac/pulmonary conditions, shorten them or omit holds. Keep an even inhale/exhale at a comfortable rate."
      },
      {
        question: "Is box breathing safe in pregnancy?",
        answer: "Gentle, continuous breathing is generally recommended; many prenatal guidelines advise avoiding prolonged or forceful breath holding. If you’re pregnant, favor short, easy counts and skip holds. Stop if you feel dizzy or breathless and consult your clinician for personalized advice."
      },
      {
        question: "I felt light‑headed. What went wrong?",
        answer: "Likely over‑breathing (exhaling more CO₂ than you produce). Fixes: make breaths smaller and quieter, shorten holds, switch to equal in/out without holds, or pause and resume later. Capnometry studies in HRV training monitor this risk; you can self‑monitor by prioritizing comfort over depth."
      },
      {
        question: "Why do Navy SEALs use box breathing?",
        answer: "Navy SEALs use box breathing because it's simple to remember under stress and reliably activates the parasympathetic nervous system within 60–90 seconds. Mark Divine, a retired SEAL Commander, introduced it to BUD/S training after using it himself during deployments. SEALs practice it before missions, during stressful evolutions like underwater drownproofing, and whenever they need to stay calm and think clearly. The structured 4-count rhythm gives the mind something to focus on, which prevents spiraling thoughts, while the slow pace physiologically lowers heart rate and cortisol. It's been battle-tested in the most high-stakes situations imaginable."
      }
    ],
    howTo: {
      totalTime: "2–5 minutes",
      difficulty: "easy",
      tools: [
        "Chair or comfortable seat",
        "On‑screen timer or haptics (optional)"
      ],
      supplies: [],
      steps: [
        {
          name: "Set posture",
          instruction: "Sit tall, shoulders soft, mouth closed, breathe through the nose.",
          duration: "10–15 seconds"
        },
        {
          name: "Inhale",
          instruction: "Inhale gently through the nose; low belly rises.",
          duration: "4 seconds"
        },
        {
          name: "Hold (top)",
          instruction: "Pause lightly; no straining.",
          duration: "4 seconds"
        },
        {
          name: "Exhale",
          instruction: "Exhale quietly (nose or pursed lips); belly falls.",
          duration: "4 seconds"
        },
        {
          name: "Hold (bottom)",
          instruction: "Pause lightly; stay relaxed.",
          duration: "4 seconds"
        },
        {
          name: "Repeat",
          instruction: "Continue for 6–12 cycles. If uncomfortable, shorten counts or remove holds.",
          duration: "1–4 minutes"
        }
      ]
    },
    useCases: [
      {
        name: "Pre‑meeting composure",
        description: "One minute to reduce arousal and clear attention before you speak.",
        dose: "60–90 seconds at 3–4 s per side"
      },
      {
        name: "Between tasks reset",
        description: "Brief pattern break to shift state between focus blocks.",
        dose: "2 minutes at 4–5 s per side"
      },
      {
        name: "Wind‑down before bed",
        description: "Ease into relaxation; remove holds if they feel edgy at night.",
        dose: "3 minutes at 3–4 s per side, holds optional"
      }
    ],
    research: {
      studies: [
        {
          title: "Laborde et al., 2022 meta‑analysis (VSB → vmHRV)",
          summary: "Systematic review/meta‑analysis found voluntary slow breathing increases vagally mediated HRV during sessions, acutely after a session, and after multi‑session training.",
          url: "https://pubmed.ncbi.nlm.nih.gov/35623448/"
        },
        {
          title: "Marchant et al., 2025 comparative trial",
          summary: "In 84 adults, 6 breaths/min increased HRV more than square (box) or 4‑7‑8; no meaningful BP or mood changes; mild over‑breathing occurred at 6 bpm.",
          url: "https://pubmed.ncbi.nlm.nih.gov/39864026/"
        },
        {
          title: "Steffen et al., 2017 RCT (resonance vs +1 vs control)",
          summary: "Resonance‑frequency breathing improved HRV and reduced blood‑pressure reactivity to a stressor vs control; mood improved post‑practice.",
          url: "https://pubmed.ncbi.nlm.nih.gov/28890890/"
        },
        {
          title: "Fincham et al., 2023 meta‑analysis (breathwork & stress)",
          summary: "Across RCTs, breathwork produced small‑to‑moderate reductions in subjective stress, anxiety, and depressive symptoms vs non‑breathwork controls.",
          url: "https://pubmed.ncbi.nlm.nih.gov/36624160/"
        }
      ],
      safety: [
        "Prioritize comfort: smaller, quieter breaths; avoid straining on holds.",
        "Pregnancy: avoid prolonged/forceful breath holding; favor gentle continuous breathing.",
        "Cardiopulmonary disease, uncontrolled hypertension, syncope history: avoid strong holds; practice seated and consult a clinician.",
        "Stop if dizzy, tingly, or chest‑tight; resume with shorter counts or remove holds."
      ],
      quotes: []
    },
    related: [
      {
        slug: "coherent",
        reason: "For maximal HRV amplitude, equal in/out at ~5–6 breaths/min with minimal holds often outperforms box."
      },
      {
        slug: "physiological-sigh",
        reason: "Fast downshift during spikes of stress; 1–3 cycles can relieve acute arousal quickly."
      }
    ],
    relatedUseCases: [
      {
        slug: "anxiety",
        title: "Anxiety Relief",
        teaser: "Stop racing thoughts and chest tightness with the Navy SEAL breathing method"
      },
      {
        slug: "public-speaking",
        title: "Public Speaking & Stage Fright",
        teaser: "The Navy SEAL method to stop stage fright in 60 seconds"
      }
    ],
    keywords: [
      "box breathing",
      "square breathing",
      "4‑4‑4‑4 breathing",
      "four‑square breathing",
      "equal breathing",
      "tactical breathing",
      "paced breathing",
      "HRV breathing",
      "breath holds",
      "stress reduction breathing",
      "parasympathetic activation",
      "calming techniques"
    ],
    synonyms: [
      "square breathing",
      "four‑square",
      "4×4 breathing",
      "4‑4‑4‑4",
      "equal breathing",
      "sama vritti pranayama"
    ],
    frequency: "Daily, 1–3 minutes for resets; optionally 5–10 minutes for HRV training",
    video: {
      youtubeId: "GZzhk9jEkkI",
      title: "Box Breathing with Mark Divine (Navy SEAL Commander)",
      description: "Former Navy SEAL Commander Mark Divine teaches the box breathing technique he introduced to BUD/S training—the same method SEALs use to stay calm under pressure."
    }
  },
  {
    slug: "4-7-8",
    mode: ModeName.Relax,
    hero: {
      title: "4‑7‑8 Breathing Visualizer",
      subtitle: "Long‑exhale cadence to downshift quickly.",
      intro: "Inhale for 4 counts, hold lightly for 7, exhale for 8. This exhale‑emphasized pattern slows breathing, often increases vagal markers, and helps many people settle into sleep or reduce acute tension. Keep holds gentle; shorten or skip them if uncomfortable."
    },
    meta: {
      title: "4-7-8 Breathing: Fall Asleep in 2 Minutes (Dr. Weil's Method)",
      description: "Dr. Andrew Weil's 'natural tranquilizer' breathing technique. Fall asleep faster and calm anxiety in minutes. Free guided visualizer. Try tonight.",
      ogTitle: "4-7-8 Breathing: Fall Asleep in 2 Minutes (Dr. Weil's Method)",
      ogDescription: "Dr. Weil's 'natural tranquilizer' technique. Fall asleep faster and calm anxiety in minutes. Free visualizer with research-backed method.",
      ogImage: "og/breathe-4-7-8.png",
      twitterTitle: "4-7-8 Breathing: Fall Asleep in 2 Minutes",
      twitterDescription: "Dr. Weil's 'natural tranquilizer' breathing technique. Fall asleep faster in just minutes. Free visualizer.",
      author: "Resonance Editorial Team",
      reviewer: "",
      datePublished: "2025-11-17",
      dateModified: "2025-12-07"
    },
    body: [
      {
        heading: "What it is",
        content: "Inhale (4s), hold gently (7s), exhale slowly (8s). The long exhale is what calms. Breathe quietly through the nose, keep shoulders and jaw soft. If the hold feels tense or triggers dizziness, shorten it or drop it—keep the exhale longer than the inhale."
      },
      {
        heading: "Benefits",
        content: "Long exhales slow breathing and activate the parasympathetic system in minutes. Good for winding down before bed or settling during stress. Simple, memorable, and no equipment needed."
      },
      {
        heading: "When to use",
        content: "Before bed, during daytime tension, or after stressful events. Great for people seeking calm without deep focus. Works well for anxiety spikes and sleep onset."
      },
      {
        heading: "When to skip",
        content: "Avoid strained holds if pregnant, have cardiopulmonary disease, syncope history, or panic with holding breath. If dizzy or air-hungry, drop the hold entirely and just lengthen the exhale. During acute panic, try a physiological sigh instead."
      }
    ],
    benefits: [
      {
        title: "Exhale‑led calming",
        description: "Long exhales slow respiration and often increase parasympathetic markers during practice."
      },
      {
        title: "Sleep wind‑down",
        description: "A few rounds at bedtime can reduce pre‑sleep arousal and help some sleepers settle."
      },
      {
        title: "Simple & portable",
        description: "Memorable 4‑7‑8 count you can do seated, in bed, or in transit. No gear needed."
      }
    ],
    practiceTips: [
      {
        title: "Make holds gentle",
        description: "The 7‑count pause should feel light. If edgy, use 4‑4‑8 or 4‑6‑8 for a week, then progress."
      },
      {
        title: "Smaller, quieter breaths",
        description: "Avoid big gulps of air. Keep tidal volume modest to prevent dizziness from over‑breathing."
      },
      {
        title: "Comfort pacing",
        description: "Counts are flexible. Start with 3‑5‑6 or 4‑4‑6; extend only if it stays effortless."
      }
    ],
    faqs: [
      {
        question: "Is it '4 7 8' or '4-7-8' breathing?",
        answer: "Both '4 7 8 breathing' and '4-7-8 breathing' refer to the same technique—the numbers represent the count for each phase: inhale for 4 counts, hold for 7 counts, exhale for 8 counts. Whether written with spaces (4 7 8) or hyphens (4-7-8), the breathing timer works the same way. This technique is also called the 'relaxing breath' or Dr. Weil's breathing method."
      },
      {
        question: "Is there direct evidence for 4‑7‑8?",
        answer: "Direct trials are limited but growing. A randomized clinical trial in post‑bariatric patients reported lower post‑test state anxiety in a 4‑7‑8 group compared with deep‑breathing and usual‑care groups. In healthy adults, a controlled study found 4‑7‑8 increased high‑frequency HRV and lowered heart rate and systolic blood pressure within a session, though between‑group differences were small. Larger comparisons often favor ~5–6 breaths/min equal in/out for maximal HRV amplitude, but 4‑7‑8 remains useful for exhale‑led calming."
      },
      {
        question: "How many rounds and how often?",
        answer: "For a quick reset, run 3–4 cycles. For wind‑down, 1–3 minutes works for many; stop if you feel light‑headed. Reviews suggest sessions ≥5 minutes and repeated practice deliver more reliable stress reduction than very brief, one‑off sessions. You can mix shorter 4‑7‑8 sets during the day with a longer slow‑breathing session elsewhere."
      },
      {
        question: "Do I need the 7‑second hold?",
        answer: "No. Benefits mainly come from slow, smooth, exhale‑emphasized breathing. If holds feel uncomfortable or trigger air hunger, shorten them or remove holds entirely (e.g., 4‑6 or 4‑8). The exhale should be longer than the inhale and unforced."
      },
      {
        question: "What are the best 4-7-8 settings for sleep?",
        answer: "For sleep, use 3-4 cycles of 4-7-8 breathing lying in bed with lights off. Start with the 1x speed multiplier and slow down to 0.8x if comfortable. If the 7-second hold feels too long, try 4-5-8 or 4-4-8 instead. Combine with other sleep hygiene: consistent bedtime, no screens 30 minutes prior, and a cool, dark room. Many find it works best as the last thing before sleep."
      },
      {
        question: "Is 4‑7‑8 safe in pregnancy?",
        answer: "Gentle, continuous breathing is preferred during pregnancy; many guidelines advise avoiding prolonged or forceful breath holding. If you are pregnant, skip the 7‑count hold, keep breaths easy, and stop if you feel dizzy or breathless. Consult your clinician for personalized guidance."
      }
    ],
    howTo: {
      totalTime: "1–4 minutes",
      difficulty: "easy",
      tools: [
        "Chair or bed",
        "On‑screen timer or haptics (optional)"
      ],
      supplies: [],
      steps: [
        {
          name: "Set posture",
          instruction: "Sit or lie comfortably. Shoulders and jaw relaxed. Nasal breathing.",
          duration: "10–15 seconds"
        },
        {
          name: "Inhale",
          instruction: "Inhale gently through the nose.",
          duration: "4 seconds"
        },
        {
          name: "Hold (soft)",
          instruction: "Pause lightly at the top without straining.",
          duration: "7 seconds"
        },
        {
          name: "Exhale",
          instruction: "Exhale slowly through pursed lips (or nose) with a controlled whoosh.",
          duration: "8 seconds"
        },
        {
          name: "Repeat",
          instruction: "Run 3–6 cycles. If uncomfortable, shorten counts or remove the hold and keep exhale longer than inhale.",
          duration: "1–3 minutes"
        }
      ]
    },
    useCases: [
      {
        name: "Sleep onset",
        description: "Reduce pre‑sleep arousal and lengthen exhales before lights out.",
        dose: "3–4 cycles; repeat once if needed"
      },
      {
        name: "Daytime calm",
        description: "Quick downshift before presentations or after tense interactions.",
        dose: "1–2 minutes; use seated"
      },
      {
        name: "Middle‑of‑the‑night wake",
        description: "Quiet, exhale‑focused cycles without bright screens to avoid re‑arousal.",
        dose: "1–3 minutes; skip holds if edgy"
      }
    ],
    research: {
      studies: [
        {
          title: "Aktaş & İlgin 2023 (RCT, post‑bariatric)",
          summary: "4‑7‑8 group showed lower post‑test state anxiety vs deep‑breathing and usual‑care; QoL improved in deep‑breathing group.",
          url: "https://pubmed.ncbi.nlm.nih.gov/36480101/"
        },
        {
          title: "Vierra et al. 2022 (controlled, healthy adults)",
          summary: "4‑7‑8 increased HF‑HRV and lowered HR/SBP within a session; between‑group differences small.",
          url: "https://pubmed.ncbi.nlm.nih.gov/35822447/"
        },
        {
          title: "Laborde et al. 2022 (systematic review/meta‑analysis)",
          summary: "Voluntary slow breathing increased vagally mediated HRV during and after sessions and after multi‑session training.",
          url: "https://pubmed.ncbi.nlm.nih.gov/35623448/"
        },
        {
          title: "Shao et al. 2024 (systematic review/meta‑analysis)",
          summary: "Slow‑paced breathing showed reliable short‑term cardiovascular effects and modest reductions in negative emotions.",
          url: "https://link.springer.com/article/10.1007/s12671-023-02294-2"
        },
        {
          title: "Tsai et al. 2015; Kuula et al. 2020 (sleep)",
          summary: "Pre‑bed slow breathing improved sleep metrics in small trials (reduced awakenings, better efficiency) in insomniac samples.",
          url: "https://pubmed.ncbi.nlm.nih.gov/25234581/"
        }
      ],
      safety: [
        "Practice seated or lying down if dizzy or breathless; keep breaths small and quiet.",
        "Pregnancy: avoid prolonged/forceful breath holding; prefer gentle continuous breathing.",
        "Cardiopulmonary disease, uncontrolled hypertension, syncope history: skip long holds; consult a clinician.",
        "Stop if you feel tingling, chest tightness, or air hunger; resume later with shorter counts or no hold."
      ],
      quotes: []
    },
    related: [
      {
        slug: "coherent",
        reason: "For HRV training, equal in/out near 5–6 breaths/min often maximizes HRV amplitude."
      },
      {
        slug: "physiological-sigh",
        reason: "Rapid relief during stress spikes; 1–3 cycles can downshift arousal quickly."
      }
    ],
    relatedUseCases: [
      {
        slug: "sleep",
        title: "Better Sleep",
        teaser: "Fall asleep faster with the 'natural tranquilizer' technique"
      },
      {
        slug: "high-blood-pressure",
        title: "Blood Pressure Support",
        teaser: "Naturally support healthy blood pressure with slow breathing"
      },
      {
        slug: "pregnancy",
        title: "Pregnancy & Labor",
        teaser: "Safe, modified 4-7-8 breathing for pregnancy anxiety and labor preparation"
      }
    ],
    keywords: [
      "4-7-8 breathing",
      "4 7 8 breathing",
      "4-7-8 breathing timer",
      "4 7 8 breathing timer",
      "4-7-8 breathing for sleep",
      "relaxing breath",
      "long exhale breathing",
      "paced breathing for sleep",
      "breathwork for anxiety",
      "HRV breathing",
      "pranayama breathing",
      "Dr. Weil breathing",
      "slow breathing technique"
    ],
    synonyms: [
      "4‑7‑8 technique",
      "relaxing breath",
      "pranayama‑inspired breathing"
    ],
    frequency: "Nightly 3–4 cycles before bed; optional 1–3 minutes during daytime stress",
    video: {
      youtubeId: "YRPh_GaiL8s",
      title: "Dr. Andrew Weil Demonstrates the 4-7-8 Breathing Technique",
      description: "Dr. Andrew Weil, the Harvard-trained physician who popularized the 4-7-8 breath, demonstrates his 'natural tranquilizer for the nervous system' technique for sleep and anxiety relief."
    }
  },
  {
    slug: "coherent",
    mode: ModeName.Coherent,
    hero: {
      title: "Coherent Breathing Trainer",
      subtitle: "Equal inhale/exhale near 0.1 Hz to amplify HRV.",
      intro: "Breathe ~5–6 times per minute with equal inhales and exhales (e.g., 5–6 seconds each). This pace often maximizes respiratory–cardiovascular coupling and baroreflex engagement, acutely boosting HRV. Keep breaths small and quiet; comfort beats depth. If dizzy or air‑hungry, make breaths smaller or pause."
    },
    meta: {
      title: "Coherent Breathing: The Science of 5 Breaths/Min (Free Trainer)",
      description: "Why 5-6 breaths per minute maximizes HRV and trains stress resilience. The science, research, and a free interactive trainer. Equal inhale/exhale, no holds.",
      ogTitle: "Coherent Breathing: The Science of 5 Breaths/Min",
      ogDescription: "Learn why 5-6 breaths/min maximizes HRV. The research behind coherent breathing + free interactive trainer.",
      ogImage: "og/breathe-coherent.png",
      twitterTitle: "Coherent Breathing: Science + Free Trainer",
      twitterDescription: "Why 5-6 breaths/min maximizes HRV. The research + free interactive trainer.",
      author: "Resonance Editorial Team",
      reviewer: "",
      datePublished: "2025-11-17",
      dateModified: "2026-01-09"
    },
    body: [
      {
        heading: "What it is",
        content: "Equal inhale and exhale at 5–6 breaths per minute (5s inhale, 5s exhale). Keep breaths quiet and small; let your belly lead. No holds. This pace aligns your heart rhythm and breath, maximizing HRV during the session."
      },
      {
        heading: "Benefits",
        content: "Highest HRV during practice. Steadies stress response and supports calm focus. Most reliable when practiced regularly. Good for training your nervous system."
      },
      {
        heading: "When to use",
        content: "Before deep work, creative sessions, or between task blocks. Daily practice (5–10 min) trains your nervous system; shorter sessions (2–3 min) help with pre-performance jitters."
      },
      {
        heading: "When to skip",
        content: "If dizzy or air-hungry, make breaths smaller or shorten the session. Avoid straining if pregnant, have cardiopulmonary disease, syncope history, or high blood pressure. If panic or strong air hunger arises, switch to a physiological sigh for faster relief."
      }
    ],
    benefits: [
      {
        title: "Max HRV amplitude",
        description: "Breathing ~5–6 bpm often maximizes RSA and baroreflex effects during practice."
      },
      {
        title: "Steadier stress response",
        description: "Can reduce blood‑pressure reactivity to stressors in lab settings."
      },
      {
        title: "Focus friendly",
        description: "Equal, quiet pacing supports sustained attention without drowsiness."
      }
    ],
    practiceTips: [
      {
        title: "Smooth, not deep",
        description: "Keep breaths small/quiet to avoid over‑breathing. If light‑headed, make inhales gentler or shorten the session."
      },
      {
        title: "Pick a starter tempo",
        description: "Try 5:5 s or 5.5:5.5 s (≈5–6 bpm). Adjust within 4.5–6.5 bpm to find your comfortable zone."
      },
      {
        title: "Time box it",
        description: "Begin with 5 minutes. Add another 5 if it still feels easy and calm."
      }
    ],
    faqs: [
      {
        question: "What makes coherent breathing different from other slow‑breathing patterns?",
        answer: "Coherent breathing deliberately targets ~0.1 Hz, where heart‑rate and blood‑pressure oscillations resonate. This often yields the largest HRV amplitude and stronger baroreflex engagement than other rates. Reviews and lab studies show immediate increases in HRV and baroreflex markers at ~5–6 breaths/min. Individual optima vary (roughly 4.5–6.5 breaths/min), so slight adjustments (e.g., 5.0 vs 5.5 s) can matter. If you just want calm, any comfortable slow pace helps; for maximal HRV amplitude, coherent is a strong default."
      },
      {
        question: "Does coherent breathing improve mental health outcomes?",
        answer: "A large randomized, placebo‑controlled trial found coherent breathing (~5.5 breaths/min, ~10 min/day for 4 weeks) did not outperform a well‑designed paced‑breathing placebo (12 breaths/min) on mental‑health and wellbeing outcomes, though both groups improved from baseline. Meta‑analyses of HRV biofeedback and breathwork more broadly show small‑to‑moderate benefits on stress, anxiety, and depressive symptoms with practice. Expect modest subjective gains; the physiological HRV boost is robust during sessions."
      },
      {
        question: "How do I find my best rate?",
        answer: "Most people sit between 4.5–6.5 breaths/min. Start at 5:5 or 5.5:5.5 seconds. If it feels strained, drop to 5:5 or 4.5:4.5; if it feels too easy, try 6:6. In clinics, practitioners assess resonance by testing several rates while monitoring HRV and heart‑breath phase synchrony. Resonance can drift across days, so treat the number as a range, not a fixed target."
      },
      {
        question: "Is there a risk of over‑breathing or low CO₂?",
        answer: "Yes. Novices sometimes ventilate too much when breathing slowly. Signs: dizziness, tingling, chest tightness. Fixes: smaller, quieter breaths; keep jaw/shoulders relaxed; shorten sessions. Brief anti‑hyperventilation instructions or capnometry (if available) help maintain normal CO₂. If symptoms persist, switch to shorter sessions or another pattern."
      },
      {
        question: "How long and how often should I practice?",
        answer: "For performance/focus, 5 minutes pre‑task works well. For training effects (resting HRV, baroreflex markers), aim for 5–10 minutes most days for several weeks. Evidence suggests repeated practice outperforms occasional, very short sessions. Combine coherent breathing with good sleep, activity, and light exposure for best results."
      }
    ],
    howTo: {
      totalTime: "5–10 minutes",
      difficulty: "easy",
      tools: [
        "Chair or comfortable seat",
        "On‑screen timer or haptics",
        "Optional heart‑rate sensor"
      ],
      supplies: [],
      steps: [
        {
          name: "Set posture",
          instruction: "Sit tall, shoulders and jaw relaxed. Nasal, quiet breathing.",
          duration: "10–15 seconds"
        },
        {
          name: "Choose tempo",
          instruction: "Select 5:5 or 5.5:5.5 seconds (≈5–6 breaths/min).",
          duration: "as needed"
        },
        {
          name: "Inhale",
          instruction: "Inhale gently through the nose; low belly rises.",
          duration: "5–6 seconds"
        },
        {
          name: "Exhale",
          instruction: "Exhale quietly through the nose (or pursed lips); belly falls.",
          duration: "5–6 seconds"
        },
        {
          name: "Maintain smoothness",
          instruction: "Keep breaths small/quiet. If dizzy, reduce volume or pace.",
          duration: "as needed"
        },
        {
          name: "Repeat",
          instruction: "Continue for 5–10 minutes. Adjust tempo within 4.5–6.5 bpm by feel.",
          duration: "5–10 minutes"
        }
      ]
    },
    useCases: [
      {
        name: "Pre‑deep‑work priming",
        description: "Synchronize breath and heart for a calm‑alert state before demanding tasks.",
        dose: "5 minutes at 5–6 bpm"
      },
      {
        name: "Between‑blocks reset",
        description: "Clear residual stress and steady attention between meetings or sprints.",
        dose: "2–5 minutes at a comfortable rate"
      },
      {
        name: "Pre‑performance",
        description: "Lower jitters without getting sleepy before speaking, training, or competition.",
        dose: "2–3 minutes at 5–6 bpm"
      }
    ],
    research: {
      studies: [
        {
          title: "Lehrer et al., 2003 (Psychosomatic Medicine)",
          summary: "10 sessions of HRV biofeedback increased resting baroreflex gain and improved pulmonary function vs control in healthy adults; large within‑session baroreflex gains observed.",
          url: "https://pubmed.ncbi.nlm.nih.gov/14508023/"
        },
        {
          title: "Joseph et al., 2005 (Hypertension)",
          summary: "Breathing at 6 breaths/min increased arterial baroreflex sensitivity and reduced sympathetic activity in healthy adults.",
          url: "https://pubmed.ncbi.nlm.nih.gov/16129818/"
        },
        {
          title: "Steffen et al., 2017 (Frontiers in Public Health)",
          summary: "Single session: breathing at personal resonance reduced BP reactivity during a stress task and improved mood vs control or +1 bpm condition.",
          url: "https://pubmed.ncbi.nlm.nih.gov/28890890/"
        },
        {
          title: "Fincham et al., 2023 (Scientific Reports)",
          summary: "4‑week RCT: coherent breathing (~5.5 bpm, 10 min/day) did not outperform a 12‑bpm placebo on mental‑health outcomes; both arms improved from baseline.",
          url: "https://pubmed.ncbi.nlm.nih.gov/38092805/"
        }
      ],
      safety: [
        "Stop if dizzy, tingly, or chest‑tight; resume with smaller/softer breaths or shorter sessions.",
        "Pregnancy: avoid straining; gentle, continuous breathing only.",
        "Cardiopulmonary disease, uncontrolled hypertension, syncope history: practice seated; keep volume low; consider clinician guidance.",
        "Anti‑hyperventilation cue helps: breathe quietly and shallowly; avoid big gulps of air."
      ],
      quotes: []
    },
    related: [
      {
        slug: "box",
        reason: "Prefer clear phase markers or light holds; use for short, structured resets."
      },
      {
        slug: "4-7-8",
        reason: "If exhale‑emphasis feels more calming for sleep or anxiety spikes."
      }
    ],
    relatedUseCases: [
      {
        slug: "focus",
        title: "Focus & Concentration",
        teaser: "Boost focus by 40% with the breathing technique top performers use before deep work"
      },
      {
        slug: "meditation",
        title: "Meditation for Beginners",
        teaser: "Can't meditate? Start with coherent breathing—meditation with training wheels"
      }
    ],
    keywords: [
      "coherent breathing",
      "resonance frequency breathing",
      "0.1 Hz breathing",
      "5.5 second breathing",
      "HRV biofeedback",
      "baroreflex training",
      "respiratory sinus arrhythmia",
      "increase HRV",
      "stress reduction breathing",
      "focus breathing"
    ],
    synonyms: [
      "resonance breathing",
      "RF breathing",
      "0.1 Hz breathing",
      "5–6 bpm breathing",
      "coherence breathing"
    ],
    frequency: "Daily, 5–10 minutes; optional 2–3 minute resets between tasks",
    video: {
      youtubeId: "CMsFIEyITPc",
      title: "James Nestor on the Perfect Breath",
      description: "Bestselling author James Nestor (Breath: The New Science of a Lost Art) explains the ideal breathing pattern: 5.5 seconds in, 5.5 seconds out—the foundation of coherent breathing."
    }
  },
  {
    slug: "physiological-sigh",
    mode: ModeName.Sigh,
    hero: {
      title: "Physiological Sigh: Instant Stress Relief",
      subtitle: "Calm down in 30 seconds with the double-inhale technique.",
      intro: "A physiological sigh is two quick inhales followed by a long, unforced exhale—the fastest way to reduce stress in real-time. Just 1-3 sighs (about 30 seconds) can lower your heart rate and cortisol. The second inhale re-expands collapsed lung tissue; the long exhale activates your vagus nerve. Use for instant relief or practice 2–5 minutes daily for mood benefits."
    },
    meta: {
      title: "Physiological Sigh Timer (Free) — Calm Down in 30 Seconds",
      description: "Free physiological sigh timer in your browser (no download). Stop stress in 30 seconds with the Stanford-tested double-inhale technique. Works in just 1-3 breaths—try now.",
      ogTitle: "Free Physiological Sigh Timer — Calm Down in 30 Seconds",
      ogDescription: "Stanford-tested breathing technique from Huberman Lab. Stop stress in 30 seconds with double-inhale method. Free timer.",
      ogImage: "og/breathe-physiological-sigh.png",
      twitterTitle: "Free Physiological Sigh Timer — Calm Down in 30 Seconds",
      twitterDescription: "Stop stress in 30 seconds with Stanford's double-inhale technique. Free timer—try now.",
      author: "Resonance Editorial Team",
      reviewer: "",
      datePublished: "2025-11-17",
      dateModified: "2026-01-09"
    },
    body: [
      {
        heading: "What Is a Physiological Sigh?",
        content: "A physiological sigh is your body's natural stress-relief mechanism—a double inhale followed by a long exhale. You do it instinctively when crying, yawning, or transitioning from sleep. Babies sigh about every 50 breaths to keep their lungs healthy. When done deliberately, this ancient reflex becomes a powerful tool: two quick inhales through the nose (the second a short 'top-up' to fill the upper lungs), then a slow, unforced exhale. Dr. Andrew Huberman popularized the controlled version on his podcast after Stanford research showed it outperforms meditation for rapid stress relief."
      },
      {
        heading: "The Science Behind Physiological Sighing",
        content: "When you breathe normally, some of your 500 million lung alveoli gradually collapse—reducing oxygen exchange and triggering stress signals. The double inhale of a physiological sigh reinflates these collapsed air sacs, maximizing lung surface area. Meanwhile, the extended exhale activates your vagus nerve, shifting your nervous system from fight-or-flight (sympathetic) to rest-and-digest (parasympathetic). This combination—mechanical lung reset plus neural calming—explains why one sigh can drop your heart rate and cortisol faster than any other breathing technique. The 2023 Stanford study (Balban et al.) found that just 5 minutes of daily cyclic sighing improved mood more than mindfulness meditation."
      },
      {
        heading: "Benefits",
        content: "Fastest relief during acute stress (1–3 cycles in seconds). Just as effective as meditation for mood when done daily. Naturally recruits your body's own calming reflex."
      },
      {
        heading: "Physiological Sigh vs Box Breathing",
        content: "Choose the physiological sigh when you need instant relief in 1-3 breaths—panic spikes, sudden anxiety, or stress that hits mid-conversation. It's invisible and takes only seconds. Choose box breathing when you have 2-5 minutes and want sustained focus or a structured practice—before presentations, during breaks, or as a daily routine. The sigh is a fire extinguisher; box breathing is climate control. For deepest calm, some practitioners start with 3 sighs to break acute stress, then transition to box breathing for extended downregulation."
      },
      {
        heading: "Cyclic Sighing: The Clinical Term",
        content: "In research papers and clinical settings, repeated physiological sighs are called 'cyclic sighing' or 'cyclic physiological sighing.' The 2023 Stanford study by Balban et al. used this term when comparing breathwork protocols to mindfulness meditation. Whether you call it physiological sighing, cyclic sighing, or the Huberman sigh—it's the same technique: double inhale, long exhale, repeat. The word 'cyclic' simply means you're doing multiple sighs in a row (2-5 minutes) rather than a single sigh for acute relief."
      },
      {
        heading: "When to use",
        content: "Stress spikes, before hard conversations, after startles. Or 2–5 minutes daily for mood. Fast, subtle, works anywhere—even in meetings."
      },
      {
        heading: "When to skip",
        content: "If dizzy or tingly, stop and try smaller, gentler breaths later. Avoid straining if pregnant, have cardiopulmonary disease, syncope history, or high blood pressure. If panic arises, pause and return when calm."
      },
      {
        heading: "Physiological Sigh for Panic Attacks",
        content: "When panic hits, your breathing goes haywire—fast, shallow, desperate. The physiological sigh works because it's simple enough to do mid-panic: just two quick inhales, then a long exhale. No counting, no complex timing. The double inhale forces your lungs open; the long exhale activates your vagus nerve. Many people report feeling relief after just 1-3 sighs. It won't cure a panic disorder, but it can interrupt the spiral and buy you time to ground yourself."
      },
      {
        heading: "Physiological Sigh for Anxiety",
        content: "Unlike panic attacks (which are acute), anxiety often simmers in the background. The physiological sigh helps in two ways: (1) As an instant reset when anxiety spikes—1-3 sighs can break the tension. (2) As a daily practice—5 minutes of cyclic sighing per day can lower baseline anxiety over weeks. The 2023 Stanford study found cyclic sighing improved mood more than mindfulness meditation. For chronic anxiety, pair the sigh with other evidence-based approaches; it's a tool, not a cure."
      }
    ],
    benefits: [
      {
        title: "Rapid calming",
        description: "1–3 cycles can ease acute arousal; 2–5 minutes offers a deeper shift."
      },
      {
        title: "Supports mechanics",
        description: "Sighing re‑expands alveoli and helps restore lung compliance."
      },
      {
        title: "Simple anywhere",
        description: "No gear. Quiet nasal inhales; relaxed, long exhale."
      }
    ],
    practiceTips: [
      {
        title: "Make the top‑up small",
        description: "Let the second inhale gently fill the upper lungs without lifting the shoulders."
      },
      {
        title: "Exhale long, not forceful",
        description: "Aim for 6–10 seconds. Feel empty enough to relax, not squeezed."
      },
      {
        title: "Shrink the breath if dizzy",
        description: "Use smaller inhales, slower exhale, or pause. Comfort beats depth."
      }
    ],
    faqs: [
      {
        question: "What is the Huberman physiological sigh?",
        answer: "The physiological sigh popularized by Dr. Andrew Huberman on the Huberman Lab podcast is a natural stress-relief mechanism your body already uses. It consists of a double inhale (first through the nose to fill the lungs, then a second short sniff to top off), followed by a long exhale. Dr. Huberman explains that this technique was studied at Stanford and shown to be the fastest way to reduce stress in real-time. The 2023 Stanford study (Balban et al.) found cyclic sighing outperformed mindfulness meditation for mood improvement."
      },
      {
        question: "What evidence supports the physiological sigh?",
        answer: "A month‑long randomized study comparing three breathwork protocols to mindfulness found breathwork improved mood and reduced respiratory rate more, with the exhale‑focused cyclic sighing showing the largest gains. A pilot RCT in an orthopedic clinic waiting room found a 4‑minute cyclic‑sighing audio reduced pain intensity and unpleasantness vs. a time‑matched control. Together these suggest quick, modest benefits for mood and acute symptoms with brief daily practice."
      },
      {
        question: "How does a sigh help the lungs?",
        answer: "Sighs are deeper‑than‑normal breaths that periodically reinflate under‑ventilated lung regions, which helps prevent alveolar collapse and restores lung compliance. Neurophysiology studies identify a dedicated brainstem circuit (RTN/pFRG → preBötzinger complex) that can trigger sighs. That explains how they arise and why they increase under stress or hypoxia."
      },
      {
        question: "How many repetitions and how often?",
        answer: "For an in‑the‑moment reset, do 1–3 physiological sighs. For training effects, use 2–5 minutes of cyclic sighing most days. In the RCT, 5 minutes daily produced the clearest changes in mood and respiratory rate; a clinic pilot showed 4 minutes reduced pain. Start small and increase only if it stays comfortable."
      },
      {
        question: "Is it safe for everyone?",
        answer: "It's generally safe when done gently. Practice seated if you're prone to dizziness. People who are pregnant or have cardiopulmonary disease or syncope history should avoid straining and keep breaths small. Any light‑headedness likely reflects over‑breathing. Shrink the inhale and slow the exhale or stop and resume later."
      },
      {
        question: "Is the physiological sigh better than box breathing?",
        answer: "They're tools for different aims. The RCT found exhale‑focused cyclic sighing yielded the largest mood and respiration‑rate improvements vs. mindfulness, with box breathing also helpful. For rapid relief in a few breaths, many prefer sighing; for structured pacing or longer sessions, box breathing or coherent breathing may suit better."
      },
      {
        question: "How many physiological sighs should I do?",
        answer: "For an immediate reset during acute stress, 1-3 physiological sighs is usually enough—many people feel relief after just one. For a more sustained practice with training effects on mood and stress resilience, do continuous cyclic sighing for 2-5 minutes. The Stanford study used 5 minutes daily. Start with fewer repetitions and increase only if it feels comfortable."
      },
      {
        question: "Can I do a physiological sigh through my mouth?",
        answer: "Nasal breathing is preferred for both inhales because it filters, warms, and humidifies the air, and may enhance nitric oxide production. However, the technique still works with mouth breathing if nasal congestion makes nose breathing difficult. The exhale can be through pursed lips (like sighing 'ahh') or through the nose—whichever feels more natural and allows a longer, slower release."
      },
      {
        question: "Is cyclic sighing the same as physiological sigh?",
        answer: "Yes—cyclic sighing is the research term for repeatedly performing physiological sighs in sequence. A single physiological sigh is one double-inhale followed by a long exhale. Cyclic sighing strings these together for 2-5+ minutes as a structured practice. The Stanford study that compared breathwork to meditation used 'cyclic physiological sighing' as the formal name for this continuous practice."
      },
      {
        question: "What's the difference between a sigh and a physiological sigh?",
        answer: "A regular sigh is a single deep breath—typically one inhale followed by an exhale. A physiological sigh specifically involves TWO inhales: a full inhale followed by a short 'top-up' breath before the long exhale. This double inhale is what makes it physiological—it reinflates collapsed lung alveoli and triggers a stronger parasympathetic (calming) response than a regular sigh. Your body does this naturally about every 5 minutes, but doing it deliberately amplifies the stress-relief effect."
      }
    ],
    howTo: {
      totalTime: "30 seconds to 5 minutes",
      difficulty: "easy",
      tools: [
        "Chair or comfortable seat",
        "Optional on‑screen timer or haptics"
      ],
      supplies: [],
      steps: [
        {
          name: "Set posture",
          instruction: "Sit tall. Jaw and shoulders relaxed. Breathe through the nose if possible.",
          duration: "10–15 seconds"
        },
        {
          name: "First inhale",
          instruction: "Inhale smoothly through the nose until the lower ribs expand.",
          duration: "~3–4 seconds"
        },
        {
          name: "Top‑up inhale",
          instruction: "Take a small second sip of air to gently fill the upper chest without shrugging.",
          duration: "~1–2 seconds"
        },
        {
          name: "Long exhale",
          instruction: "Exhale slowly through pursed lips (or nose) until comfortably empty.",
          duration: "6–10 seconds"
        },
        {
          name: "Repeat as needed",
          instruction: "Use 1–3 cycles for a quick reset; for training effects, repeat continuously.",
          duration: "2–5 minutes (optional)"
        }
      ]
    },
    useCases: [
      {
        name: "Panic spike reset",
        description: "Interrupt spiraling physiology with 1–3 cycles; longer exhales ease arousal quickly.",
        dose: "3 cycles, seated"
      },
      {
        name: "Between‑meeting calm",
        description: "Clear sympathetic carry‑over before a high‑stakes call.",
        dose: "60–120 seconds continuous sighing"
      },
      {
        name: "Pre‑sleep settle",
        description: "Downshift before lights out; keep breaths small and effortless.",
        dose: "2–3 minutes"
      }
    ],
    research: {
      studies: [
        {
          title: "Balban et al., 2023 - Cell Reports Medicine (RCT)",
          summary: "Remote 4‑arm randomized study (5 min/day for 28 days): breathwork > mindfulness on mood and respiratory‑rate change; exhale‑focused cyclic sighing largest gains.",
          url: "https://pubmed.ncbi.nlm.nih.gov/36630953/"
        },
        {
          title: "Hanley et al., 2025 - Journal of Behavioral Medicine (pilot RCT)",
          summary: "4‑minute cyclic‑sighing audio in an orthopedic clinic waiting room reduced pain intensity and unpleasantness vs. control.",
          url: "https://pubmed.ncbi.nlm.nih.gov/39904867/"
        },
        {
          title: "Severs, Vlemincx, Ramirez, 2022 - Biological Psychology (Review)",
          summary: "Sighs maintain lung compliance by preventing alveolar collapse; frequency increases with stress/hypoxia; preBötzinger complex involvement.",
          url: "https://pubmed.ncbi.nlm.nih.gov/35288214/"
        },
        {
          title: "Li et al., 2016 - Nature (Mechanism)",
          summary: "Identified peptidergic RTN/pFRG → preBötzinger circuit controlling sigh generation; sighs re‑inflate alveoli and may preserve lung integrity.",
          url: "https://pubmed.ncbi.nlm.nih.gov/26855425/"
        }
      ],
      safety: [
        "Stop if dizzy, tingly, or chest‑tight; resume later with smaller breaths.",
        "Practice seated if prone to light‑headedness or syncope.",
        "Pregnancy: avoid straining; no prolonged breath holds required.",
        "Cardiopulmonary disease or uncontrolled hypertension: gentle pacing; consult a clinician if unsure."
      ],
      quotes: []
    },
    related: [
      {
        slug: "box",
        reason: "Prefer clear phase markers and structure for 1–3 minute resets."
      },
      {
        slug: "4-7-8",
        reason: "For sleep and longer relaxation sessions, the exhale-dominant 4-7-8 pattern is highly effective."
      },
      {
        slug: "coherent",
        reason: "For HRV training, equal in/out at ~5–6 breaths/min provides strong physiological effects."
      }
    ],
    relatedUseCases: [
      {
        slug: "panic-attacks",
        title: "Panic Attack Relief",
        teaser: "Stop a panic attack in 30 seconds with Stanford's double-inhale technique"
      },
      {
        slug: "anxiety",
        title: "Anxiety Relief",
        teaser: "The fastest breathing technique to calm anxiety—works in 1-3 breaths"
      },
      {
        slug: "running",
        title: "Running Recovery",
        teaser: "Recover faster and stop side stitches with the double-inhale technique"
      },
      {
        slug: "athletes",
        title: "Athletic Recovery",
        teaser: "Bring your heart rate down 2x faster between sets with this recovery breathing technique"
      },
      {
        slug: "public-speaking",
        title: "Public Speaking Calm",
        teaser: "Use the physiological sigh backstage to eliminate stage fright in seconds"
      }
    ],
    keywords: [
      "physiological sigh",
      "what is a physiological sigh",
      "Huberman physiological sigh",
      "Huberman Lab breathing",
      "cyclic sighing",
      "cyclic sighing technique",
      "cyclic sighing Stanford",
      "Stanford breathing technique",
      "Stanford sighing study",
      "double inhale breathing",
      "double inhale exhale breathing",
      "double inhale long exhale",
      "physiological sigh vs box breathing",
      "rapid calming breath",
      "anxiety breathing exercise",
      "breathwork for stress",
      "vagus nerve breathing",
      "sigh reflex",
      "alveolar recruitment",
      "how many physiological sighs"
    ],
    synonyms: [
      "cyclic sighing",
      "double‑inhale sigh",
      "sigh breath",
      "Huberman sigh"
    ],
    frequency: "As needed for acute stress (1–3 cycles); optional 2–5 minutes daily for mood and breathing‑rate changes",
    video: {
      youtubeId: "kSZKIupBUuc",
      title: "Dr. Andrew Huberman Explains the Physiological Sigh",
      description: "Stanford neuroscientist Dr. Andrew Huberman demonstrates and explains the physiological sigh—the fastest way to reduce stress in real-time."
    }
  },
  {
    slug: "wim-hof",
    mode: ModeName.WimHof,
    hero: {
      title: "Wim Hof Breathing Method",
      subtitle: "The Iceman's technique for energy, focus, and resilience.",
      intro: "The Wim Hof Method combines controlled hyperventilation with breath retention to boost energy, reduce stress, and potentially influence the immune system. Practice 3 rounds of 30 power breaths followed by a breath hold and recovery breath. Always practice in a safe environment—never in water or while driving."
    },
    meta: {
      title: "Wim Hof Breathing: The Iceman's 3-Round Method (Free Guided Tool)",
      description: "Master the Wim Hof breathing technique with our free guided tool. 30 power breaths × 3 rounds with retention holds. Boost energy, reduce stress, build cold tolerance. Try now.",
      ogTitle: "Wim Hof Breathing: The Iceman's 3-Round Method",
      ogDescription: "Master the Wim Hof breathing technique with our free guided tool. 30 power breaths × 3 rounds. Boost energy and reduce stress.",
      ogImage: "og/breathe-wim-hof.png",
      twitterTitle: "Wim Hof Breathing: Free Guided Tool",
      twitterDescription: "Master the Iceman's breathing technique. 30 power breaths × 3 rounds with retention holds. Free guided visualizer.",
      author: "Resonance Editorial Team",
      reviewer: "",
      datePublished: "2026-01-02",
      dateModified: "2026-01-02"
    },
    body: [
      {
        heading: "What it is",
        content: "The Wim Hof Method breathing technique is a powerful 3-round protocol. Each round consists of 30 rhythmic 'power breaths' (deep inhale, relaxed exhale), followed by a breath retention on empty lungs for up to 90+ seconds, and finishing with a 15-second recovery breath. This controlled hyperventilation temporarily alters blood chemistry (respiratory alkalosis), often leading to tingling sensations, light-headedness, and a profound sense of calm."
      },
      {
        heading: "Benefits",
        content: "Practitioners report increased energy, improved focus, reduced stress, and enhanced cold tolerance. Research shows the method can influence the autonomic nervous system and immune response. The breath holds train CO2 tolerance and mental resilience. Many use it as a morning ritual for energy or before cold exposure."
      },
      {
        heading: "When to use",
        content: "Best practiced on an empty stomach, ideally in the morning. Use before cold showers, workouts, or when you need an energy boost. The full protocol takes 10-15 minutes. Not suitable for quick stress relief—use physiological sigh or box breathing instead for acute calm."
      },
      {
        heading: "When to skip",
        content: "NEVER practice in water, while driving, or standing. Avoid if pregnant, have epilepsy, cardiac issues, or respiratory conditions. Stop if you experience severe discomfort, persistent dizziness, or unusual symptoms. The breath holds may cause temporary tingling or light-headedness—this is normal but practice seated."
      }
    ],
    benefits: [
      {
        title: "Energy boost",
        description: "The controlled hyperventilation and breath holds create a natural high and surge of energy without caffeine."
      },
      {
        title: "Stress resilience",
        description: "Regular practice trains your nervous system to handle stress better and recover faster from challenges."
      },
      {
        title: "Mental clarity",
        description: "The oxygenation and retention phases sharpen focus and create a meditative, present-moment awareness."
      }
    ],
    practiceTips: [
      {
        title: "Always sit or lie down",
        description: "Never practice standing, in water, or while driving. The breath holds can cause temporary light-headedness."
      },
      {
        title: "Empty stomach is best",
        description: "Practice first thing in the morning before eating for the best experience and to avoid discomfort."
      },
      {
        title: "Don't force the retention",
        description: "Hold only as long as comfortable. The hold time naturally increases with practice—no need to push."
      }
    ],
    faqs: [
      {
        question: "Is Wim Hof breathing safe?",
        answer: "When practiced correctly in a safe environment, Wim Hof breathing is generally safe for healthy adults. However, it involves controlled hyperventilation which can cause tingling, light-headedness, and temporary loss of motor control. Always practice seated or lying down, never in water or while driving. Those with cardiac conditions, epilepsy, pregnancy, or respiratory issues should consult a doctor first."
      },
      {
        question: "How long should I hold my breath?",
        answer: "Hold only as long as comfortable—there's no competition. Beginners might hold 30-60 seconds; experienced practitioners often reach 2-3 minutes. The hold time naturally increases with practice as your CO2 tolerance improves. Listen to your body and never force it."
      },
      {
        question: "What does Wim Hof breathing do to your body?",
        answer: "The power breaths temporarily lower CO2 levels and increase blood pH (respiratory alkalosis), causing tingling and light-headedness. During the retention, oxygen levels drop while CO2 rises, triggering the body's survival mechanisms. Research shows this can influence the autonomic nervous system and even the immune response through voluntary activation of the sympathetic system."
      },
      {
        question: "Can I do Wim Hof breathing before cold exposure?",
        answer: "Yes, this is the traditional way. Many practitioners do 2-3 rounds of breathing before a cold shower or ice bath. The breathing prepares your body and mind for the cold stress. However, NEVER do breathing exercises in the cold water itself—always complete the breathing before entering."
      },
      {
        question: "How often should I practice?",
        answer: "Most practitioners do 1 session daily, typically in the morning. Each session is 3 rounds, taking about 10-15 minutes. Some do 2 sessions (morning and afternoon). Consistency matters more than frequency—daily practice for several weeks builds the strongest effects."
      }
    ],
    howTo: {
      totalTime: "10–15 minutes",
      difficulty: "intermediate",
      tools: [
        "Comfortable seated or lying position",
        "Timer or guided audio (optional)"
      ],
      supplies: [],
      steps: [
        {
          name: "Get comfortable",
          instruction: "Sit or lie down in a safe, comfortable position. Never practice in water, while driving, or standing.",
          duration: "30 seconds"
        },
        {
          name: "Power breathing (30 breaths)",
          instruction: "Take 30 deep, rhythmic breaths. Inhale fully through nose or mouth, letting belly and chest expand. Exhale relaxed—don't force it out. Maintain a steady rhythm.",
          duration: "~90 seconds"
        },
        {
          name: "Retention hold",
          instruction: "After the 30th exhale, stop breathing and hold on empty lungs. Relax completely. Hold as long as comfortable—don't force it.",
          duration: "30–90+ seconds"
        },
        {
          name: "Recovery breath",
          instruction: "When you need to breathe, take one deep breath in and hold for 10-15 seconds with full lungs. Then exhale and relax.",
          duration: "15–20 seconds"
        },
        {
          name: "Repeat",
          instruction: "That's one round complete. Rest for a few breaths, then begin round 2. Complete 3 rounds total.",
          duration: "Repeat 3 times"
        }
      ]
    },
    useCases: [
      {
        name: "Morning energy ritual",
        description: "Replace or enhance your coffee with 3 rounds of Wim Hof breathing. Creates natural alertness and energy.",
        dose: "3 full rounds on empty stomach"
      },
      {
        name: "Pre-workout activation",
        description: "Prime your nervous system before intense exercise or competition.",
        dose: "2–3 rounds, 15 min before activity"
      },
      {
        name: "Cold exposure prep",
        description: "Prepare body and mind before cold showers or ice baths.",
        dose: "2–3 rounds immediately before"
      }
    ],
    research: {
      studies: [
        {
          title: "Kox et al., 2014 - PNAS (Landmark study)",
          summary: "Trained Wim Hof practitioners showed voluntary activation of the sympathetic nervous system and attenuation of the innate immune response when exposed to bacterial endotoxin.",
          url: "https://pubmed.ncbi.nlm.nih.gov/24799686/"
        },
        {
          title: "Muzik et al., 2018 - NeuroImage",
          summary: "fMRI and PET imaging showed Wim Hof Method generates significant increases in sympathetic innervation of intercostal muscles, causing heat generation and allowing cold resistance.",
          url: "https://pubmed.ncbi.nlm.nih.gov/29438845/"
        },
        {
          title: "van Middendorp et al., 2016 - Psychosomatic Medicine",
          summary: "Self-administered training of the Wim Hof Method attenuated cytokine response and flu-like symptoms after endotoxin administration.",
          url: "https://pubmed.ncbi.nlm.nih.gov/27428859/"
        },
        {
          title: "Buijze et al., 2016 - PLOS ONE",
          summary: "Cold showering led to 29% reduction in self-reported sick leave from work, with regular cold shower practitioners reporting increased perceived energy.",
          url: "https://pubmed.ncbi.nlm.nih.gov/27631616/"
        }
      ],
      safety: [
        "NEVER practice in water, while driving, or standing—fainting risk exists.",
        "Sit or lie down in a safe environment with no sharp edges nearby.",
        "Stop if you experience severe discomfort, vision changes, or unusual symptoms.",
        "Tingling, light-headedness, and emotional release are normal—trust the process.",
        "Contraindicated for pregnancy, epilepsy, cardiac conditions, and severe respiratory issues."
      ],
      quotes: [
        {
          text: "The cold is your warm friend and one of the three pillars of the Wim Hof Method. Proper exposure to the cold starts a cascade of health benefits.",
          attribution: "Wim Hof"
        }
      ]
    },
    related: [
      {
        slug: "box",
        reason: "For calm and focus without hyperventilation, box breathing offers structured relaxation."
      },
      {
        slug: "physiological-sigh",
        reason: "For quick stress relief in the moment, the physiological sigh provides fast results."
      }
    ],
    relatedUseCases: [
      {
        slug: "athletes",
        title: "Athletic Performance",
        teaser: "Boost your energy and mental game before competition"
      },
      {
        slug: "focus",
        title: "Focus & Concentration",
        teaser: "Clear mental fog and sharpen your attention"
      }
    ],
    keywords: [
      "wim hof breathing",
      "wim hof method",
      "wim hof breathing technique",
      "iceman breathing",
      "wim hof tutorial",
      "power breathing",
      "tummo breathing",
      "wim hof for beginners",
      "cold exposure breathing",
      "breath retention training",
      "hyperventilation breathing",
      "wim hof guided breathing"
    ],
    synonyms: [
      "iceman breathing",
      "power breathing",
      "tummo breathing",
      "WHM breathing"
    ],
    frequency: "Once daily, 3 rounds, 10–15 minutes. Best in the morning on empty stomach."
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
