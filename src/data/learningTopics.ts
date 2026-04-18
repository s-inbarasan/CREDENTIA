import { Topic } from '../types';

export const LEARNING_TOPICS: Topic[] = [

  {
    id: "B-M1",
    chapterId: "B",
    chapterTitle: "Cybersecurity Fundamentals: Train Your Brain",
    title: "The Hacker Mindset & Threat Modeling",
    level: "Beginner",
    icon: "Brain",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Thinking Like an Attacker",
        content: "Cybersecurity is not just about firewalls and encryption; it is fundamentally about understanding how adversaries think. The 'Hacker Mindset' involves looking at systems, processes, and people not for how they are intended to work, but for how they can be broken, bypassed, or manipulated. Threat modeling formalizes this mindset into a structured approach to identify and mitigate risks before they are exploited.",
        learningObjectives: [
          "Understand the psychological approach of a threat actor.",
          "Identify the difference between vulnerabilities, threats, and risks.",
          "Apply basic threat modeling principles (STRIDE) to everyday scenarios."
        ]
      },
      {
        id: "s2",
        type: "concept",
        title: "Deconstructing the Attack Surface",
        definition: "An attack surface is the total sum of vulnerabilities that can be exploited to carry out a security breach. Threat modeling is the process of identifying these vulnerabilities and defining countermeasures.",
        howItWorks: "Adversaries follow a 'Kill Chain': Reconnaissance, Weaponization, Delivery, Exploitation, Installation, Command & Control, and Actions on Objectives. By understanding this chain, defenders can place roadblocks at every stage. Threat modeling frameworks like STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) help systematically identify these roadblocks.",
        example: "Instead of asking 'Is our login page secure?', a threat modeler asks: 'How could an attacker bypass the login? Can they brute-force it? Can they intercept the session token? Can they socially engineer a password reset?'",
        caseStudy: {
          title: "The Target HVAC Breach (2013)",
          description: "Attackers didn't attack Target's highly secure payment systems directly. Instead, they compromised a third-party HVAC vendor using a phishing email, stole their vendor portal credentials, and pivoted through the network to reach the Point of Sale (POS) systems.",
          impact: "41 million customer payment card accounts were compromised, costing Target over $292 million and leading to the resignation of the CEO."
        },
        whyItMatters: "Defenders must secure every possible entry point, while an attacker only needs to find one weak link. Adopting the hacker mindset shifts defense from reactive patching to proactive architectural security.",
        keyPrinciple: "Assume Breach: Operate under the assumption that the network is already compromised, and design systems to limit lateral movement and data exfiltration."
      },
      {
        id: "s3",
        type: "decision",
        title: "Threat Modeling Exercise",
        scenario: "You are deploying a new internal HR portal that allows employees to view their payslips. The portal is only accessible via the corporate VPN. During a threat modeling session, a developer argues that because it's on the VPN, it doesn't need Multi-Factor Authentication (MFA).",
        question: "Applying the 'Assume Breach' principle, how should you respond?",
        options: [
          "Agree. The VPN provides sufficient perimeter encryption and authentication.",
          "Disagree. If an attacker compromises a single employee's laptop, the VPN is bypassed, granting free access to the HR portal.",
          "Agree, but only if the VPN uses strong AES-256 encryption."
        ],
        correctAnswerIndex: 1,
        explanation: "The 'Assume Breach' mindset dictates that perimeter defenses (like a VPN) will eventually fail or be bypassed (e.g., via malware on an employee's device). Internal systems must have their own robust authentication (Zero Trust).",
        insight: "In modern enterprise security, the perimeter is dead. Identity is the new perimeter."
      },
      {
        id: "s4",
        type: "summary",
        title: "Strategic Takeaways",
        content: "Developing a cybersecurity mindset requires shifting from a builder's perspective to a breaker's perspective. It requires constant skepticism of default configurations, implicit trust, and perimeter-only defenses.",
        keyFindings: [
          "Attackers exploit the seams between systems, not just the systems themselves.",
          "Threat modeling (like STRIDE) must be integrated early in the design phase.",
          "The 'Assume Breach' mentality is the foundation of Zero Trust architecture."
        ],
        corePrinciple: "Think like an attacker to defend like a professional.",
        actionableTakeaways: [
          "Map out the attack surface of your most critical personal or professional data.",
          "Apply the STRIDE model to one application you use daily.",
          "Implement MFA on all accounts, assuming your password is already compromised."
        ]
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor Analysis",
        prompt: "I want to practice threat modeling. Can you walk me through a basic STRIDE threat model for a smart home security camera?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "In the context of threat modeling, what does the 'S' in STRIDE stand for, and what does it mean?",
        options: [
          "Security: Ensuring the system is locked down.",
          "Spoofing: Pretending to be something or someone other than yourself.",
          "Sniffing: Intercepting network traffic."
        ],
        correctAnswerIndex: 1,
        explanation: "Spoofing involves illegally accessing and using another user's authentication information, such as username and password.",
        industryInsight: "Spoofing is the foundation of many advanced attacks, including Business Email Compromise (BEC) and Man-in-the-Middle (MitM) attacks."
      },
      {
        id: "q2",
        question: "How does the 'Assume Breach' paradigm change traditional network security?",
        options: [
          "It focuses entirely on building stronger firewalls at the perimeter.",
          "It shifts focus from perimeter defense to internal monitoring, micro-segmentation, and Zero Trust.",
          "It assumes that security is impossible and focuses only on cyber insurance."
        ],
        correctAnswerIndex: 1,
        explanation: "Assume Breach means accepting that attackers will get past the perimeter. Therefore, defenses must be built inside the network to detect and contain them.",
        industryInsight: "Zero Trust Architecture (ZTA) is the industry standard response to the 'Assume Breach' reality, requiring verification for every request, regardless of origin."
      },
      {
        id: "q3",
        question: "What is the primary lesson from the Target HVAC breach regarding the 'Hacker Mindset'?",
        options: [
          "HVAC systems are inherently insecure and should not be used.",
          "Attackers will find the path of least resistance, often pivoting through less secure third-party vendors to reach the primary target.",
          "Target should have used stronger encryption on their POS systems."
        ],
        correctAnswerIndex: 1,
        explanation: "The breach highlighted the danger of supply chain attacks. Attackers realized the POS systems were too hard to hit directly, so they found a weaker, connected vendor.",
        industryInsight: "Third-Party Risk Management (TPRM) is now a critical component of enterprise security, as supply chain attacks have become a primary vector for APTs (Advanced Persistent Threats)."
      }
    ]
  },

  {
    id: "B-M2",
    chapterId: "B",
    chapterTitle: "Cybersecurity Fundamentals: Train Your Brain",
    title: "Internet Safety & Privacy",
    level: "Beginner",
    icon: "Shield",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Internet Safety & Privacy",
        content: "Welcome to Internet Safety & Privacy. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Internet Safety & Privacy is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Internet Safety & Privacy. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Internet Safety & Privacy to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Internet Safety & Privacy?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Internet Safety & Privacy?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Internet Safety & Privacy?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "B-M3",
    chapterId: "B",
    chapterTitle: "Cybersecurity Fundamentals: Train Your Brain",
    title: "Networks & Data Flow",
    level: "Beginner",
    icon: "Network",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Networks & Data Flow",
        content: "Welcome to Networks & Data Flow. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Networks & Data Flow is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Networks & Data Flow. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Networks & Data Flow to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Networks & Data Flow?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Networks & Data Flow?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Networks & Data Flow?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "B-M4",
    chapterId: "B",
    chapterTitle: "Cybersecurity Fundamentals: Train Your Brain",
    title: "Malware & Attack Types",
    level: "Beginner",
    icon: "AlertTriangle",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Malware & Attack Types",
        content: "Welcome to Malware & Attack Types. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Malware & Attack Types is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Malware & Attack Types. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Malware & Attack Types to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Malware & Attack Types?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Malware & Attack Types?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Malware & Attack Types?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "B-M5",
    chapterId: "B",
    chapterTitle: "Cybersecurity Fundamentals: Train Your Brain",
    title: "Defensive Tools & Practices",
    level: "Beginner",
    icon: "ShieldCheck",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Defensive Tools & Practices",
        content: "Welcome to Defensive Tools & Practices. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Defensive Tools & Practices is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Defensive Tools & Practices. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Defensive Tools & Practices to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Defensive Tools & Practices?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Defensive Tools & Practices?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Defensive Tools & Practices?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "B-M6",
    chapterId: "B",
    chapterTitle: "Cybersecurity Fundamentals: Train Your Brain",
    title: "Ethical Hacking & Thinking Like an Attacker",
    level: "Beginner",
    icon: "Eye",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Ethical Hacking & Thinking Like an Attacker",
        content: "Welcome to Ethical Hacking & Thinking Like an Attacker. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Ethical Hacking & Thinking Like an Attacker is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Ethical Hacking & Thinking Like an Attacker. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Ethical Hacking & Thinking Like an Attacker to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Ethical Hacking & Thinking Like an Attacker?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Ethical Hacking & Thinking Like an Attacker?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Ethical Hacking & Thinking Like an Attacker?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "C-SWA-M1",
    chapterId: "C-SWA",
    chapterTitle: "Synthetic Web & AI Defense",
    title: "Introduction to Synthetic Web Threats",
    level: "Beginner",
    icon: "Globe",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Introduction to Synthetic Web Threats",
        content: "Welcome to Introduction to Synthetic Web Threats. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Introduction to Synthetic Web Threats is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Introduction to Synthetic Web Threats. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Introduction to Synthetic Web Threats to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Introduction to Synthetic Web Threats?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Introduction to Synthetic Web Threats?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Introduction to Synthetic Web Threats?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "C-SWA-M2",
    chapterId: "C-SWA",
    chapterTitle: "Synthetic Web & AI Defense",
    title: "AI Attack & Defense Techniques",
    level: "Intermediate",
    icon: "Bot",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to AI Attack & Defense Techniques",
        content: "Welcome to AI Attack & Defense Techniques. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of AI Attack & Defense Techniques is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to AI Attack & Defense Techniques. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of AI Attack & Defense Techniques to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding AI Attack & Defense Techniques?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to AI Attack & Defense Techniques?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to AI Attack & Defense Techniques?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "C-SWA-M3",
    chapterId: "C-SWA",
    chapterTitle: "Synthetic Web & AI Defense",
    title: "Web Security Automation & Detection",
    level: "Advanced",
    icon: "Shield",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Web Security Automation & Detection",
        content: "Welcome to Web Security Automation & Detection. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Web Security Automation & Detection is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Web Security Automation & Detection. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Web Security Automation & Detection to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Web Security Automation & Detection?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Web Security Automation & Detection?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Web Security Automation & Detection?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "C-SWA-M4",
    chapterId: "C-SWA",
    chapterTitle: "Synthetic Web & AI Defense",
    title: "Incident Response & Risk Management",
    level: "Expert",
    icon: "AlertTriangle",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Incident Response & Risk Management",
        content: "Welcome to Incident Response & Risk Management. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Incident Response & Risk Management is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Incident Response & Risk Management. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Incident Response & Risk Management to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Incident Response & Risk Management?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Incident Response & Risk Management?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Incident Response & Risk Management?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "C-SWA-FINAL",
    chapterId: "C-SWA",
    chapterTitle: "Synthetic Web & AI Defense",
    title: "Final Assessment",
    level: "Expert",
    icon: "Award",
    isFinalAssessment: true,
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Synthetic Web & AI Defense Final Assessment",
        content: "This final assessment tests your knowledge of the Synthetic Web & AI Defense course. You must score at least 12/15 to pass and earn your certification."
      }
    ],
    quiz: Array.from({ length: 15 }).map((_, i) => ({
      id: `q${i + 1}`,
      question: `Final Assessment Question ${i + 1} for Synthetic Web & AI Defense`,
      options: ["Option A", "Option B", "Option C"],
      correctAnswerIndex: 1,
      explanation: "This is the correct answer based on the course material."
    }))
  },

  {
    id: "C-IPF-M1",
    chapterId: "C-IPF",
    chapterTitle: "Identity 3.0 & Passwordless Future",
    title: "Digital Identity Fundamentals",
    level: "Beginner",
    icon: "User",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Digital Identity Fundamentals",
        content: "Welcome to Digital Identity Fundamentals. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Digital Identity Fundamentals is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Digital Identity Fundamentals. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Digital Identity Fundamentals to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Digital Identity Fundamentals?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Digital Identity Fundamentals?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Digital Identity Fundamentals?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "C-IPF-M2",
    chapterId: "C-IPF",
    chapterTitle: "Identity 3.0 & Passwordless Future",
    title: "Passwordless Authentication Methods",
    level: "Intermediate",
    icon: "Key",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Passwordless Authentication Methods",
        content: "Welcome to Passwordless Authentication Methods. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Passwordless Authentication Methods is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Passwordless Authentication Methods. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Passwordless Authentication Methods to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Passwordless Authentication Methods?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Passwordless Authentication Methods?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Passwordless Authentication Methods?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "C-IPF-M3",
    chapterId: "C-IPF",
    chapterTitle: "Identity 3.0 & Passwordless Future",
    title: "Identity Management & Access Control",
    level: "Advanced",
    icon: "Lock",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Identity Management & Access Control",
        content: "Welcome to Identity Management & Access Control. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Identity Management & Access Control is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Identity Management & Access Control. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Identity Management & Access Control to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Identity Management & Access Control?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Identity Management & Access Control?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Identity Management & Access Control?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "C-IPF-M4",
    chapterId: "C-IPF",
    chapterTitle: "Identity 3.0 & Passwordless Future",
    title: "Emerging Trends & Future Scenarios",
    level: "Expert",
    icon: "Eye",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Emerging Trends & Future Scenarios",
        content: "Welcome to Emerging Trends & Future Scenarios. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Emerging Trends & Future Scenarios is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Emerging Trends & Future Scenarios. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Emerging Trends & Future Scenarios to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Emerging Trends & Future Scenarios?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Emerging Trends & Future Scenarios?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Emerging Trends & Future Scenarios?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "C-IPF-FINAL",
    chapterId: "C-IPF",
    chapterTitle: "Identity 3.0 & Passwordless Future",
    title: "Final Assessment",
    level: "Expert",
    icon: "Award",
    isFinalAssessment: true,
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Identity 3.0 & Passwordless Future Final Assessment",
        content: "This final assessment tests your knowledge of the Identity 3.0 & Passwordless Future course. You must score at least 12/15 to pass and earn your certification."
      }
    ],
    quiz: Array.from({ length: 15 }).map((_, i) => ({
      id: `q${i + 1}`,
      question: `Final Assessment Question ${i + 1} for Identity 3.0 & Passwordless Future`,
      options: ["Option A", "Option B", "Option C"],
      correctAnswerIndex: 1,
      explanation: "This is the correct answer based on the course material."
    }))
  },

  {
    id: "C-SPZ-M1",
    chapterId: "C-SPZ",
    chapterTitle: "Spatial Privacy & Zero-Trust Living",
    title: "Spatial Data & Privacy Challenges",
    level: "Beginner",
    icon: "MapPin",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Spatial Data & Privacy Challenges",
        content: "Welcome to Spatial Data & Privacy Challenges. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Spatial Data & Privacy Challenges is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Spatial Data & Privacy Challenges. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Spatial Data & Privacy Challenges to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Spatial Data & Privacy Challenges?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Spatial Data & Privacy Challenges?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Spatial Data & Privacy Challenges?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "C-SPZ-M2",
    chapterId: "C-SPZ",
    chapterTitle: "Spatial Privacy & Zero-Trust Living",
    title: "Zero-Trust Architecture Principles",
    level: "Intermediate",
    icon: "Shield",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Zero-Trust Architecture Principles",
        content: "Welcome to Zero-Trust Architecture Principles. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Zero-Trust Architecture Principles is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Zero-Trust Architecture Principles. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Zero-Trust Architecture Principles to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Zero-Trust Architecture Principles?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Zero-Trust Architecture Principles?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Zero-Trust Architecture Principles?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "C-SPZ-M3",
    chapterId: "C-SPZ",
    chapterTitle: "Spatial Privacy & Zero-Trust Living",
    title: "Secure Location-Based Services",
    level: "Advanced",
    icon: "Smartphone",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Secure Location-Based Services",
        content: "Welcome to Secure Location-Based Services. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Secure Location-Based Services is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Secure Location-Based Services. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Secure Location-Based Services to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Secure Location-Based Services?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Secure Location-Based Services?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Secure Location-Based Services?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "C-SPZ-M4",
    chapterId: "C-SPZ",
    chapterTitle: "Spatial Privacy & Zero-Trust Living",
    title: "Privacy by Design & Policy Compliance",
    level: "Expert",
    icon: "FileText",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Privacy by Design & Policy Compliance",
        content: "Welcome to Privacy by Design & Policy Compliance. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Privacy by Design & Policy Compliance is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Privacy by Design & Policy Compliance. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Privacy by Design & Policy Compliance to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Privacy by Design & Policy Compliance?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Privacy by Design & Policy Compliance?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Privacy by Design & Policy Compliance?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "C-SPZ-FINAL",
    chapterId: "C-SPZ",
    chapterTitle: "Spatial Privacy & Zero-Trust Living",
    title: "Final Assessment",
    level: "Expert",
    icon: "Award",
    isFinalAssessment: true,
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Spatial Privacy & Zero-Trust Living Final Assessment",
        content: "This final assessment tests your knowledge of the Spatial Privacy & Zero-Trust Living course. You must score at least 12/15 to pass and earn your certification."
      }
    ],
    quiz: Array.from({ length: 15 }).map((_, i) => ({
      id: `q${i + 1}`,
      question: `Final Assessment Question ${i + 1} for Spatial Privacy & Zero-Trust Living`,
      options: ["Option A", "Option B", "Option C"],
      correctAnswerIndex: 1,
      explanation: "This is the correct answer based on the course material."
    }))
  },

  {
    id: "C-CSD-M1",
    chapterId: "C-CSD",
    chapterTitle: "Cloud Sovereignty & Data Wars",
    title: "Cloud Computing & Governance",
    level: "Beginner",
    icon: "Cloud",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Cloud Computing & Governance",
        content: "Welcome to Cloud Computing & Governance. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Cloud Computing & Governance is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Cloud Computing & Governance. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Cloud Computing & Governance to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Cloud Computing & Governance?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Cloud Computing & Governance?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Cloud Computing & Governance?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "C-CSD-M2",
    chapterId: "C-CSD",
    chapterTitle: "Cloud Sovereignty & Data Wars",
    title: "Data Sovereignty Challenges",
    level: "Intermediate",
    icon: "Database",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Data Sovereignty Challenges",
        content: "Welcome to Data Sovereignty Challenges. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Data Sovereignty Challenges is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Data Sovereignty Challenges. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Data Sovereignty Challenges to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Data Sovereignty Challenges?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Data Sovereignty Challenges?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Data Sovereignty Challenges?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "C-CSD-M3",
    chapterId: "C-CSD",
    chapterTitle: "Cloud Sovereignty & Data Wars",
    title: "Cloud Security & Compliance",
    level: "Advanced",
    icon: "ShieldCheck",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Cloud Security & Compliance",
        content: "Welcome to Cloud Security & Compliance. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Cloud Security & Compliance is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Cloud Security & Compliance. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Cloud Security & Compliance to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Cloud Security & Compliance?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Cloud Security & Compliance?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Cloud Security & Compliance?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "C-CSD-M4",
    chapterId: "C-CSD",
    chapterTitle: "Cloud Sovereignty & Data Wars",
    title: "Strategies for Global Data Protection",
    level: "Expert",
    icon: "Globe",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Strategies for Global Data Protection",
        content: "Welcome to Strategies for Global Data Protection. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Strategies for Global Data Protection is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Strategies for Global Data Protection. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Strategies for Global Data Protection to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Strategies for Global Data Protection?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Strategies for Global Data Protection?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Strategies for Global Data Protection?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "C-CSD-FINAL",
    chapterId: "C-CSD",
    chapterTitle: "Cloud Sovereignty & Data Wars",
    title: "Final Assessment",
    level: "Expert",
    icon: "Award",
    isFinalAssessment: true,
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Cloud Sovereignty & Data Wars Final Assessment",
        content: "This final assessment tests your knowledge of the Cloud Sovereignty & Data Wars course. You must score at least 12/15 to pass and earn your certification."
      }
    ],
    quiz: Array.from({ length: 15 }).map((_, i) => ({
      id: `q${i + 1}`,
      question: `Final Assessment Question ${i + 1} for Cloud Sovereignty & Data Wars`,
      options: ["Option A", "Option B", "Option C"],
      correctAnswerIndex: 1,
      explanation: "This is the correct answer based on the course material."
    }))
  },

  {
    id: "C-QRF-M1",
    chapterId: "C-QRF",
    chapterTitle: "Quantum-Ready Foundations",
    title: "Introduction to Quantum Computing",
    level: "Beginner",
    icon: "Cpu",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Introduction to Quantum Computing",
        content: "Welcome to Introduction to Quantum Computing. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Introduction to Quantum Computing is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Introduction to Quantum Computing. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Introduction to Quantum Computing to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Introduction to Quantum Computing?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Introduction to Quantum Computing?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Introduction to Quantum Computing?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "C-QRF-M2",
    chapterId: "C-QRF",
    chapterTitle: "Quantum-Ready Foundations",
    title: "Quantum Threats & Cryptography",
    level: "Intermediate",
    icon: "AlertTriangle",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Quantum Threats & Cryptography",
        content: "Welcome to Quantum Threats & Cryptography. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Quantum Threats & Cryptography is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Quantum Threats & Cryptography. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Quantum Threats & Cryptography to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Quantum Threats & Cryptography?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Quantum Threats & Cryptography?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Quantum Threats & Cryptography?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "C-QRF-M3",
    chapterId: "C-QRF",
    chapterTitle: "Quantum-Ready Foundations",
    title: "Quantum-Resilient Security Practices",
    level: "Advanced",
    icon: "Shield",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Quantum-Resilient Security Practices",
        content: "Welcome to Quantum-Resilient Security Practices. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Quantum-Resilient Security Practices is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Quantum-Resilient Security Practices. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Quantum-Resilient Security Practices to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Quantum-Resilient Security Practices?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Quantum-Resilient Security Practices?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Quantum-Resilient Security Practices?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "C-QRF-M4",
    chapterId: "C-QRF",
    chapterTitle: "Quantum-Ready Foundations",
    title: "Preparing Infrastructure for Quantum Era",
    level: "Expert",
    icon: "Server",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to Preparing Infrastructure for Quantum Era",
        content: "Welcome to Preparing Infrastructure for Quantum Era. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of Preparing Infrastructure for Quantum Era is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to Preparing Infrastructure for Quantum Era. What is your first action?",
        question: "How should you respond to this potential threat?",
        options: [
          "Ignore it and wait for more evidence.",
          "Isolate the affected systems and begin investigation.",
          "Immediately delete all related data."
        ],
        correctAnswerIndex: 1,
        explanation: "Isolation prevents the threat from spreading while allowing security teams to investigate the root cause.",
        insight: "Rapid containment is critical in minimizing the impact of any security incident."
      },
      {
        id: "s4",
        type: "summary",
        title: "Module Summary",
        keyFindings: [
          "Always implement defense-in-depth.",
          "Continuous monitoring is essential for early detection.",
          "Proactive threat hunting reduces risk exposure."
        ],
        corePrinciple: "Security is an ongoing process, not a one-time setup. Stay vigilant and adapt to emerging threats."
      },
      {
        id: "s5",
        type: "ai_prompt",
        title: "AI Mentor",
        prompt: "How can I apply the concepts of Preparing Infrastructure for Quantum Era to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding Preparing Infrastructure for Quantum Era?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to Preparing Infrastructure for Quantum Era?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to Preparing Infrastructure for Quantum Era?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  },

  {
    id: "C-QRF-FINAL",
    chapterId: "C-QRF",
    chapterTitle: "Quantum-Ready Foundations",
    title: "Final Assessment",
    level: "Expert",
    icon: "Award",
    isFinalAssessment: true,
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Quantum-Ready Foundations Final Assessment",
        content: "This final assessment tests your knowledge of the Quantum-Ready Foundations course. You must score at least 12/15 to pass and earn your certification."
      }
    ],
    quiz: Array.from({ length: 15 }).map((_, i) => ({
      id: `q${i + 1}`,
      question: `Final Assessment Question ${i + 1} for Quantum-Ready Foundations`,
      options: ["Option A", "Option B", "Option C"],
      correctAnswerIndex: 1,
      explanation: "This is the correct answer based on the course material."
    }))
  },
];
