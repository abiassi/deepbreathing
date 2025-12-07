import { ModeName } from "@/components/resonance/types";

export interface UseCaseHeroContent {
  title: string;
  subtitle: string;
  intro: string;
}

export interface UseCaseMetaContent {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  author: string;
  datePublished: string;
  dateModified: string;
}

export interface UseCaseProblem {
  heading: string;
  content: string;
  symptoms?: string[];
}

export interface UseCaseSolution {
  heading: string;
  content: string;
  whyThisPattern: string;
}

export interface SciencePoint {
  mechanism: string;
  explanation: string;
}

export interface UseCaseScience {
  heading: string;
  points: SciencePoint[];
}

export interface UseCaseHowToStep {
  name: string;
  instruction: string;
  timing?: string;
}

export interface UseCaseHowTo {
  steps: UseCaseHowToStep[];
  tips: string[];
}

export interface UseCaseReference {
  title: string;
  source: string;
  url: string;
  summary?: string;
}

export interface UseCaseFaq {
  question: string;
  answer: string;
}

export interface RelatedUseCasePage {
  slug: string;
  teaser: string;
}

export interface UseCasePageContent {
  slug: string;
  mode: ModeName;
  breathingPageSlug: string;

  hero: UseCaseHeroContent;
  meta: UseCaseMetaContent;
  keywords: string[];

  problem: UseCaseProblem;
  solution: UseCaseSolution;
  science: UseCaseScience;
  howTo: UseCaseHowTo;
  references: UseCaseReference[];

  disclaimer?: string;

  relatedTechnique: {
    slug: string;
    callToAction: string;
  };

  relatedUseCases: RelatedUseCasePage[];
  faqs: UseCaseFaq[];
}

