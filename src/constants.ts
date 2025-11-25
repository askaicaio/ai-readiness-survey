import type { Question } from './types';

export const SURVEY_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "How would you describe your current understanding of Generative AI?",
    type: 'multiple-choice',
    options: ["Beginner: I'm just starting to learn what it is.", "Familiar: I understand the basic concepts.", "Intermediate: I have some hands-on experience.", "Advanced: I use it regularly and understand its nuances."],
  },
  {
    id: 2,
    text: "What is your primary motivation for learning about Generative AI?",
    type: 'multiple-choice',
    options: ["Improve my personal productivity.", "Stay relevant and competitive in my field.", "Explore new strategic opportunities for my business.", "General curiosity about new technology."],
  },
  {
    id: 3,
    text: "Which statement best reflects your feelings about AI's impact on your profession?",
    type: 'multiple-choice',
    options: ["Excited about the new possibilities and efficiencies.", "Concerned about job displacement and the need to adapt.", "A balanced mix of excitement and concern.", "Unsure what to think at this stage."],
  },
  {
    id: 4,
    text: "What do you see as your biggest challenge in adopting AI in your work?",
    type: 'multiple-choice',
    options: ["Lack of technical skills or understanding.", "Not enough time to learn and experiment.", "Difficulty identifying practical use cases for my role.", "Concerns about data privacy and security."],
  },
  {
    id: 5,
    text: "Which area of your work are you most interested in applying Generative AI to?",
    type: 'multiple-choice',
    options: ["Automating repetitive tasks (e.g., summarizing meetings, sorting emails).", "Generating creative content (e.g., reports, marketing copy, presentations).", "Analyzing data to find insights and trends.", "Strategic planning and brainstorming new ideas."],
  },
  {
    id: 6,
    text: "Have you used any Generative AI tools like ChatGPT, Gemini, or Midjourney?",
    type: 'multiple-choice',
    options: ["No, I have not used any.", "Yes, I've tried them out a few times.", "Yes, I use them occasionally for personal tasks.", "Yes, I use them regularly for work-related tasks."],
  },
  {
    id: 7,
    text: "How do you prefer to learn new complex skills?",
    type: 'multiple-choice',
    options: ["Self-paced online courses with video tutorials.", "Live, interactive workshops and webinars.", "Hands-on, project-based learning.", "Reading articles, books, and case studies."],
  },
  {
    id: 8,
    text: "On a scale of 1 to 5, how important is understanding the ethical implications of AI to you?",
    type: 'scale',
    options: ["1: Not important", "2", "3", "4", "5: Very important"],
  },
  {
    id: 9,
    text: "What is your ultimate goal with AI education?",
    type: 'multiple-choice',
    options: ["Become a proficient user to enhance my current role.", "Become an expert who can lead AI initiatives.", "Simply understand the basics to not fall behind.", "I'm not sure yet, just exploring."],
  },
  {
    id: 10,
    text: "Imagine you have a magic AI assistant. What is the one professional task you'd want it to handle for you completely?",
    type: 'text',
  },
];
