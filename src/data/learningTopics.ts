import { Topic } from '../types';

export const LEARNING_TOPICS: Topic[] = [
  {
    id: "BC-M1",
    chapterId: "BOOTCAMP",
    chapterTitle: "The Complete Cybersecurity Bootcamp: Zero to Hero",
    title: "Module 1: Introduction to Cybersecurity & Threat Landscapes",
    level: "Beginner",
    icon: "Shield",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Welcome to the Cybersecurity World",
        content: "Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information; extorting money from users; or interrupting normal business processes. In this module, you will learn the foundational concepts of cybersecurity.",
        learningObjectives: [
          "Understand the CIA Triad (Confidentiality, Integrity, Availability)",
          "Identify common threat actors and their motivations",
          "Recognize basic cyber threats like Malware and Phishing"
        ]
      },
      {
        id: "s2",
        type: "concept",
        title: "The CIA Triad",
        definition: "The CIA triad is a well-known model for security policy development, used to identify problem areas and necessary solutions for information security.",
        howItWorks: "Confidentiality ensures data is private. Integrity ensures data has not been altered. Availability ensures data is accessible to authorized users when needed.",
        example: "A bank uses encryption to maintain confidentiality, hashes to ensure integrity, and backup servers to ensure availability.",
        keyPrinciple: "Always design systems with all three CIA principles in balance.",
        whyItMatters: "If any of these three principles are compromised, the entire security of the system is at risk."
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "Which of the following is NOT a component of the CIA Triad?",
        options: ["Confidentiality", "Integrity", "Authorization", "Availability"],
        correctAnswerIndex: 2,
        explanation: "The CIA Triad stands for Confidentiality, Integrity, and Availability. Authorization is a separate security concept.",
        industryInsight: "Many frameworks rely on the CIA triad as their foundational pillar."
      },
      {
        id: "q2",
        question: "What does 'Integrity' mean in the context of the CIA triad?",
        options: [
          "Ensuring that only authorized users can view data",
          "Ensuring that data has not been modified or tampered with",
          "Ensuring that systems are always up and running",
          "Ensuring that passwords are encrypted"
        ],
        correctAnswerIndex: 1,
        explanation: "Integrity means maintaining the accuracy and completeness of data over its entire lifecycle.",
        industryInsight: "Cryptographic hashing is the primary method used in the industry to verify data integrity."
      },
      {
        id: "q3",
        question: "Which of these threat actors is primarily motivated by financial gain?",
        options: [
          "Hacktivists",
          "Nation-State Actors",
          "Cybercriminals",
          "Script Kiddies"
        ],
        correctAnswerIndex: 2,
        explanation: "Cybercriminals are typically motivated by money, often using ransomware or stealing financial information.",
        industryInsight: "Ransomware-as-a-Service (RaaS) has made it easier than ever for cybercriminals to monetize their attacks."
      }
    ]
  },
  {
    id: "BC-M2",
    chapterId: "BOOTCAMP",
    chapterTitle: "The Complete Cybersecurity Bootcamp: Zero to Hero",
    title: "Module 2: Network Security & Defense Strategies",
    level: "Beginner",
    icon: "Network",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Securing the Network",
        content: "A network is the backbone of any organization's IT infrastructure. Protecting it requires a multi-layered approach, combining hardware and software solutions to prevent and monitor unauthorized access, misuse, modification, or denial of a computer network and network-accessible resources.",
        learningObjectives: [
          "Understand the role of Firewalls and VPNs",
          "Learn about Intrusion Detection Systems (IDS)",
          "Recognize the importance of network segmentation"
        ]
      },
      {
        id: "s2",
        type: "concept",
        title: "Firewalls and Segmentation",
        definition: "A firewall is a network security device that monitors and filters incoming and outgoing network traffic based on an organization's previously established security policies.",
        howItWorks: "Firewalls sit at the perimeter of the network and act as a barrier between a trusted internal network and untrusted external networks, such as the Internet.",
        example: "Blocking all incoming traffic on port 23 (Telnet) while allowing incoming traffic on port 443 (HTTPS).",
        whyItMatters: "Without a firewall, a network is completely exposed to the open internet, making it trivial for attackers to scan for and exploit vulnerabilities."
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary function of a Firewall?",
        options: [
          "To encrypt data at rest",
          "To monitor and filter network traffic based on security rules",
          "To detect and remove viruses from a computer",
          "To back up critical network configurations"
        ],
        correctAnswerIndex: 1,
        explanation: "A firewall acts as a barrier, inspecting traffic against a set of rules to block or allow packets.",
        industryInsight: "Modern Next-Generation Firewalls (NGFW) also include deep packet inspection and intrusion prevention capabilities."
      },
      {
        id: "q2",
        question: "Why is network segmentation important?",
        options: [
          "It makes the network run faster",
          "It reduces the cost of networking hardware",
          "It limits the spread of an attack if one segment is compromised",
          "It allows employees to bypass the firewall"
        ],
        correctAnswerIndex: 2,
        explanation: "Segmentation divides a network into smaller parts, so if an attacker breaches one area, they cannot easily move laterally to others.",
        industryInsight: "Zero Trust Architecture relies heavily on micro-segmentation to strictly enforce access controls."
      },
      {
        id: "q3",
        question: "Which of the following describes a VPN?",
        options: [
          "A tool to permanently delete files",
          "A system that detects network intrusions",
          "A secure, encrypted connection over a less secure network",
          "A type of malware that hides in memory"
        ],
        correctAnswerIndex: 2,
        explanation: "A Virtual Private Network (VPN) creates a secure tunnel for data transmission, ensuring confidentiality and integrity over public networks.",
        industryInsight: "Remote work has made enterprise VPNs and Zero Trust Network Access (ZTNA) critical components of corporate security."
      }
    ]
  },
  {
    id: "BC-M3",
    chapterId: "BOOTCAMP",
    chapterTitle: "The Complete Cybersecurity Bootcamp: Zero to Hero",
    title: "Module 3: Identity, Authentication & Access Management",
    level: "Beginner",
    icon: "Key",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Who Are You?",
        content: "Identity and Access Management (IAM) is about ensuring that the right people have the right access to the right resources at the right times for the right reasons. It is one of the most critical aspects of modern cybersecurity.",
        learningObjectives: [
          "Understand Authentication vs. Authorization",
          "Learn the principles of Multi-Factor Authentication (MFA)",
          "Grasp the Principle of Least Privilege (PoLP)"
        ]
      },
      {
        id: "s2",
        type: "concept",
        title: "Authentication vs. Authorization",
        definition: "Authentication is verifying who a user is. Authorization is determining what that user is allowed to do once verified.",
        howItWorks: "When you log into a website with a password, that is authentication. When the website checks if you are an admin before letting you access a dashboard, that is authorization.",
        keyPrinciple: "Always enforce Multi-Factor Authentication (MFA) and apply the Principle of Least Privilege.",
        caseStudy: {
          title: "The Target Data Breach (2013)",
          description: "Attackers stole credentials from a third-party HVAC vendor and used them to access Target's internal network.",
          impact: "Over 40 million credit and debit card numbers were stolen. This highlights the failure of least privilege and strict access controls."
        }
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "Which of the following is an example of 'Something you have' in Multi-Factor Authentication?",
        options: [
          "A password",
          "A fingerprint",
          "A hardware security key (e.g., YubiKey)",
          "A PIN code"
        ],
        correctAnswerIndex: 2,
        explanation: "MFA factors are: something you know (password), something you have (security key/phone), and something you are (biometrics).",
        industryInsight: "Hardware tokens are considered the most secure form of MFA as they are highly resistant to phishing."
      },
      {
        id: "q2",
        question: "What is the Principle of Least Privilege?",
        options: [
          "Giving users access only to what they need to do their jobs",
          "Giving all users admin access for convenience",
          "Removing all passwords and using only biometrics",
          "Allowing users to share accounts"
        ],
        correctAnswerIndex: 0,
        explanation: "Least privilege ensures that a user or system process only has the bare minimum privileges necessary to perform its intended function.",
        industryInsight: "Enforcing this principle minimizes the potential damage if an account is compromised."
      },
      {
        id: "q3",
        question: "Authentication verifies ___, while Authorization verifies ___.",
        options: [
          "identity; permissions",
          "permissions; identity",
          "passwords; usernames",
          "networks; devices"
        ],
        correctAnswerIndex: 0,
        explanation: "Authentication proves who you are (Identity), and authorization determines what you can access (Permissions).",
        industryInsight: "Modern IAM solutions often combine both processes dynamically using context-aware access controls."
      }
    ]
  },
  {
    id: "BC-M4",
    chapterId: "BOOTCAMP",
    chapterTitle: "The Complete Cybersecurity Bootcamp: Zero to Hero",
    title: "Module 4: Incident Response & Digital Forensics Best Practices",
    level: "Beginner",
    icon: "Activity",
    sections: [
      {
        id: "s1",
        type: "intro",
        title: "Handling the Breaches",
        content: "No organization is 100% secure. When an incident occurs, response times and strategies define whether it is a minor setback or a catastrophic failure. Incident Response (IR) is the organized protocol an enterprise follows when detecting, containing, and recovering from a cyberattack.",
        learningObjectives: [
          "Understand the phases of the Incident Response lifecycle",
          "Identify containment, eradication, and recovery strategies",
          "Learn the basic principles of digital forensic evidence collection"
        ]
      },
      {
        id: "s2",
        type: "concept",
        title: "The Incident Response Lifecycle",
        definition: "The IR lifecycle, standardized by NIST (SP 800-61), guides security operations from proactive preparation to post-incident analysis.",
        howItWorks: "The phases are: 1. Preparation (hardening systems, training teams), 2. Detection & Analysis (monitoring alerts), 3. Containment, Eradication & Recovery (stopping the spread, removing threats, restoring services), and 4. Post-Incident Activity (lessons learned to prevent recurrence).",
        keyPrinciple: "Never jump straight to eradication without securing proper evidence and completely containing the threat actor first.",
        whyItMatters: "Without a structured plan, chaotic responses during an active breach often cause more downtime and damage than the attack itself."
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the first step of the Incident Response lifecycle?",
        options: [
          "Detection & Analysis",
          "Containment",
          "Preparation",
          "Eradication"
        ],
        correctAnswerIndex: 2,
        explanation: "Preparation is the foundation of IR, ensuring policies, tools, and training are in place before any incident occurs.",
        industryInsight: "Regular tabletop exercises are the most effective way for security teams to practice and test their preparation level."
      },
      {
        id: "q2",
        question: "Why should containment precede eradication?",
        options: [
          "To make recovery cheaper",
          "To prevent the threat from spreading or communicating with its command server",
          "To avoid reporting the breach to authorities",
          "To let attackers steal less valuable data"
        ],
        correctAnswerIndex: 1,
        explanation: "Containment isolates affected hosts so that attackers cannot spread laterally or exfiltrate more data while security teams plan eradication.",
        industryInsight: "In modern cloud environments, automated containment scripts can immediately isolate compromised containers within milliseconds."
      },
      {
        id: "q3",
        question: "What is the primary purpose of the 'Lessons Learned' phase?",
        options: [
          "To assign blame to employees",
          "To document the event for insurance purposes only",
          "To improve future security defenses and incident handling",
          "To reset user passwords"
        ],
        correctAnswerIndex: 2,
        explanation: "Post-incident analysis helps teams identify gaps in their defenses and processes, continuously upgrading their security posture.",
        industryInsight: "Many major security improvements in Fortune 500 companies are born out of post-incident reviews."
      }
    ]
  }
];
