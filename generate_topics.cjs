const fs = require('fs');

const files = [
  'raw_curriculum_1_2.txt',
  'raw_curriculum_3_4.txt',
  'raw_curriculum_5_6.txt'
];

const chapters = [
  { id: 'ch1', title: 'Getting Started with Cybersecurity', level: 'Beginner' },
  { id: 'ch2', title: 'Protecting Your Online Accounts', level: 'Beginner' },
  { id: 'ch3', title: 'Identifying Online Threats', level: 'Intermediate' },
  { id: 'ch4', title: 'Safe Browsing & Device Security', level: 'Intermediate' },
  { id: 'ch5', title: 'Data Privacy & Digital Footprint', level: 'Advanced' },
  { id: 'ch6', title: 'Advanced Defense & Future Tech', level: 'Advanced' }
];

const icons = ['Shield', 'Key', 'Lock', 'Smartphone', 'Globe', 'Mail', 'AlertTriangle', 'EyeOff', 'UserCheck', 'Database'];

let allTopics = [];
let chapterTests = {};
let globalTopicIndex = 0;

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf-8');
  
  const lines = content.split('\n');
  let currentTopic = null;
  let currentChapterIndex = -1;
  let inQuiz = false;
  let inFinalTest = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('CHAPTER ') && !line.includes('FINAL COMPREHENSIVE TEST')) {
      const match = line.match(/CHAPTER (\d+)/);
      if (match) {
        currentChapterIndex = parseInt(match[1]) - 1;
        inFinalTest = false;
      }
    }
    
    if (line.includes('FINAL COMPREHENSIVE TEST')) {
      inFinalTest = true;
      inQuiz = false;
      if (currentTopic) {
        allTopics.push(currentTopic);
        currentTopic = null;
      }
      chapterTests[chapters[currentChapterIndex].id] = [];
      continue;
    }
    
    if (inFinalTest) {
      if (line.match(/^\d+\./)) {
        const qMatch = line.match(/^\d+\.\s*(.*)/);
        if (qMatch) {
          chapterTests[chapters[currentChapterIndex].id].push({
            id: `test-${chapters[currentChapterIndex].id}-${chapterTests[chapters[currentChapterIndex].id].length + 1}`,
            question: qMatch[1].trim(),
            options: [],
            correctAnswerIndex: 0,
            explanation: ''
          });
        }
      } else if (line.match(/^[A-D]\)/) || line.includes('A)') || line.includes('B)')) {
        const options = line.split(/[A-D]\)/).filter(o => o.trim()).map(o => o.trim());
        const testArr = chapterTests[chapters[currentChapterIndex].id];
        const lastQ = testArr[testArr.length - 1];
        if (lastQ && options.length > 0) {
          lastQ.options = options;
        }
      } else if (line.startsWith('[ANSWERS:')) {
        const answersStr = line.replace('[ANSWERS:', '').replace(']', '').trim();
        const answers = answersStr.split(',').map(a => a.trim().split(':')[1]);
        const testArr = chapterTests[chapters[currentChapterIndex].id];
        
        for (let j = 0; j < answers.length; j++) {
          if (testArr[j] && answers[j]) {
            testArr[j].correctAnswerIndex = answers[j].charCodeAt(0) - 65;
            testArr[j].explanation = `The correct answer is ${answers[j]}.`;
          }
        }
      }
      continue;
    }
    
    if (line.startsWith('TOPIC ') && line.includes(':')) {
      if (line.includes('MINI-QUIZ')) {
        inQuiz = true;
        continue;
      }
      
      inQuiz = false;
      const titleMatch = line.match(/TOPIC \d+: (.*)/);
      if (titleMatch) {
        if (currentTopic) {
          allTopics.push(currentTopic);
        }
        
        currentTopic = {
          id: `topic-${globalTopicIndex + 1}`,
          chapterId: chapters[currentChapterIndex]?.id || 'ch1',
          chapterTitle: chapters[currentChapterIndex]?.title || 'Chapter',
          title: titleMatch[1].trim(),
          level: chapters[currentChapterIndex]?.level || 'Beginner',
          icon: icons[globalTopicIndex % icons.length],
          overview: `Learn the essentials of ${titleMatch[1].trim()} and how to protect yourself.`,
          simpleExplanation: '',
          whyItMatters: '',
          explanation: '',
          realWorldExample: '',
          securityTips: [],
          summary: '',
          quiz: []
        };
        globalTopicIndex++;
      }
    } else if (currentTopic && !inQuiz) {
      if (line.startsWith('Simple Explanation:')) {
        currentTopic.simpleExplanation = line.replace('Simple Explanation:', '').trim();
      } else if (line.startsWith('Why It Matters:')) {
        currentTopic.whyItMatters = line.replace('Why It Matters:', '').trim();
      } else if (line.startsWith('Detailed Overview:')) {
        currentTopic.explanation = line.replace('Detailed Overview:', '').trim();
      } else if (line.startsWith('Real-World Example:')) {
        currentTopic.realWorldExample = line.replace('Real-World Example:', '').trim();
      } else if (line.startsWith('Security Tips:')) {
        currentTopic.securityTips = line.replace('Security Tips:', '').split('. ').filter(s => s.trim()).map(s => s.trim() + (s.endsWith('.') ? '' : '.'));
      } else if (line.startsWith('Key Takeaway:')) {
        currentTopic.summary = line.replace('Key Takeaway:', '').trim();
      }
    } else if (currentTopic && inQuiz) {
      if (line.match(/^\d+\./)) {
        const qMatch = line.match(/^\d+\.\s*(.*)/);
        if (qMatch) {
          currentTopic.quiz.push({
            id: `q${globalTopicIndex}-${currentTopic.quiz.length + 1}`,
            question: qMatch[1].trim(),
            options: [],
            correctAnswerIndex: 0,
            explanation: ''
          });
        }
      } else if (line.match(/^[A-D]\)/) || line.includes('A)') || line.includes('B)')) {
        const options = line.split(/[A-D]\)/).filter(o => o.trim()).map(o => o.trim());
        const lastQ = currentTopic.quiz[currentTopic.quiz.length - 1];
        if (lastQ && options.length > 0) {
          lastQ.options = options;
        }
      } else if (line.startsWith('[ANSWERS:')) {
        const answersStr = line.replace('[ANSWERS:', '').replace(']', '').trim();
        const answers = answersStr.split(',').map(a => a.trim().split(':')[1]);
        
        for (let j = 0; j < answers.length; j++) {
          if (currentTopic.quiz[j] && answers[j]) {
            currentTopic.quiz[j].correctAnswerIndex = answers[j].charCodeAt(0) - 65;
            currentTopic.quiz[j].explanation = `The correct answer is ${answers[j]}.`;
          }
        }
      }
    }
  }
  
  if (currentTopic) {
    allTopics.push(currentTopic);
  }
});

const tsContent = `import { Topic, QuizQuestion } from '../types';\n\nexport const LEARNING_TOPICS: Topic[] = ${JSON.stringify(allTopics, null, 2)};\n\nexport const CHAPTER_TESTS: Record<string, QuizQuestion[]> = ${JSON.stringify(chapterTests, null, 2)};\n`;
fs.writeFileSync('src/data/learningTopics.ts', tsContent);
console.log('Successfully generated learningTopics.ts with ' + allTopics.length + ' topics and ' + Object.keys(chapterTests).length + ' chapter tests.');
