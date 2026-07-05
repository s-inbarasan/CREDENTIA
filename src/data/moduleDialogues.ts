export type Emotion = 'neutral' | 'curious' | 'excited' | 'serious';
export type CharacterId = 'sarah' | 'leo' | 'alex';
export type BackgroundType = 'dark-blue' | 'dark-purple' | 'dark-green';

export interface DialogueLine {
  lineId: string;
  character: CharacterId;
  text: string;
  emotion: Emotion;
}

export interface DialoguePanel {
  panelId: string;
  background: BackgroundType;
  lines: DialogueLine[];
}

export interface ModuleDialogue {
  id: string; // matches topicId
  scenes: DialoguePanel[];
}

export const MODULE_DIALOGUES: ModuleDialogue[] = [
  {
    id: "B-M1",
    scenes: [
      {
        panelId: "B-M1-p1",
        background: "dark-blue",
        lines: [
          { lineId: "B-M1-l1", character: "sarah", text: "Leo, look at this login screen I built. Encryption, hashing, 2FA... it's a fortress, right?", emotion: "excited" },
          { character: "leo", lineId: "B-M1-l2", text: "It looks solid, Sarah. But remember: a fortress is only as strong as its weakest assumption. Have you modeled the threats yet?", emotion: "serious" },
          { character: "sarah", lineId: "B-M1-l3", text: "Threat modeling? You mean thinking like a hacker before they even arrive?", emotion: "curious" },
          { character: "leo", lineId: "B-M1-l4", text: "Exactly. We need to ask: What can go wrong? Who wants our data? And how could they bypass your 'fortress' without ever touching the locks?", emotion: "serious" }
        ]
      },
      {
        panelId: "B-M1-p2",
        background: "dark-purple",
        lines: [
          { character: "alex", lineId: "B-M1-l5", text: "I've analyzed the entry vectors. If we use the STRIDE framework, we can categorize every potential attack on this login page.", emotion: "neutral" },
          { character: "sarah", lineId: "B-M1-l6", text: "STRIDE? That's Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege, right?", emotion: "curious" },
          { character: "leo", lineId: "B-M1-l7", text: "Spot on. By identifying these early, we transition from reactive patching to proactive, secure-by-design architecture.", emotion: "serious" }
        ]
      }
    ]
  },
  {
    id: "B-M2",
    scenes: [
      {
        panelId: "B-M2-p1",
        background: "dark-green",
        lines: [
          { lineId: "B-M2-l1", character: "leo", text: "I'm using Incognito mode, Sarah. I'm basically a ghost on the internet now.", emotion: "excited" },
          { lineId: "B-M2-l2", character: "sarah", text: "Hate to break it to you, Leo, but Incognito only hides history from your roommate, not from the servers tracking you.", emotion: "serious" },
          { lineId: "B-M2-l3", character: "leo", text: "Wait, so they can still see me even without cookies?", emotion: "curious" },
          { lineId: "B-M2-l4", character: "sarah", text: "Yes, through Browser Fingerprinting. They gather your screen resolution, fonts, and even hardware signatures to create a unique ID for you.", emotion: "serious" }
        ]
      },
      {
        panelId: "B-M2-p2",
        background: "dark-blue",
        lines: [
          { lineId: "B-M2-l5", character: "alex", text: "The only way to truly stay private is to practice OPSEC—Operational Security. You have to blend into the crowd.", emotion: "serious" },
          { lineId: "B-M2-l6", character: "leo", text: "So, instead of wearing a custom invisibility cloak, I should just look like everyone else?", emotion: "curious" },
          { lineId: "B-M2-l7", character: "alex", text: "Bingo. Standardized browsers and anti-fingerprinting tools make you indistinguishable from millions of other users.", emotion: "neutral" }
        ]
      }
    ]
  },
  {
    id: "C-SWA-M1",
    scenes: [
      {
        panelId: "C-SWA-M1-p1",
        background: "dark-purple",
        lines: [
          { lineId: "C1-l1", character: "alex", text: "Leo, we've had 10,000 failed login attempts in the last hour. Someone is hammering our server.", emotion: "serious" },
          { lineId: "C1-l2", character: "leo", text: "Are they brute-forcing the admin password?", emotion: "curious" },
          { lineId: "C1-l3", character: "alex", text: "No, it's Credential Stuffing. They're using a list of real emails and passwords leaked from a gaming forum breach and testing them here.", emotion: "serious" },
          { lineId: "C1-l4", character: "sarah", text: "And since people reuse passwords, they're bound to get in eventually if we don't have secondary defenses.", emotion: "serious" }
        ]
      },
      {
        panelId: "C-SWA-M1-p2",
        background: "dark-green",
        lines: [
          { lineId: "C1-l5", character: "leo", text: "Can't we just block their IP addresses?", emotion: "curious" },
          { lineId: "C1-l6", character: "alex", text: "They're using a botnet of residential proxies. All 10,000 attempts come from different home connections. If we block them, we block real users.", emotion: "serious" },
          { lineId: "C1-l7", character: "sarah", text: "We need adaptive behavior analysis. Check for mouse movements and request headers that don't match a human browser.", emotion: "serious" }
        ]
      }
    ]
  },
  {
    id: "C-SWA-M2",
    scenes: [
      {
        panelId: "C-SWA-M2-p1",
        background: "dark-blue",
        lines: [
          { lineId: "C2-l1", character: "sarah", text: "Leo, I just got a call from 'you' asking for the server keys. You sounded a bit... metallic.", emotion: "serious" },
          { lineId: "C2-l2", character: "leo", text: "But I've been here with you the whole time! That wasn't me.", emotion: "excited" },
          { lineId: "C2-l3", character: "sarah", text: "I knew it. It was a Voice Clone. Someone must have sampled your voice from that tech talk you did last month.", emotion: "serious" }
        ]
      },
      {
        panelId: "C-SWA-M2-p2",
        background: "dark-purple",
        lines: [
          { lineId: "C2-l4", character: "alex", text: "Synthetic media is the new social engineering frontier. They only need 30 seconds of audio to clone you perfectly.", emotion: "serious" },
          { lineId: "C2-l5", character: "leo", text: "How do we even trust anyone on the phone anymore?", emotion: "curious" },
          { lineId: "C2-l6", character: "alex", text: "Out-of-Band verification. Hang up, and call back on a verified secondary channel. Never trust the incoming line for high-stakes requests.", emotion: "serious" }
        ]
      }
    ]
  }
];