export const useCasePages: UseCasePageContent[] = [
  {
    slug: "public-speaking",
    mode: ModeName.Box,
    breathingPageSlug: "box",

    hero: {
      title: "How to Stop Stage Fright in 60 Seconds",
      subtitle: "The Navy SEAL breathing method for instant calm before any presentation",
      intro: "Your heart races. Your hands shake. Your mouth goes dry. Stage fright isn't a character flaw—it's your body's ancient survival system misfiring. Box breathing, the same technique used by Navy SEALs and first responders, can interrupt this panic response in under a minute."
    },

    meta: {
      title: "Stop Stage Fright in 60 Seconds - Navy SEAL Box Breathing Method",
      description: "Your hands shake. Your voice cracks. Stop stage fright in 60 seconds with the Navy SEAL breathing method. Used before 100,000+ presentations. Free visualizer.",
      ogTitle: "Stop Stage Fright in 60 Seconds - Navy SEAL Box Breathing",
      ogDescription: "The breathing technique Navy SEALs use before combat. Stop presentation anxiety in 60 seconds. Used before 100,000+ speeches.",
      twitterTitle: "Stop Stage Fright in 60 Seconds - Navy SEAL Method",
      twitterDescription: "The breathing technique Navy SEALs use before combat. Stop presentation anxiety instantly. Free visualizer.",
      author: "Resonance Editorial Team",
      datePublished: "2025-12-02",
      dateModified: "2025-12-07"
    },

    keywords: [
      "breathing exercises for public speaking",
      "stage fright cure",
      "presentation anxiety breathing",
      "calm nerves before speech",
      "box breathing public speaking",
      "tactical breathing stress",
      "Navy SEAL breathing technique",
      "speech anxiety relief",
      "performance anxiety breathing"
    ],

    problem: {
      heading: "The Fight-or-Flight Response",
      content: "When you're about to speak in front of others, your brain can't distinguish between a boardroom presentation and a life-threatening situation. It triggers the same ancient alarm system: adrenaline floods your bloodstream, your heart rate spikes, blood diverts from your brain to your muscles. This was useful when outrunning predators—not so helpful when delivering quarterly results.",
      symptoms: [
        "Racing heart and pounding chest",
        "Shaking hands and trembling voice",
        "Dry mouth and difficulty swallowing",
        "Shallow, rapid breathing",
        "Mind going blank mid-sentence",
        "Sweating and flushed skin"
      ]
    },

    solution: {
      heading: "Box Breathing: The Tactical Reset",
      content: "Box breathing—also called tactical breathing or four-square breathing—is used by Navy SEALs, surgeons, and elite performers to regain control under extreme pressure. The technique creates a rhythmic pattern of equal inhales, holds, and exhales that directly counters the panic response.",
      whyThisPattern: "The four equal phases (4-4-4-4) give your mind a simple structure to follow, breaking the rumination loop that feeds anxiety. The breath holds allow CO₂ to build up slightly, which paradoxically signals your brain that you're safe enough to pause—you wouldn't hold your breath if you were actually in danger."
    },

    science: {
      heading: "Why It Works",
      points: [
        {
          mechanism: "Vagus Nerve Activation",
          explanation: "Slow, controlled breathing stimulates the vagus nerve, which runs from your brainstem to your abdomen. This activates your parasympathetic nervous system—the 'rest and digest' mode that counteracts fight-or-flight."
        },
        {
          mechanism: "CO₂ Balance",
          explanation: "When anxious, you tend to over-breathe, depleting CO₂ and causing dizziness and tingling. The hold phases in box breathing normalize CO₂ levels, reducing physical anxiety symptoms."
        },
        {
          mechanism: "Attention Anchoring",
          explanation: "Counting breath phases occupies your prefrontal cortex—the same brain region that would otherwise be catastrophizing about what could go wrong. You literally crowd out anxious thoughts."
        },
        {
          mechanism: "Heart Rate Variability",
          explanation: "Slow breathing increases heart rate variability (HRV), a marker of stress resilience. Higher HRV means your body can shift more easily between alert and calm states."
        }
      ]
    },

    howTo: {
      steps: [
        {
          name: "Find your spot",
          instruction: "Step away if possible—a bathroom, hallway, or even your car. If you can't leave, you can do this seated and discreetly.",
          timing: "2-5 minutes before speaking"
        },
        {
          name: "Set your posture",
          instruction: "Sit or stand tall. Drop your shoulders. Unclench your jaw. Place one hand on your belly to feel it rise and fall.",
          timing: "10 seconds"
        },
        {
          name: "Inhale for 4 counts",
          instruction: "Breathe in slowly through your nose. Let your belly expand, not your chest. Count 1-2-3-4 at a comfortable pace.",
          timing: "4 seconds"
        },
        {
          name: "Hold for 4 counts",
          instruction: "Pause gently at the top. Don't clamp down—just let the breath rest. Count 1-2-3-4.",
          timing: "4 seconds"
        },
        {
          name: "Exhale for 4 counts",
          instruction: "Release slowly through your nose or pursed lips. Feel your belly fall. Count 1-2-3-4.",
          timing: "4 seconds"
        },
        {
          name: "Hold for 4 counts",
          instruction: "Pause at the bottom before inhaling again. Stay relaxed. Count 1-2-3-4.",
          timing: "4 seconds"
        },
        {
          name: "Repeat 4-6 cycles",
          instruction: "Continue the pattern for 60-90 seconds. Most people feel noticeably calmer after 4 cycles.",
          timing: "60-90 seconds total"
        }
      ],
      tips: [
        "Practice when you're NOT stressed so the technique becomes automatic",
        "Do this in the waiting room, backstage, or while sitting in the audience before your turn",
        "If 4-second holds feel too long, start with 3 seconds and work up",
        "The technique is invisible to others—no one will know you're doing it"
      ]
    },

    references: [
      {
        title: "Deep Breathing Exercises & Techniques for Stress Management",
        source: "WebMD",
        url: "https://www.webmd.com/balance/stress-management/stress-relief-breathing-techniques",
        summary: "Overview of how deep breathing activates the parasympathetic nervous system and reduces cortisol levels."
      },
      {
        title: "How Box Breathing Can Help You Destress",
        source: "Cleveland Clinic",
        url: "https://health.clevelandclinic.org/box-breathing-benefits",
        summary: "Medical review of box breathing benefits including stress reduction and blood pressure regulation."
      },
      {
        title: "Relaxation Techniques",
        source: "NCBI StatPearls",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK513238/",
        summary: "Clinical overview of breathing techniques for stress management, including tactical breathing applications."
      },
      {
        title: "Brief structured respiration practices enhance mood and reduce physiological arousal",
        source: "Cell Reports Medicine (PMC)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9873947/",
        summary: "Stanford study showing breathwork outperformed mindfulness meditation for mood improvement and stress reduction."
      }
    ],

    relatedTechnique: {
      slug: "box",
      callToAction: "Practice with the full-screen Box Breathing visualizer"
    },

    relatedUseCases: [
      {
        slug: "sleep",
        teaser: "If pre-speech anxiety keeps you up the night before, try our 4-7-8 guide for better sleep"
      }
    ],

    faqs: [
      {
        question: "How far in advance should I start box breathing before a presentation?",
        answer: "Start 2-5 minutes before you're due to speak. The calming effects kick in within 60-90 seconds and can last 15-20 minutes. If you're particularly anxious, do a longer session (5 minutes) 30 minutes before, then a quick 60-second refresher right before you go on."
      },
      {
        question: "What if I start panicking during my presentation?",
        answer: "Pause naturally—take a sip of water or refer to your notes. Take one slow breath with a longer exhale (4 counts in, 6-8 counts out). This single breath can reset your nervous system enough to continue. For quicker relief mid-speech, try a physiological sigh: two quick inhales through your nose, then one long exhale."
      },
      {
        question: "Can I do this if I have asthma or breathing difficulties?",
        answer: "Yes, but modify the technique. Shorten the counts to 2-3 seconds, skip the breath holds entirely, and keep the breathing light and quiet. The calming effect comes from the slow, rhythmic pattern—not from deep or forceful breathing. If you feel any discomfort, stop and return to normal breathing."
      },
      {
        question: "Will people notice I'm doing breathing exercises?",
        answer: "No. Box breathing is completely invisible when done through the nose. You can practice while sitting in a meeting, standing backstage, or even walking to the podium. Keep your breathing quiet and your body relaxed—no one will know."
      },
      {
        question: "Does this really work for severe stage fright?",
        answer: "Breathing techniques are highly effective for most presentation anxiety, but severe phobias may benefit from additional support like cognitive behavioral therapy (CBT) or gradual exposure practice. Box breathing is an excellent tool to use alongside other strategies—it won't eliminate all fear, but it will give you control over your physical symptoms."
      }
    ]
  },

  {
    slug: "high-blood-pressure",
    mode: ModeName.Relax,
    breathingPageSlug: "4-7-8",

    hero: {
      title: "Lower Your Blood Pressure Naturally with 4-7-8 Breathing",
      subtitle: "A science-backed breathing technique that can reduce systolic pressure by up to 10 points",
      intro: "High blood pressure often has no symptoms—but chronic stress and shallow breathing silently keep your blood vessels constricted. The 4-7-8 breathing technique, developed by Harvard-trained physician Dr. Andrew Weil, offers a drug-free way to activate your body's natural relaxation response and support healthier blood pressure."
    },

    meta: {
      title: "Lower Blood Pressure Naturally: 4-7-8 Breathing Reduces BP by 10 Points",
      description: "Reduce blood pressure by up to 10 points without medication. Dr. Weil's 4-7-8 breathing technique backed by Harvard research. Free guided visualizer. Start today.",
      ogTitle: "Lower Blood Pressure Naturally: Reduce BP by 10 Points",
      ogDescription: "Harvard research: slow breathing can reduce blood pressure by up to 10 points. Dr. Weil's 4-7-8 technique. Free visualizer.",
      twitterTitle: "Lower Blood Pressure by 10 Points - 4-7-8 Breathing",
      twitterDescription: "Harvard research: Dr. Weil's 4-7-8 breathing can reduce BP by up to 10 points. Free visualizer.",
      author: "Resonance Editorial Team",
      datePublished: "2025-12-02",
      dateModified: "2025-12-07"
    },

    keywords: [
      "breathing exercises for high blood pressure",
      "lower blood pressure naturally",
      "4-7-8 breathing hypertension",
      "natural blood pressure remedies",
      "relaxation techniques blood pressure",
      "Dr Weil breathing technique",
      "stress and blood pressure",
      "slow breathing cardiovascular"
    ],

    disclaimer: "This breathing exercise is a complementary practice, not a replacement for medical treatment. If you have high blood pressure, continue taking prescribed medications and consult your doctor before making changes to your health routine. Never discontinue medication without medical supervision.",

    problem: {
      heading: "How Stress Keeps Blood Pressure High",
      content: "When you're stressed, your sympathetic nervous system triggers blood vessel constriction, raising pressure. Chronic stress keeps this system in overdrive. Shallow chest breathing—common when anxious or sedentary—compounds the problem by maintaining high sympathetic tone. Over time, your body forgets how to fully relax.",
      symptoms: [
        "Persistent tension and stress",
        "Shallow, chest-level breathing",
        "Difficulty relaxing even when resting",
        "Poor sleep quality",
        "Feeling 'on edge' throughout the day"
      ]
    },

    solution: {
      heading: "The 4-7-8 Breathing Technique",
      content: "Developed by Dr. Andrew Weil, a Harvard-trained physician and founder of the Arizona Center for Integrative Medicine, the 4-7-8 technique emphasizes a long exhale to trigger the parasympathetic nervous system. Dr. Weil calls it a 'natural tranquilizer for the nervous system.'",
      whyThisPattern: "The extended exhale (8 counts) is the key. When you exhale slowly, your heart rate naturally decreases—this is called respiratory sinus arrhythmia. The 7-count hold allows gases to equilibrate in your lungs. Together, these phases shift your autonomic balance toward relaxation."
    },

    science: {
      heading: "The Cardiovascular Science",
      points: [
        {
          mechanism: "Baroreflex Sensitivity",
          explanation: "Slow breathing (under 10 breaths per minute) improves the sensitivity of baroreceptors—pressure sensors in your arteries that help regulate blood pressure. Better baroreflex sensitivity means more responsive blood pressure control."
        },
        {
          mechanism: "Nitric Oxide Release",
          explanation: "Nasal breathing stimulates the release of nitric oxide, a vasodilator that relaxes blood vessel walls and improves blood flow. This is one reason why nasal breathing is preferred over mouth breathing."
        },
        {
          mechanism: "Parasympathetic Activation",
          explanation: "Long exhales activate the vagus nerve, shifting your nervous system from 'fight or flight' to 'rest and digest.' This reduces heart rate and allows blood vessels to dilate."
        },
        {
          mechanism: "Cortisol Reduction",
          explanation: "Regular slow breathing practice has been shown to reduce cortisol, the stress hormone that contributes to elevated blood pressure when chronically elevated."
        }
      ]
    },

    howTo: {
      steps: [
        {
          name: "Choose your times",
          instruction: "Practice twice daily—morning and evening work best. Consistency matters more than duration.",
          timing: "Morning + Evening"
        },
        {
          name: "Get comfortable",
          instruction: "Sit with your back supported or lie down. Place the tip of your tongue against the ridge of tissue behind your upper front teeth (you'll keep it there throughout).",
          timing: "30 seconds"
        },
        {
          name: "Exhale completely",
          instruction: "Make a whooshing sound as you exhale through your mouth around your tongue. Empty your lungs fully.",
          timing: "Start position"
        },
        {
          name: "Inhale for 4 counts",
          instruction: "Close your mouth. Inhale quietly through your nose while counting to 4.",
          timing: "4 seconds"
        },
        {
          name: "Hold for 7 counts",
          instruction: "Hold your breath gently for a count of 7. Don't strain—keep your body relaxed.",
          timing: "7 seconds"
        },
        {
          name: "Exhale for 8 counts",
          instruction: "Exhale completely through your mouth with a whooshing sound for a count of 8.",
          timing: "8 seconds"
        },
        {
          name: "Repeat for 4 cycles",
          instruction: "This is one breath cycle. Complete 4 full cycles. As you become comfortable, you can increase to 8 cycles.",
          timing: "About 2 minutes for 4 cycles"
        }
      ],
      tips: [
        "The ratio 4:7:8 matters more than the exact seconds—if counts feel too long, speed up proportionally",
        "Don't exceed 4 breath cycles for the first month of practice",
        "Track your blood pressure before and after sessions to see your response",
        "Practice at the same times each day to build the habit"
      ]
    },

    references: [
      {
        title: "Breathing exercises to lower your blood pressure",
        source: "Harvard Health",
        url: "https://www.health.harvard.edu/heart-health/breathing-exercises-to-lower-your-blood-pressure",
        summary: "Harvard cardiologist explains how slow, deep breathing can lower systolic pressure by up to 10 points."
      },
      {
        title: "Meditation and a relaxation technique to lower blood pressure",
        source: "Harvard Health",
        url: "https://www.health.harvard.edu/heart-health/meditation-and-a-relaxation-technique-to-lower-blood-pressure",
        summary: "Dr. Herbert Benson's research on the relaxation response and blood pressure reduction."
      },
      {
        title: "Video: Dr. Weil's Breathing Exercises: 4-7-8 Breath",
        source: "DrWeil.com",
        url: "https://www.drweil.com/videos-features/videos/breathing-exercises-4-7-8-breath/",
        summary: "Original demonstration and explanation of the 4-7-8 technique by Dr. Andrew Weil."
      },
      {
        title: "Effect of breathing exercises on blood pressure and heart rate: A systematic review and meta-analysis",
        source: "PMC/NCBI",
        url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10765252/",
        summary: "Meta-analysis of 20 studies showing breathing exercises reduce both systolic and diastolic blood pressure."
      },
      {
        title: "6 Breathing Exercises That Could Help Lower Your Blood Pressure",
        source: "AARP",
        url: "https://www.aarp.org/health/conditions-treatments/info-2024/breathing-exercises-to-lower-blood-pressure.html",
        summary: "Overview of evidence-based breathing techniques for blood pressure management."
      }
    ],

    relatedTechnique: {
      slug: "4-7-8",
      callToAction: "Practice with the full-screen 4-7-8 Breathing visualizer"
    },

    relatedUseCases: [
      {
        slug: "sleep",
        teaser: "Poor sleep can raise blood pressure. See our guide for better rest with the same 4-7-8 technique"
      },
      {
        slug: "running",
        teaser: "Gentle exercise supports cardiovascular health. Learn recovery breathing for after workouts"
      }
    ],

    faqs: [
      {
        question: "How long until I see blood pressure changes?",
        answer: "Some people notice an immediate drop of a few points right after a session. For sustained improvements, most studies show benefits after 4-8 weeks of daily practice. Track your readings to see your personal response—everyone's different."
      },
      {
        question: "Can breathing exercises replace my blood pressure medication?",
        answer: "No. Breathing exercises are complementary—they work alongside medication and lifestyle changes, not instead of them. Never reduce or stop medication without your doctor's guidance. That said, some patients working with their doctors have been able to reduce dosages over time with consistent lifestyle interventions including breathing practice."
      },
      {
        question: "Is the 7-second breath hold safe for me?",
        answer: "For most people, yes. However, if you have severe hypertension, heart conditions, or feel dizzy during holds, shorten or skip the hold phase. A 4-4-8 pattern (no hold) still provides benefits from the extended exhale. Always consult your doctor if you have concerns."
      },
      {
        question: "Why is nose breathing important?",
        answer: "Nasal breathing stimulates nitric oxide production in your sinuses. Nitric oxide is a vasodilator—it helps relax blood vessel walls and improve blood flow. This is one of the mechanisms by which slow nasal breathing supports healthy blood pressure."
      },
      {
        question: "What else should I do alongside breathing exercises?",
        answer: "Breathing exercises work best as part of a comprehensive approach: regular physical activity, reducing sodium intake, maintaining a healthy weight, limiting alcohol, managing stress, and getting adequate sleep. The DASH diet and Mediterranean diet are both associated with lower blood pressure."
      }
    ]
  },

  {
    slug: "sleep",
    mode: ModeName.Relax,
    breathingPageSlug: "4-7-8",

    hero: {
      title: "The 'Natural Tranquilizer' for Your Nervous System",
      subtitle: "Fall asleep faster with the 4-7-8 breathing technique",
      intro: "You're exhausted but your mind won't stop. Racing thoughts, tomorrow's to-do list, that awkward thing you said five years ago—your brain replays it all the moment your head hits the pillow. The 4-7-8 breathing technique forces a rhythm that's physically incompatible with stress, helping you transition from 'tired but wired' to actually asleep."
    },

    meta: {
      title: "Fall Asleep in 2 Minutes: 4-7-8 Breathing (The Natural Tranquilizer)",
      description: "Racing thoughts keeping you awake? Fall asleep in 2 minutes with Dr. Weil's 'natural tranquilizer' breathing technique. Used by thousands nightly. Free sleep visualizer.",
      ogTitle: "Fall Asleep in 2 Minutes: 4-7-8 Breathing Technique",
      ogDescription: "Dr. Weil's 'natural tranquilizer' breathing technique helps you fall asleep in minutes. Used by thousands nightly. Free visualizer.",
      twitterTitle: "Fall Asleep in 2 Minutes - 4-7-8 Breathing",
      twitterDescription: "Dr. Weil's 'natural tranquilizer' breathing technique. Fall asleep in minutes without medication. Free visualizer.",
      author: "Resonance Editorial Team",
      datePublished: "2025-12-02",
      dateModified: "2025-12-07"
    },

    keywords: [
      "4-7-8 breathing for sleep",
      "breathing technique for insomnia",
      "fall asleep faster breathing",
      "natural sleep aid breathing",
      "Dr Weil sleep technique",
      "relaxation breathing for sleep",
      "cant sleep racing thoughts",
      "breathing exercises before bed"
    ],

    problem: {
      heading: "The 'Tired But Wired' Trap",
      content: "Your body is exhausted but your sympathetic nervous system hasn't gotten the memo. Screen light, late caffeine, work stress, or just the habit of mental rumination can keep your fight-or-flight system active even as you lie in bed. This creates a frustrating loop: you're tired so you try harder to sleep, which creates more stress, which keeps you awake.",
      symptoms: [
        "Racing thoughts that won't quiet down",
        "Physical restlessness despite exhaustion",
        "Lying awake replaying the day or worrying about tomorrow",
        "Feeling alert the moment you try to sleep",
        "Waking in the middle of the night unable to return to sleep"
      ]
    },

    solution: {
      heading: "4-7-8: A Rhythm Your Body Can't Fight",
      content: "The 4-7-8 technique creates a breathing rhythm that physically forces your nervous system to downshift. By extending your exhale to twice the length of your inhale, you activate the parasympathetic nervous system—the 'rest and digest' mode that enables sleep.",
      whyThisPattern: "Following the visual breathing guide serves double duty: the long exhale slows your heart rate while tracking the visual animation occupies your mind. This 'focus displacement' interrupts the internal monologue that keeps you awake. You're essentially giving your brain a simple, calming task instead of letting it ruminate."
    },

    science: {
      heading: "The Sleep Science",
      points: [
        {
          mechanism: "Respiratory Sinus Arrhythmia",
          explanation: "When you exhale, your heart rate naturally slows. The extended 8-count exhale in this technique maximizes this effect, physically slowing your heart and signaling your brain that it's time to rest."
        },
        {
          mechanism: "Parasympathetic Activation",
          explanation: "Long exhales stimulate the vagus nerve, triggering the parasympathetic nervous system. This is the opposite of the stress response—it lowers heart rate, relaxes muscles, and prepares your body for sleep."
        },
        {
          mechanism: "Focus Displacement",
          explanation: "Following a breath count or visual guide occupies your prefrontal cortex, the part of your brain responsible for planning and worry. This 'crowds out' anxious thoughts and breaks the rumination loop."
        },
        {
          mechanism: "CO₂ Tolerance Training",
          explanation: "The breath hold builds tolerance to carbon dioxide, which reduces the breathlessness and air hunger that can come with anxiety. Over time, this makes your baseline breathing slower and calmer."
        }
      ]
    },

    howTo: {
      steps: [
        {
          name: "Set up your environment",
          instruction: "Dim the lights. Put your phone face-down or use night mode if using the visualizer. Lie on your back or in your preferred sleep position.",
          timing: "5-10 minutes before intended sleep"
        },
        {
          name: "Position your tongue",
          instruction: "Place the tip of your tongue against the ridge of tissue behind your upper front teeth. Keep it there throughout the practice—this is traditional to the technique.",
          timing: "Throughout"
        },
        {
          name: "Start with a full exhale",
          instruction: "Exhale completely through your mouth, making a whooshing sound. Empty your lungs fully to reset.",
          timing: "Start position"
        },
        {
          name: "Inhale for 4 counts",
          instruction: "Close your mouth. Inhale quietly and gently through your nose for a count of 4. Let your belly rise.",
          timing: "4 seconds"
        },
        {
          name: "Hold for 7 counts",
          instruction: "Hold your breath easily for a count of 7. Stay relaxed—don't tense up.",
          timing: "7 seconds"
        },
        {
          name: "Exhale for 8 counts",
          instruction: "Exhale slowly through your mouth with a soft whooshing sound for a count of 8. Let go completely.",
          timing: "8 seconds"
        },
        {
          name: "Repeat for 3-4 cycles",
          instruction: "Complete 3-4 breath cycles. Don't exceed 4 cycles when you're starting out. Put away any devices and let yourself drift off.",
          timing: "About 2 minutes total"
        }
      ],
      tips: [
        "Use dark mode on your device if following the visualizer before bed",
        "Don't force the breath—keep it gentle and quiet",
        "If the hold feels uncomfortable, shorten it to 4-5 counts while keeping the 8-count exhale",
        "The technique works better with consistent practice—try it every night for a week"
      ]
    },

    references: [
      {
        title: "Best Breathing Exercises for Sleep",
        source: "Sleep Foundation",
        url: "https://www.sleepfoundation.org/sleep-hygiene/best-breathing-exercises-for-sleep",
        summary: "Overview of evidence-based breathing techniques for improving sleep onset and quality."
      },
      {
        title: "Relaxation Exercises to Help Fall Asleep",
        source: "Sleep Foundation",
        url: "https://www.sleepfoundation.org/sleep-hygiene/relaxation-exercises-to-help-fall-asleep",
        summary: "How relaxation techniques activate the parasympathetic nervous system to enable sleep."
      },
      {
        title: "Video: Dr. Weil's Breathing Exercises: 4-7-8 Breath",
        source: "DrWeil.com",
        url: "https://www.drweil.com/videos-features/videos/breathing-exercises-4-7-8-breath/",
        summary: "Dr. Weil describes the 4-7-8 technique as a 'natural tranquilizer for the nervous system.'"
      },
      {
        title: "4-7-8 Breathing Method For Sleep and Relaxation",
        source: "Cleveland Clinic",
        url: "https://health.clevelandclinic.org/4-7-8-breathing",
        summary: "Medical overview of the 4-7-8 technique's benefits for sleep and stress reduction."
      },
      {
        title: "Self-Regulation of Breathing as an Adjunctive Treatment of Insomnia",
        source: "PMC/NCBI",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6361823/",
        summary: "Research review on breathing techniques as complementary treatment for insomnia."
      }
    ],

    relatedTechnique: {
      slug: "4-7-8",
      callToAction: "Practice with the full-screen 4-7-8 Breathing visualizer"
    },

    relatedUseCases: [
      {
        slug: "public-speaking",
        teaser: "Stressed at work? Try Box Breathing for high-pressure situations during the day"
      },
      {
        slug: "high-blood-pressure",
        teaser: "High blood pressure? See how the same 4-7-8 technique can help manage hypertension"
      }
    ],

    faqs: [
      {
        question: "How long does it take to fall asleep with 4-7-8 breathing?",
        answer: "Most people feel noticeably calmer after just 2-3 cycles (about 1 minute). Falling asleep varies—some drift off within 5 minutes, others may take longer initially. The technique becomes more effective with regular practice as your body learns to associate the pattern with sleep."
      },
      {
        question: "What if I wake up in the middle of the night?",
        answer: "4-7-8 breathing works well for middle-of-the-night waking too. Don't look at your phone or clock—just lie comfortably and do 3-4 cycles in the dark. The key is not stimulating your brain with light or time-checking."
      },
      {
        question: "Can I use the phone visualizer if blue light affects my sleep?",
        answer: "Yes, but use these precautions: enable night mode or reduce blue light, dim your screen to minimum, and put the phone away after 3-4 cycles. Alternatively, learn the technique by feel so you can practice with eyes closed. The long exhale is what matters most—the visual is just a training aid."
      },
      {
        question: "I can't hold my breath for 7 seconds—is this technique still helpful?",
        answer: "Absolutely. The ratio matters more than the exact numbers. Try 2-3.5-4 or 3-5-6 to maintain the same proportions. The extended exhale is the most important part—keep that twice as long as your inhale, and shorten or skip the hold as needed."
      },
      {
        question: "Should I use this instead of sleep medication?",
        answer: "Breathing techniques are complementary to—not a replacement for—medical treatment. If you're taking sleep medication, continue as prescribed and talk to your doctor about your goals. Many people find that consistent breathing practice allows them to reduce sleep aids over time, but this should always be done with medical guidance."
      }
    ]
  },

  {
    slug: "running",
    mode: ModeName.Sigh,
    breathingPageSlug: "physiological-sigh",

    hero: {
      title: "Recover Faster and Stop Side Stitches",
      subtitle: "The physiological sigh technique for runners",
      intro: "You've just finished a hard sprint and you're bent over, hands on knees, panting heavily—but your breathing isn't helping. Or you're mid-run and a sharp side stitch stops you in your tracks. The physiological sigh, a double-inhale-long-exhale pattern, rapidly resets your respiratory system and brings your heart rate down faster than regular breathing."
    },

    meta: {
      title: "Stop Side Stitches in 30 Seconds: Physiological Sigh for Runners",
      description: "Side stitch ruining your run? Stop pain in 30 seconds and recover 2x faster with the physiological sigh technique. Stanford-tested for runners. Free timer.",
      ogTitle: "Stop Side Stitches in 30 Seconds - Physiological Sigh",
      ogDescription: "Stanford-tested double-inhale breathing technique stops side stitches in 30 seconds and speeds recovery. Free running timer.",
      twitterTitle: "Stop Side Stitches in 30 Seconds - Running Breathing",
      twitterDescription: "Stanford-tested physiological sigh stops side stitches instantly and speeds recovery 2x. Free timer.",
      author: "Resonance Editorial Team",
      datePublished: "2025-12-02",
      dateModified: "2025-12-07"
    },

    keywords: [
      "breathing for side stitches",
      "running recovery breathing",
      "physiological sigh running",
      "stop side stitch while running",
      "breathing technique after sprints",
      "lower heart rate after running",
      "Huberman breathing technique",
      "double inhale breathing exercise"
    ],

    problem: {
      heading: "When Heavy Panting Doesn't Work",
      content: "After intense effort, your instinct is to gasp for air with rapid, shallow breaths. But this often makes things worse—you're not efficiently exchanging gases, and the frantic breathing pattern keeps your stress response elevated. During runs, side stitches (technically called exercise-related transient abdominal pain) can strike suddenly, caused by diaphragm spasm or strain from the bouncing of internal organs.",
      symptoms: [
        "Heavy panting that doesn't seem to bring relief",
        "Heart rate staying elevated long after stopping",
        "Sharp, stabbing side stitch pain during running",
        "Feeling like you can't get a satisfying breath",
        "Dizziness or light-headedness after intense effort"
      ]
    },

    solution: {
      heading: "The Physiological Sigh",
      content: "The physiological sigh is your body's natural reset mechanism—you do it involuntarily when you sob or when transitioning from sleep. The pattern is simple: two inhales through the nose (a big breath followed by a small 'top-up'), then one long exhale through the mouth. This technique, studied at Stanford by Dr. Andrew Huberman and colleagues, brings heart rate down faster than other breathing methods.",
      whyThisPattern: "The double inhale serves a mechanical purpose: during hard exercise, tiny air sacs in your lungs (alveoli) can partially collapse, reducing oxygen uptake. The second 'sip' of air re-inflates these collapsed regions. The long exhale then activates the vagus nerve and shifts you out of the fight-or-flight state."
    },

    science: {
      heading: "The Respiratory Science",
      points: [
        {
          mechanism: "Alveoli Re-inflation",
          explanation: "During intense exercise, some of the 500 million tiny air sacs in your lungs collapse. The double inhale—especially the second 'top-up' breath—pops these alveoli open, immediately improving oxygen intake and CO₂ offload."
        },
        {
          mechanism: "Rapid Heart Rate Reduction",
          explanation: "Stanford research found that the physiological sigh brings heart rate down faster than box breathing or meditation. The long exhale is key—it activates the vagus nerve and triggers the parasympathetic 'rest and digest' response."
        },
        {
          mechanism: "Diaphragm Reset",
          explanation: "Side stitches are often caused by diaphragm spasm or strain. The controlled, deep breaths of the physiological sigh help relax and reset the diaphragm, relieving the cramping."
        },
        {
          mechanism: "CO₂ Balance",
          explanation: "Rapid panting after exercise can blow off too much CO₂, causing dizziness. The controlled exhale of the physiological sigh normalizes CO₂ levels while still allowing efficient oxygen uptake."
        }
      ]
    },

    howTo: {
      steps: [
        {
          name: "Recognize the moment",
          instruction: "Use this technique immediately after a hard effort (sprint finish, hill climb) or when you feel a side stitch developing mid-run.",
          timing: "Immediately when needed"
        },
        {
          name: "Stop or slow down",
          instruction: "For side stitches, slow to a walk. For post-run recovery, stop completely and stand or bend slightly with hands on hips—not on knees.",
          timing: "As needed"
        },
        {
          name: "First inhale",
          instruction: "Take a deep breath in through your nose, filling your lungs about 80-90%. Let your belly expand.",
          timing: "~3 seconds"
        },
        {
          name: "Second 'top-up' inhale",
          instruction: "Without exhaling, take a second, shorter sip of air through your nose. This pops open collapsed air sacs. Don't force it—just a gentle top-up.",
          timing: "~1-2 seconds"
        },
        {
          name: "Long exhale",
          instruction: "Exhale slowly and completely through your mouth. Make it longer than both inhales combined. Feel your belly fall.",
          timing: "~6-8 seconds"
        },
        {
          name: "Repeat as needed",
          instruction: "For acute relief (side stitch), 2-3 sighs may be enough. For post-run recovery, continue for 1-2 minutes until your breathing normalizes.",
          timing: "2-3 cycles or 1-2 minutes"
        }
      ],
      tips: [
        "Practice during easy runs so the technique is automatic when you need it",
        "For side stitches, try pressing on the painful spot while exhaling",
        "Standing upright or with a slight forward lean helps—don't hunch over",
        "The exhale is the most important part—make it slow and complete"
      ]
    },

    references: [
      {
        title: "Brief structured respiration practices enhance mood and reduce physiological arousal",
        source: "Cell Reports Medicine (Stanford Study)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9873947/",
        summary: "Stanford study showing cyclic sighing (physiological sigh) outperformed other breathing techniques and meditation for stress reduction and mood improvement."
      },
      {
        title: "How stress affects your brain and how to reverse it",
        source: "Stanford Medicine Scope Blog",
        url: "https://scopeblog.stanford.edu/2020/10/07/how-stress-affects-your-brain-and-how-to-reverse-it/",
        summary: "Dr. Andrew Huberman explains the neuroscience of stress and how physiological sighing works as a real-time intervention."
      },
      {
        title: "The Physiological Sigh: A 30-Second Breathing Exercise to Lower Stress",
        source: "Oura Ring Blog",
        url: "https://ouraring.com/blog/what-is-the-physiological-sigh-how-to-do-it/",
        summary: "Practical guide to the physiological sigh technique with HRV and heart rate data."
      },
      {
        title: "Side Stitch While Running: Prevention & Treatment",
        source: "Runner's World",
        url: "https://www.runnersworld.com/health-injuries/a20838539/how-to-beat-side-stitches/",
        summary: "Overview of side stitch causes and breathing techniques for prevention and treatment."
      },
      {
        title: "Stitch When Running: How to Stop One, Prevention & More",
        source: "Healthline",
        url: "https://www.healthline.com/health/stitch-when-running",
        summary: "Medical overview of exercise-related transient abdominal pain and breathing remedies."
      }
    ],

    relatedTechnique: {
      slug: "physiological-sigh",
      callToAction: "Practice with the full-screen Physiological Sigh visualizer"
    },

    relatedUseCases: [
      {
        slug: "public-speaking",
        teaser: "Use the same rapid-calm technique before races to settle pre-competition nerves"
      },
      {
        slug: "sleep",
        teaser: "Better sleep aids recovery. Try 4-7-8 breathing before bed after training days"
      }
    ],

    faqs: [
      {
        question: "Can I do this while still running?",
        answer: "Yes, for side stitches. Slow to an easy jog or walk, then do 2-3 physiological sighs. Many runners find the stitch releases within 30-60 seconds. For post-sprint recovery, it's better to stop completely for the full benefit."
      },
      {
        question: "Why is standing upright better than bending over?",
        answer: "Bending over with hands on knees compresses your diaphragm and lungs, making it harder to take deep breaths. Standing upright or with a slight forward lean (hands on hips) opens your chest and allows for fuller breaths and better recovery."
      },
      {
        question: "How is this different from just taking deep breaths?",
        answer: "The double inhale is the key difference. Regular deep breaths don't re-inflate collapsed alveoli the way the second 'sip' of air does. The physiological sigh is your body's natural mechanism—you do it involuntarily when you sob or yawn. We're just using it deliberately."
      },
      {
        question: "Should I breathe through my nose or mouth while running?",
        answer: "During easy running, nasal breathing is ideal when possible—it filters air, produces nitric oxide, and promotes diaphragmatic breathing. During hard efforts, mouth breathing is natural and necessary. For the physiological sigh specifically, inhale through your nose and exhale through your mouth."
      },
      {
        question: "Why do I get side stitches in the first place?",
        answer: "The exact cause isn't fully understood, but the leading theories involve diaphragm spasm from the jarring of running, strain on ligaments connecting the diaphragm to internal organs, and reduced blood flow to the diaphragm during exercise. Warming up properly, avoiding large meals before running, and strengthening your core can all help prevent them."
      }
    ]
  },
  {
    slug: "anxiety",
    mode: ModeName.Box,
    breathingPageSlug: "box",

    hero: {
      title: "How to Stop Anxiety in 60 Seconds with Box Breathing",
      subtitle: "The Navy SEAL breathing method that calms racing thoughts and chest tightness",
      intro: "Your chest feels tight. Your thoughts won't stop racing. You feel like you can't catch your breath. Anxiety isn't a weakness—it's your nervous system stuck in overdrive. Box breathing, the same technique Navy SEALs use before high-stress missions, can interrupt this anxiety response in under a minute."
    },

    meta: {
      title: "Stop Anxiety in 60 Seconds: Box Breathing Technique (Navy SEAL Method)",
      description: "Chest tightness. Racing thoughts. Constant worry. Stop anxiety in 60 seconds with the Navy SEAL box breathing technique. Used by thousands daily. Free guided visualizer.",
      ogTitle: "Stop Anxiety in 60 Seconds - Navy SEAL Box Breathing",
      ogDescription: "The breathing technique Navy SEALs use for anxiety. Stop racing thoughts and chest tightness in 60 seconds. Free visualizer.",
      twitterTitle: "Stop Anxiety in 60 Seconds - Box Breathing Technique",
      twitterDescription: "Navy SEAL breathing technique stops anxiety in 60 seconds. Free guided visualizer.",
      author: "Resonance Editorial Team",
      datePublished: "2025-12-07",
      dateModified: "2025-12-07"
    },

    keywords: [
      "breathing exercises for anxiety",
      "breathing techniques for anxiety",
      "anxiety breathing exercises",
      "best breathing for anxiety",
      "how to calm anxiety with breathing",
      "breathing to reduce anxiety",
      "box breathing for anxiety",
      "tactical breathing anxiety",
      "Navy SEAL breathing anxiety",
      "stop anxiety fast breathing",
      "anxiety relief breathing",
      "breathing to calm anxiety attack"
    ],

    problem: {
      heading: "Why Anxiety Makes It Hard to Breathe",
      content: "When anxiety strikes, your body activates the sympathetic nervous system—the same system that kicks in during actual danger. Your breathing becomes rapid and shallow (hyperventilation), which paradoxically makes you feel like you're not getting enough air. This creates a vicious cycle: shallow breathing → more CO₂ expelled → brain perceives danger → more anxiety → even shallower breathing.",
      symptoms: [
        "Chest tightness and difficulty taking deep breaths",
        "Racing thoughts that won't stop",
        "Constant worry about worst-case scenarios",
        "Feeling on edge or 'keyed up' all day",
        "Difficulty concentrating or mind going blank",
        "Physical tension (clenched jaw, tight shoulders)",
        "Rapid heartbeat even when resting",
        "Feeling like something bad is about to happen"
      ]
    },

    solution: {
      heading: "Box Breathing: The 4-4-4-4 Pattern That Stops Anxiety",
      content: "Box breathing—also called square breathing or tactical breathing—uses four equal phases (inhale-hold-exhale-hold) to regulate your autonomic nervous system. The 4-second rhythm is slow enough to activate your parasympathetic 'rest and digest' system, but fast enough that it doesn't trigger panic if you're already anxious.",
      whyThisPattern: "The breath holds are the secret weapon. When you pause your breathing, CO₂ builds up slightly in your blood. This signals to your brain that you're safe—you wouldn't hold your breath if you were actually in danger. The equal counts give your racing mind a simple structure to follow, breaking the rumination loop that feeds anxiety."
    },

    science: {
      heading: "Why Box Breathing Works for Anxiety",
      points: [
        {
          mechanism: "Activates the Vagus Nerve",
          explanation: "Slow, controlled breathing stimulates the vagus nerve—the main nerve of your parasympathetic nervous system. This triggers the 'relaxation response' that counteracts the fight-or-flight anxiety response. Studies show slow breathing increases vagal tone and heart rate variability (HRV), both markers of better stress resilience."
        },
        {
          mechanism: "Regulates CO₂ Levels",
          explanation: "Anxiety often causes hyperventilation (rapid, shallow breathing), which lowers CO₂ in your blood. Low CO₂ makes blood vessels constrict, reducing oxygen delivery to your brain—which paradoxically makes you feel breathless. Box breathing's holds allow CO₂ to normalize, signaling safety to your nervous system."
        },
        {
          mechanism: "Breaks the Rumination Loop",
          explanation: "Anxious thoughts spiral because your prefrontal cortex (rational brain) is overwhelmed by your amygdala (fear center). The 4-4-4-4 count gives your mind a simple, repetitive task—counting—which engages your prefrontal cortex and interrupts the rumination cycle. It's like a pattern interrupt for your brain."
        },
        {
          mechanism: "Lowers Cortisol and Heart Rate",
          explanation: "Multiple studies show slow breathing reduces cortisol (your primary stress hormone) and lowers heart rate within minutes. A 2017 study found resonance-frequency breathing (similar to box breathing) reduced blood pressure reactivity to stress and improved mood compared to controls."
        }
      ]
    },

    howTo: {
      steps: [
        {
          name: "Find a quiet space",
          instruction: "Sit comfortably with your back supported. Close your eyes or soften your gaze. Place one hand on your chest and one on your belly to feel your breath.",
          timing: "15 seconds"
        },
        {
          name: "Exhale completely",
          instruction: "Start by exhaling all the air from your lungs through your mouth. This creates a 'clean slate' for the pattern.",
          timing: "4 seconds"
        },
        {
          name: "Inhale through nose (count to 4)",
          instruction: "Breathe in slowly through your nose while counting to 4. Feel your belly expand first, then your chest. Keep it gentle—no gulping air.",
          timing: "4 seconds"
        },
        {
          name: "Hold (count to 4)",
          instruction: "Pause at the top of your inhale. Keep your throat soft—don't clamp down. This should feel like a gentle pause, not straining.",
          timing: "4 seconds"
        },
        {
          name: "Exhale through nose or mouth (count to 4)",
          instruction: "Release the air slowly and smoothly through your nose or pursed lips. Feel your belly fall, then your chest. Make it gentle and controlled.",
          timing: "4 seconds"
        },
        {
          name: "Hold at the bottom (count to 4)",
          instruction: "Pause with empty lungs. Keep your shoulders and jaw relaxed. This is the bottom of the box.",
          timing: "4 seconds"
        },
        {
          name: "Repeat for 5-10 cycles",
          instruction: "Continue the 4-4-4-4 pattern for 1-3 minutes (about 5-10 full cycles). If you feel dizzy, shorten the holds to 2-3 seconds or skip them entirely.",
          timing: "1-3 minutes"
        }
      ],
      tips: [
        "If 4 seconds feels too long, start with 3-3-3-3 and work up gradually",
        "Keep your breathing silent and smooth—no audible inhales or exhales",
        "If you feel dizzy or tingly, you're breathing too deeply. Make your breaths smaller and quieter.",
        "Practice daily even when not anxious—this 'trains' your nervous system to respond faster when you need it",
        "Use the visualizer on this page for guided pacing—it removes the mental effort of counting"
      ]
    },

    references: [
      {
        title: "Laborde et al., 2022 - Voluntary slow breathing increases vagally mediated HRV",
        source: "International Journal of Psychophysiology (Meta-analysis)",
        url: "https://pubmed.ncbi.nlm.nih.gov/35623448/",
        summary: "Systematic review/meta-analysis found voluntary slow breathing increases vagally mediated heart rate variability during sessions, acutely after sessions, and after multi-session training—indicating improved stress regulation."
      },
      {
        title: "Steffen et al., 2017 - Resonance breathing reduces stress reactivity",
        source: "Frontiers in Public Health (RCT)",
        url: "https://pubmed.ncbi.nlm.nih.gov/28890890/",
        summary: "Single-session study showed breathing at personal resonance frequency reduced blood pressure reactivity during a stress task and improved mood compared to control or faster breathing."
      },
      {
        title: "Fincham et al., 2023 - Breathwork reduces anxiety and depression",
        source: "Scientific Reports (Meta-analysis)",
        url: "https://pubmed.ncbi.nlm.nih.gov/36624160/",
        summary: "Across randomized controlled trials, breathwork interventions produced small-to-moderate reductions in subjective stress, anxiety, and depressive symptoms versus non-breathwork controls."
      },
      {
        title: "Jerath et al., 2015 - Physiology of slow breathing",
        source: "Medical Hypotheses (Review)",
        url: "https://pubmed.ncbi.nlm.nih.gov/25669897/",
        summary: "Review explains how slow breathing shifts autonomic balance toward parasympathetic dominance through vagal afferent signaling, improving emotional regulation and reducing anxiety."
      },
      {
        title: "Ma et al., 2017 - Breathing reduces cortisol",
        source: "Frontiers in Psychology (Study)",
        url: "https://pubmed.ncbi.nlm.nih.gov/28676790/",
        summary: "Single session of slow breathing significantly reduced salivary cortisol levels and subjective anxiety in stressed adults compared to control group."
      }
    ],

    disclaimer: "This breathing technique is not a substitute for professional mental health treatment. If you experience severe anxiety, panic attacks, or suicidal thoughts, please contact a mental health professional or call the 988 Suicide & Crisis Lifeline.",

    relatedTechnique: {
      slug: "box",
      callToAction: "Master the full box breathing technique with research, tips, and guided practice"
    },

    relatedUseCases: [
      {
        slug: "panic-attacks",
        teaser: "Acute anxiety turning into full panic? Try the physiological sigh for rapid relief in 30 seconds"
      },
      {
        slug: "public-speaking",
        teaser: "Performance anxiety before speeches? Box breathing stops stage fright in 60 seconds"
      }
    ],

    faqs: [
      {
        question: "How is anxiety breathing different from panic attack breathing?",
        answer: "Anxiety is chronic and ongoing—your nervous system is in a sustained state of elevated arousal, causing persistent worry, muscle tension, and shallow breathing throughout the day. A panic attack is acute and intense—a sudden surge of overwhelming fear with rapid heartbeat, hyperventilation, and feeling like you might die or lose control. For chronic anxiety, box breathing (4-4-4-4) works well because it's sustainable for longer sessions. For panic attacks, the physiological sigh (double-inhale, long exhale) often works faster because it rapidly offloads CO₂ and interrupts the acute hyperventilation cycle."
      },
      {
        question: "Can box breathing replace anti-anxiety medication?",
        answer: "Box breathing is a powerful self-regulation tool, but it's not a replacement for medication or therapy. Think of it as a complementary skill, like exercise or sleep hygiene. Studies show breathwork produces small-to-moderate reductions in anxiety symptoms—meaningful, but not miracle-level. If you're on medication, continue it and add box breathing as a daily practice. If you want to reduce medication, work with your doctor to create a plan. Many people find breathwork most effective when combined with cognitive-behavioral therapy (CBT) and lifestyle changes (exercise, sleep, caffeine reduction)."
      },
      {
        question: "How many times per day should I practice box breathing for anxiety?",
        answer: "For chronic anxiety, practice twice daily: once in the morning (to set a calm baseline for the day) and once before bed (to prevent anxious rumination). Each session should be 3-5 minutes (10-15 cycles). Also use it 'in the moment' whenever you notice anxiety rising—before meetings, during stressful tasks, or when you catch yourself spiraling into worry. The key is consistency: daily practice 'trains' your nervous system to respond faster when you need it. Most studies showing anxiety benefits used 5-10 minutes daily for 4-8 weeks."
      },
      {
        question: "Why do the breath holds help with anxiety?",
        answer: "The holds serve two purposes: (1) They allow CO₂ to build up slightly in your blood, which signals to your brain that you're safe—you wouldn't hold your breath if you were in actual danger. This breaks the hyperventilation cycle common in anxiety. (2) The holds give your racing mind a clear structure to follow, interrupting the rumination loop. However, if holds make you feel MORE anxious (some people don't like the sensation), skip them entirely and just do 4-second inhale, 4-second exhale with no pauses. The slow pace is what matters most."
      },
      {
        question: "I felt more anxious when I tried this. What did I do wrong?",
        answer: "This is common and doesn't mean you did anything wrong. Possible causes: (1) You held your breath too forcefully—holds should be gentle pauses, not straining. Try shorter holds (2 seconds) or skip holds entirely. (2) You breathed too deeply—anxiety often makes people take big gulps of air, which can trigger more panic. Keep breaths small, quiet, and smooth. (3) You focused too hard on 'doing it right'—this activates your anxious perfectionism. Use a guided visualizer (like the one on this page) so you don't have to think about counting. (4) You're in the middle of a panic attack—switch to physiological sighs (double-inhale, long exhale) for acute episodes; box breathing works better for ongoing anxiety."
      },
      {
        question: "How long does it take to feel less anxious?",
        answer: "You may notice a subtle shift within the first 1-3 minutes of practice (lower heart rate, less chest tightness). However, the biggest benefits come from consistent daily practice over weeks. Studies show 4-8 weeks of regular slow breathing produces measurable reductions in anxiety symptoms, resting heart rate, and stress hormone levels. Think of it like strength training—one session helps a bit, but the real changes happen with sustained practice. Most people report noticeable anxiety reduction after 2-3 weeks of twice-daily practice."
      }
    ]
  },
  {
    slug: "panic-attacks",
    mode: ModeName.Sigh,
    breathingPageSlug: "physiological-sigh",

    hero: {
      title: "How to Stop a Panic Attack in 30 Seconds",
      subtitle: "The physiological sigh: Stanford's double-inhale technique for acute panic",
      intro: "Your heart is pounding out of your chest. You can't catch your breath. Your hands are tingling. You feel like you're dying or going insane. This is a panic attack—and it's terrifying, but it's not dangerous. The physiological sigh, a double-inhale-long-exhale pattern, can interrupt the hyperventilation cycle and bring you back to baseline in under a minute."
    },

    meta: {
      title: "Stop a Panic Attack in 30 Seconds: Physiological Sigh Technique",
      description: "Heart racing. Can't breathe. Feel like you're dying. Stop a panic attack in 30 seconds with the physiological sigh. Stanford-tested for acute panic. Free timer.",
      ogTitle: "Stop a Panic Attack in 30 Seconds - Physiological Sigh",
      ogDescription: "Stanford-tested breathing technique stops panic attacks in 30 seconds. Used for acute hyperventilation and overwhelming fear. Free timer.",
      twitterTitle: "Stop Panic Attack in 30 Seconds - Physiological Sigh",
      twitterDescription: "Stanford-tested double-inhale technique stops panic attacks in seconds. Free timer.",
      author: "Resonance Editorial Team",
      datePublished: "2025-12-07",
      dateModified: "2025-12-07"
    },

    keywords: [
      "breathing for panic attacks",
      "stop panic attack fast",
      "panic attack breathing technique",
      "how to stop a panic attack",
      "breathing during panic attack",
      "calm panic attack breathing",
      "physiological sigh panic",
      "hyperventilation panic attack",
      "panic attack relief breathing",
      "acute panic breathing"
    ],

    problem: {
      heading: "What Happens During a Panic Attack",
      content: "A panic attack is your body's alarm system firing at maximum intensity—even though there's no actual danger. Your amygdala (fear center) floods your system with adrenaline, your breathing becomes rapid and shallow (hyperventilation), and you blow off too much CO₂. Low CO₂ causes blood vessels to constrict, making you feel dizzy, tingly, and short of breath—which makes you panic MORE, creating a vicious spiral.",
      symptoms: [
        "Heart pounding or racing (tachycardia)",
        "Hyperventilating—rapid, shallow breathing",
        "Feeling like you can't get enough air (air hunger)",
        "Tingling or numbness in hands/face (paresthesia)",
        "Dizziness, lightheadedness, or feeling faint",
        "Chest pain or tightness",
        "Fear of dying, losing control, or 'going crazy'",
        "Derealization (feeling detached from reality)",
        "Sweating, trembling, or shaking",
        "Nausea or stomach distress"
      ]
    },

    solution: {
      heading: "Physiological Sigh: The Double-Inhale That Stops Panic",
      content: "The physiological sigh is a breathing pattern your body does naturally when you're stressed—you've probably noticed yourself doing spontaneous 'double-sniff' breaths during intense moments. Scientists at Stanford identified this pattern and found it's the fastest way to offload CO₂ and calm your nervous system. It's specifically designed for ACUTE panic, not chronic anxiety.",
      whyThisPattern: "The double-inhale (big breath + small top-up breath) rapidly re-inflates collapsed alveoli (tiny air sacs in your lungs), which improves gas exchange. The LONG exhale (6-10 seconds) is where the magic happens—it activates your vagus nerve and slows your heart rate. Unlike box breathing (which has holds that can feel scary during panic), the physiological sigh has no holds and focuses on a powerful exhale that gives you something concrete to DO when you're spiraling."
    },

    science: {
      heading: "Why the Physiological Sigh Stops Panic Attacks",
      points: [
        {
          mechanism: "Rapidly Offloads CO₂",
          explanation: "During a panic attack, you're hyperventilating—breathing too fast and shallow, which lowers CO₂ in your blood. Low CO₂ causes blood vessels to constrict and creates the tingling, dizzy sensations that make panic worse. The physiological sigh's long exhale (6-10 seconds) allows CO₂ to normalize quickly, signaling to your brainstem that you're safe."
        },
        {
          mechanism: "Activates Vagus Nerve Fast",
          explanation: "The vagus nerve is your body's 'brake pedal' for the panic response. Long, slow exhales stimulate vagal afferents that signal your brainstem to activate the parasympathetic nervous system. A 2023 Stanford study (Balban et al.) found cyclic sighing produced the largest improvements in mood and heart rate variability of any breathing pattern tested—outperforming box breathing and mindfulness meditation."
        },
        {
          mechanism: "Re-Inflates Collapsed Alveoli",
          explanation: "When you're breathing rapidly and shallowly during panic, some of the tiny air sacs in your lungs (alveoli) collapse, reducing oxygen exchange efficiency. The double-inhale mechanically pops these alveoli back open. This is why sighing feels so relieving—it's your body's natural way of resetting lung mechanics."
        },
        {
          mechanism: "Gives You Control During Chaos",
          explanation: "Panic attacks create a feeling of total loss of control. The physiological sigh gives you a specific, physical action to focus on—two sharp inhales, one long exhale—which interrupts the 'I'm dying' thought spiral. You can't stop the panic attack instantly, but you CAN control your exhale, and that sense of agency helps break the feedback loop."
        }
      ]
    },

    howTo: {
      steps: [
        {
          name: "Recognize you're having a panic attack",
          instruction: "First, acknowledge what's happening: 'This is a panic attack. It's terrifying but not dangerous. It will pass.' This cognitive label helps activate your prefrontal cortex.",
          timing: "5 seconds"
        },
        {
          name: "First inhale (deep, through nose)",
          instruction: "Take a deep breath in through your nose until your lungs feel about 80% full. Don't strain—make it smooth.",
          timing: "3 seconds"
        },
        {
          name: "Top-up inhale (small sip of air)",
          instruction: "Without exhaling, take a small second sip of air through your nose to completely fill your lungs. This is the 'double-inhale' that re-inflates collapsed alveoli.",
          timing: "1-2 seconds"
        },
        {
          name: "Long, slow exhale (through mouth)",
          instruction: "Exhale slowly through pursed lips or an open mouth for as long as you comfortably can (aim for 6-10 seconds). Let all the air drain out—this is the key step.",
          timing: "6-10 seconds"
        },
        {
          name: "Repeat 3-5 times",
          instruction: "Do 3-5 full cycles of the pattern. You should notice your heart rate slowing and the tingling/dizziness decreasing. If not, keep going—it won't hurt you.",
          timing: "1-2 minutes total"
        },
        {
          name: "Transition to normal breathing",
          instruction: "Once the acute panic subsides, switch to gentle, slow breathing (no holds) to prevent re-triggering. Sit or lie down if you feel weak.",
          timing: "As needed"
        }
      ],
      tips: [
        "The exhale should be LONGER than the inhale—this is critical for activating your vagus nerve",
        "If you can't breathe through your nose (too congested/panicked), do mouth breathing—it still works",
        "Don't force the double-inhale if it feels scary—a single deep inhale + long exhale is fine",
        "Practice this when you're NOT panicking so it's automatic when you need it",
        "Combine with grounding techniques: name 5 things you can see, 4 you can touch, 3 you can hear"
      ]
    },

    references: [
      {
        title: "Balban et al., 2023 - Cyclic sighing reduces anxiety better than meditation",
        source: "Cell Reports Medicine (RCT)",
        url: "https://pubmed.ncbi.nlm.nih.gov/36630953/",
        summary: "Month-long randomized study comparing breathwork to mindfulness found cyclic sighing (physiological sigh pattern) produced the largest improvements in mood and respiratory rate—outperforming box breathing and meditation."
      },
      {
        title: "Li et al., 2016 - Brainstem circuits for sighing",
        source: "Nature (Mechanism Study)",
        url: "https://pubmed.ncbi.nlm.nih.gov/26855425/",
        summary: "Identified the peptidergic neurons in the brainstem that control sigh generation. Sighs re-inflate collapsed alveoli and maintain lung compliance—explaining why they feel so relieving during stress."
      },
      {
        title: "Meuret et al., 2010 - Hyperventilation and panic disorder",
        source: "Depression and Anxiety (Clinical Review)",
        url: "https://pubmed.ncbi.nlm.nih.gov/19798748/",
        summary: "Hyperventilation is a core feature of panic attacks, lowering CO₂ and creating physical symptoms (dizziness, tingling). Slowing breathing to normalize CO₂ is a first-line behavioral intervention."
      },
      {
        title: "Severs et al., 2022 - Physiology of sighing",
        source: "Biological Psychology (Review)",
        url: "https://pubmed.ncbi.nlm.nih.gov/35288214/",
        summary: "Sighs prevent alveolar collapse and increase with stress/hypoxia. PreBötzinger complex in brainstem controls sigh frequency—providing automatic lung maintenance and emotional regulation."
      },
      {
        title: "Craske & Barlow, 2014 - Panic disorder treatment",
        source: "Annual Review of Clinical Psychology (Review)",
        url: "https://pubmed.ncbi.nlm.nih.gov/24387234/",
        summary: "Cognitive-behavioral therapy for panic disorder includes interoceptive exposure (learning to tolerate physical sensations) and breathing retraining to reduce hyperventilation sensitivity."
      }
    ],

    disclaimer: "Panic attacks can feel like a heart attack or other medical emergency. If you're experiencing chest pain, shortness of breath, or other severe symptoms for the first time, call 911 to rule out a medical cause. This breathing technique is not a substitute for professional mental health treatment. If you have frequent panic attacks, please see a therapist trained in cognitive-behavioral therapy (CBT) for panic disorder.",

    relatedTechnique: {
      slug: "physiological-sigh",
      callToAction: "Learn the full physiological sigh technique with research, tips, and guided timer"
    },

    relatedUseCases: [
      {
        slug: "anxiety",
        teaser: "Chronic anxiety instead of acute panic? Try box breathing for ongoing nervous system regulation"
      },
      {
        slug: "public-speaking",
        teaser: "Pre-speech panic? Use this technique 60 seconds before you step on stage"
      }
    ],

    faqs: [
      {
        question: "What's the difference between a panic attack and anxiety?",
        answer: "Anxiety is like a simmering pot—ongoing worry, muscle tension, and vigilance that can last hours, days, or weeks. A panic attack is like the pot boiling over—a sudden, intense surge of overwhelming fear with physical symptoms (racing heart, hyperventilation, feeling like you're dying) that peaks within 10 minutes. Panic attacks are acute episodes; anxiety is a chronic state. Use the physiological sigh for panic attacks (acute relief). Use box breathing for ongoing anxiety (sustained regulation)."
      },
      {
        question: "Can I use this during a panic attack, or will it make it worse?",
        answer: "Yes, use it during a panic attack—that's exactly what it's designed for. The key is the LONG EXHALE (6-10 seconds). Some people worry the double-inhale will make hyperventilation worse, but the long exhale immediately offloads the excess air. If the double-inhale feels scary, skip it and just do: single deep inhale + very long exhale. The exhale is what matters most for stopping panic."
      },
      {
        question: "How is this different from box breathing for panic?",
        answer: "Box breathing (4-4-4-4 with holds) is great for chronic anxiety but can feel scary during acute panic—the breath holds might trigger 'I can't breathe' fears when you're already hyperventilating. The physiological sigh has NO holds and focuses on a powerful exhale, which gives you something concrete to DO when you're spiraling. Research (Balban 2023) found cyclic sighing outperformed box breathing for mood improvement."
      },
      {
        question: "I felt tingling in my hands and face. Is that normal?",
        answer: "Yes—that's called paresthesia and it's caused by low CO₂ from hyperventilation during the panic attack. It's not dangerous (you're not having a stroke or heart attack), but it's terrifying. The tingling should DECREASE after 3-5 physiological sighs as your CO₂ normalizes. If it persists, you might still be breathing too fast—slow down and focus on making each exhale as long as possible."
      },
      {
        question: "Can this technique prevent future panic attacks?",
        answer: "The physiological sigh is an 'in-the-moment' tool for stopping acute panic, not a prevention strategy. To reduce panic attack frequency, you need: (1) Daily breathwork practice (box breathing or coherent breathing) to train your nervous system. (2) Cognitive-behavioral therapy (CBT) to address the thought patterns that trigger panic. (3) Exposure therapy to reduce fear of the physical sensations. (4) Lifestyle changes (sleep, caffeine reduction, exercise). Think of the physiological sigh as your emergency brake, not your daily prevention."
      },
      {
        question: "What if I can't do the double-inhale because I'm panicking too hard?",
        answer: "That's fine—skip the double-inhale. Just do: one deep inhale + one VERY long exhale (8-10 seconds). The long exhale is the critical part for activating your vagus nerve and slowing your heart rate. The double-inhale helps with lung mechanics, but it's not essential if it feels overwhelming. Even a single inhale + long exhale will interrupt the hyperventilation cycle."
      }
    ]
  }
];

export const useCasePageMap: Record<string, UseCasePageContent> = Object.fromEntries(
  useCasePages.map((page) => [page.slug, page])
) as Record<string, UseCasePageContent>;
