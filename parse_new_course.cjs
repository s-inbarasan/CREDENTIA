const fs = require('fs');

const rawData = JSON.parse(fs.readFileSync('raw_curriculum_1_2.json', 'utf8'));

const allTopics = rawData.map((module) => {
  return {
    id: `BC-M${module.id}`,
    chapterId: "BOOTCAMP",
    chapterTitle: "Cybersecurity Foundations",
    title: `Module ${module.id}: ${module.title}`,
    level: "Beginner",
    icon: module.icon,
    sections: [
      {
        id: "s0",
        type: "intro",
        title: `Welcome to ${module.title}`,
        content: module.summary,
        learningObjectives: module.lessons.map(l => l.title)
      },
      ...module.lessons.map((lesson, index) => ({
        id: `s${index + 1}`,
        type: "concept",
        title: lesson.title,
        content: lesson.content,
        deepDive: lesson.visual_recommendation
      }))
    ],
    quiz: module.lessons.flatMap((lesson, lIndex) => 
      lesson.quiz.map((q, qIndex) => ({
        id: `q${lIndex}_${qIndex}`,
        question: q.question,
        options: q.options,
        correctAnswerIndex: q.options.indexOf(q.answer) !== -1 ? q.options.indexOf(q.answer) : 0,
        explanation: q.explanation
      }))
    )
  };
});

const tsContent = `import { Topic } from '../types';\n\nexport const LEARNING_TOPICS: Topic[] = ${JSON.stringify(allTopics, null, 2)};\n`;
fs.writeFileSync('src/data/learningTopics.ts', tsContent);
console.log('Successfully generated learningTopics.ts with ' + allTopics.length + ' topics.');
