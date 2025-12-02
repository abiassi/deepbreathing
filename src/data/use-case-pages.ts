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
      title: "Breathing for Public Speaking - Stop Stage Fright in 60 Seconds",
      description: "Learn the Navy SEAL box breathing technique to eliminate stage fright and presentation anxiety. Science-backed method to calm nerves before any speech or meeting.",
      ogTitle: "Stop Stage Fright in 60 Seconds - Box Breathing for Public Speaking",
      ogDescription: "The same breathing technique used by Navy SEALs to stay calm under pressure. Master presentation anxiety with this proven method.",
      twitterTitle: "Box Breathing for Public Speaking - Stop Stage Fright Fast",
      twitterDescription: "Navy SEAL breathing method to eliminate presentation anxiety in 60 seconds.",
      author: "Resonance Editorial Team",
      datePublished: "2025-12-02",
      dateModified: "2025-12-02"
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
      title: "Breathing Exercises for High Blood Pressure - 4-7-8 Technique",
      description: "Learn the 4-7-8 breathing technique to naturally support healthy blood pressure. Harvard research shows slow breathing can reduce systolic pressure by up to 10 points.",
      ogTitle: "Lower Blood Pressure Naturally - 4-7-8 Breathing Technique",
      ogDescription: "Science-backed breathing exercise that can reduce blood pressure. Developed by Harvard-trained Dr. Andrew Weil.",
      twitterTitle: "4-7-8 Breathing for Blood Pressure - Natural Support",
      twitterDescription: "Harvard-backed breathing technique to naturally support healthy blood pressure levels.",
      author: "Resonance Editorial Team",
      datePublished: "2025-12-02",
      dateModified: "2025-12-02"
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
      title: "4-7-8 Breathing for Sleep - Fall Asleep Faster Tonight",
      description: "Learn the 4-7-8 breathing technique to fall asleep faster. Dr. Andrew Weil's 'natural tranquilizer' method backed by sleep science research.",
      ogTitle: "Fall Asleep Faster with 4-7-8 Breathing - The Natural Tranquilizer",
      ogDescription: "Dr. Weil's breathing technique to calm racing thoughts and fall asleep in minutes. Science-backed sleep aid.",
      twitterTitle: "4-7-8 Breathing for Insomnia - Fall Asleep Faster",
      twitterDescription: "The 'natural tranquilizer' breathing technique to calm your nervous system and fall asleep.",
      author: "Resonance Editorial Team",
      datePublished: "2025-12-02",
      dateModified: "2025-12-02"
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
      title: "Breathing for Running Recovery - Stop Side Stitches Fast",
      description: "Learn the physiological sigh technique to recover faster after runs and eliminate side stitches. Stanford research-backed breathing method for runners.",
      ogTitle: "Physiological Sigh for Runners - Recover Faster, Stop Side Stitches",
      ogDescription: "The double-inhale breathing technique that brings your heart rate down faster and eliminates side stitches mid-run.",
      twitterTitle: "Running Recovery Breathing - Stop Side Stitches in Seconds",
      twitterDescription: "Stanford-researched physiological sigh technique for faster running recovery.",
      author: "Resonance Editorial Team",
      datePublished: "2025-12-02",
      dateModified: "2025-12-02"
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
  }
];

export const useCasePageMap: Record<string, UseCasePageContent> = Object.fromEntries(
  useCasePages.map((page) => [page.slug, page])
) as Record<string, UseCasePageContent>;
