const fs = require('fs');

const courses = [
  {
    id: "B",
    title: "Cybersecurity Fundamentals: Train Your Brain",
    modules: [
      { id: "B-M1", title: "Cybersecurity Mindset", icon: "Brain", level: "Beginner" },
      { id: "B-M2", title: "Internet Safety & Privacy", icon: "Shield", level: "Beginner" },
      { id: "B-M3", title: "Networks & Data Flow", icon: "Network", level: "Beginner" },
      { id: "B-M4", title: "Malware & Attack Types", icon: "AlertTriangle", level: "Beginner" },
      { id: "B-M5", title: "Defensive Tools & Practices", icon: "ShieldCheck", level: "Beginner" },
      { id: "B-M6", title: "Ethical Hacking & Thinking Like an Attacker", icon: "Eye", level: "Beginner" }
    ]
  },
  {
    id: "C-SWA",
    title: "Synthetic Web & AI Defense",
    modules: [
      { id: "C-SWA-M1", title: "Introduction to Synthetic Web Threats", icon: "Globe", level: "Beginner" },
      { id: "C-SWA-M2", title: "AI Attack & Defense Techniques", icon: "Bot", level: "Intermediate" },
      { id: "C-SWA-M3", title: "Web Security Automation & Detection", icon: "Shield", level: "Advanced" },
      { id: "C-SWA-M4", title: "Incident Response & Risk Management", icon: "AlertTriangle", level: "Expert" }
    ],
    hasFinal: true
  },
  {
    id: "C-IPF",
    title: "Identity 3.0 & Passwordless Future",
    modules: [
      { id: "C-IPF-M1", title: "Digital Identity Fundamentals", icon: "User", level: "Beginner" },
      { id: "C-IPF-M2", title: "Passwordless Authentication Methods", icon: "Key", level: "Intermediate" },
      { id: "C-IPF-M3", title: "Identity Management & Access Control", icon: "Lock", level: "Advanced" },
      { id: "C-IPF-M4", title: "Emerging Trends & Future Scenarios", icon: "Eye", level: "Expert" }
    ],
    hasFinal: true
  },
  {
    id: "C-SPZ",
    title: "Spatial Privacy & Zero-Trust Living",
    modules: [
      { id: "C-SPZ-M1", title: "Spatial Data & Privacy Challenges", icon: "MapPin", level: "Beginner" },
      { id: "C-SPZ-M2", title: "Zero-Trust Architecture Principles", icon: "Shield", level: "Intermediate" },
      { id: "C-SPZ-M3", title: "Secure Location-Based Services", icon: "Smartphone", level: "Advanced" },
      { id: "C-SPZ-M4", title: "Privacy by Design & Policy Compliance", icon: "FileText", level: "Expert" }
    ],
    hasFinal: true
  },
  {
    id: "C-CSD",
    title: "Cloud Sovereignty & Data Wars",
    modules: [
      { id: "C-CSD-M1", title: "Cloud Computing & Governance", icon: "Cloud", level: "Beginner" },
      { id: "C-CSD-M2", title: "Data Sovereignty Challenges", icon: "Database", level: "Intermediate" },
      { id: "C-CSD-M3", title: "Cloud Security & Compliance", icon: "ShieldCheck", level: "Advanced" },
      { id: "C-CSD-M4", title: "Strategies for Global Data Protection", icon: "Globe", level: "Expert" }
    ],
    hasFinal: true
  },
  {
    id: "C-QRF",
    title: "Quantum-Ready Foundations",
    modules: [
      { id: "C-QRF-M1", title: "Introduction to Quantum Computing", icon: "Cpu", level: "Beginner" },
      { id: "C-QRF-M2", title: "Quantum Threats & Cryptography", icon: "AlertTriangle", level: "Intermediate" },
      { id: "C-QRF-M3", title: "Quantum-Resilient Security Practices", icon: "Shield", level: "Advanced" },
      { id: "C-QRF-M4", title: "Preparing Infrastructure for Quantum Era", icon: "Server", level: "Expert" }
    ],
    hasFinal: true
  }
];

function generateTopic(course, module) {
  return `
  {
    id: "${module.id}",
    chapterId: "${course.id}",
    chapterTitle: "${course.title}",
    title: "${module.title}",
    level: "${module.level}",
    icon: "${module.icon}",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Introduction to ${module.title}",
        content: "Welcome to ${module.title}. In this module, we will explore the core concepts, practical applications, and defensive strategies related to this topic. Understanding these principles is crucial for maintaining a strong security posture in today's digital landscape."
      },
      {
        id: "s2",
        type: "concept",
        title: "Core Concepts & Mechanisms",
        definition: "Understanding the fundamental mechanics of ${module.title} is essential for effective defense.",
        howItWorks: "Attackers often exploit misconfigurations, weak access controls, or human error. Defenders must implement layered security, continuous monitoring, and proactive threat hunting.",
        example: "Consider a scenario where an attacker bypasses initial defenses. Without defense-in-depth, the entire system is compromised.",
        whyItMatters: "A single vulnerability can lead to catastrophic data loss, financial damage, and reputational harm.",
        keyPrinciple: "Always verify, never trust. Implement least privilege and continuous monitoring."
      },
      {
        id: "s3",
        type: "decision",
        title: "Knowledge Check",
        scenario: "You detect unusual activity related to ${module.title}. What is your first action?",
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
        prompt: "How can I apply the concepts of ${module.title} to secure my personal and professional digital environments?"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary goal of understanding ${module.title}?",
        options: ["To exploit systems", "To build robust defenses and mitigate risks", "To increase system performance"],
        correctAnswerIndex: 1,
        explanation: "The goal of cybersecurity education is to build defenses and mitigate risks."
      },
      {
        id: "q2",
        question: "Which principle is most relevant to ${module.title}?",
        options: ["Trust everyone", "Security through obscurity", "Defense in depth"],
        correctAnswerIndex: 2,
        explanation: "Defense in depth provides multiple layers of security, ensuring that if one fails, others remain."
      },
      {
        id: "q3",
        question: "How should you handle a suspected incident related to ${module.title}?",
        options: ["Contain, investigate, and remediate", "Ignore it", "Reboot the server"],
        correctAnswerIndex: 0,
        explanation: "A structured incident response process is essential for handling threats effectively."
      }
    ]
  }`;
}

function generateFinalAssessment(course) {
  return `
  {
    id: "${course.id}-FINAL",
    chapterId: "${course.id}",
    chapterTitle: "${course.title}",
    title: "Final Assessment",
    level: "Expert",
    icon: "Award",
    isFinalAssessment: true,
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "${course.title} Final Assessment",
        content: "This final assessment tests your knowledge of the ${course.title} course. You must score at least 12/15 to pass and earn your certification."
      }
    ],
    quiz: Array.from({ length: 15 }).map((_, i) => ({
      id: \`q\${i + 1}\`,
      question: \`Final Assessment Question \${i + 1} for ${course.title}\`,
      options: ["Option A", "Option B", "Option C"],
      correctAnswerIndex: 1,
      explanation: "This is the correct answer based on the course material."
    }))
  }`;
}

let output = "import { Topic } from '../types';\n\nexport const LEARNING_TOPICS: Topic[] = [\n";

courses.forEach(course => {
  course.modules.forEach(module => {
    output += generateTopic(course, module) + ',\n';
  });
  if (course.hasFinal) {
    output += generateFinalAssessment(course) + ',\n';
  }
});

output += '];\n';

fs.writeFileSync('src/data/learningTopics.ts', output);
console.log('Successfully generated learningTopics.ts');
