const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const Question = require('./models/Question');
const TestConfig = require('./models/TestConfig');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

const importData = async () => {
  try {
    console.log('Starting data import...');

    await Question.deleteMany();
    await TestConfig.deleteMany();
    console.log('Cleared existing questions and tests');
    const questionsPath = path.join(__dirname, 'data', 'questions-text.json');
    const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));
    const insertedQuestions = await Question.insertMany(questionsData);
    console.log(`Inserted ${insertedQuestions.length} questions`);
    await createSampleTests(insertedQuestions);
    console.log('Data import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    console.log('Deleting all data...');
    
    await Question.deleteMany();
    await TestConfig.deleteMany();
    await User.deleteMany();
    
    console.log('All data deleted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error deleting data:', error);
    process.exit(1);
  }
};

const createSampleTests = async (questions) => {
  try {
    const quantsEasy = questions.filter(q => q.type === 'Quants' && q.difficulty === 'Easy').map(q => q._id);
    const quantsMedium = questions.filter(q => q.type === 'Quants' && q.difficulty === 'Medium').map(q => q._id);
    const quantsHard = questions.filter(q => q.type === 'Quants' && q.difficulty === 'Hard').map(q => q._id);
    
    const logicalEasy = questions.filter(q => q.type === 'Logical' && q.difficulty === 'Easy').map(q => q._id);
    const logicalMedium = questions.filter(q => q.type === 'Logical' && q.difficulty === 'Medium').map(q => q._id);
    const logicalHard = questions.filter(q => q.type === 'Logical' && q.difficulty === 'Hard').map(q => q._id);
    
    const verbalEasy = questions.filter(q => q.type === 'Verbal' && q.difficulty === 'Easy').map(q => q._id);
    const verbalMedium = questions.filter(q => q.type === 'Verbal' && q.difficulty === 'Medium').map(q => q._id);
    const verbalHard = questions.filter(q => q.type === 'Verbal' && q.difficulty === 'Hard').map(q => q._id);

    const getRandomSubset = (arr, count) => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    const tests = [
      {
        title: 'TCS NQT Mock Test 1',
        company: 'TCS',
        duration: 90,
        difficulty: 'Medium',
        totalMarks: 30,
        questions: [
          ...getRandomSubset(quantsEasy, 6),
          ...getRandomSubset(quantsMedium, 6),
          ...getRandomSubset(logicalEasy, 5),
          ...getRandomSubset(logicalMedium, 5),
          ...getRandomSubset(verbalEasy, 5),
          ...getRandomSubset(verbalMedium, 3)
        ]
      },
      {
        title: 'TCS Digital Mock Test',
        company: 'TCS',
        duration: 90,
        difficulty: 'Hard',
        totalMarks: 35,
        questions: [
          ...getRandomSubset(quantsMedium, 8),
          ...getRandomSubset(quantsHard, 4),
          ...getRandomSubset(logicalMedium, 8),
          ...getRandomSubset(logicalHard, 4),
          ...getRandomSubset(verbalMedium, 7),
          ...getRandomSubset(verbalEasy, 4)
        ]
      },
      {
        title: 'Wipro NLTH Practice Test',
        company: 'Wipro',
        duration: 60,
        difficulty: 'Medium',
        totalMarks: 25,
        questions: [
          ...getRandomSubset(quantsEasy, 5),
          ...getRandomSubset(quantsMedium, 5),
          ...getRandomSubset(logicalEasy, 4),
          ...getRandomSubset(logicalMedium, 4),
          ...getRandomSubset(verbalEasy, 4),
          ...getRandomSubset(verbalMedium, 3)
        ]
      },
      {
        title: 'Infosys HackWithInfy Mock',
        company: 'Infosys',
        duration: 120,
        difficulty: 'Hard',
        totalMarks: 40,
        questions: [
          ...getRandomSubset(quantsMedium, 10),
          ...getRandomSubset(quantsHard, 5),
          ...getRandomSubset(logicalMedium, 8),
          ...getRandomSubset(logicalHard, 5),
          ...getRandomSubset(verbalMedium, 8),
          ...getRandomSubset(verbalEasy, 4)
        ]
      },
      {
        title: 'Accenture Aptitude Test',
        company: 'Accenture',
        duration: 45,
        difficulty: 'Easy',
        totalMarks: 20,
        questions: [
          ...getRandomSubset(quantsEasy, 5),
          ...getRandomSubset(quantsMedium, 2),
          ...getRandomSubset(logicalEasy, 5),
          ...getRandomSubset(logicalMedium, 2),
          ...getRandomSubset(verbalEasy, 5),
          ...getRandomSubset(verbalMedium, 1)
        ]
      },
      {
        title: 'Cognizant GenC Mock Test',
        company: 'Cognizant',
        duration: 75,
        difficulty: 'Medium',
        totalMarks: 30,
        questions: [
          ...getRandomSubset(quantsEasy, 6),
          ...getRandomSubset(quantsMedium, 6),
          ...getRandomSubset(logicalEasy, 5),
          ...getRandomSubset(logicalMedium, 5),
          ...getRandomSubset(verbalEasy, 5),
          ...getRandomSubset(verbalMedium, 3)
        ]
      },
      {
        title: 'Amazon Online Assessment',
        company: 'Amazon',
        duration: 90,
        difficulty: 'Hard',
        totalMarks: 35,
        questions: [
          ...getRandomSubset(quantsMedium, 7),
          ...getRandomSubset(quantsHard, 5),
          ...getRandomSubset(logicalMedium, 8),
          ...getRandomSubset(logicalHard, 5),
          ...getRandomSubset(verbalMedium, 7),
          ...getRandomSubset(verbalEasy, 3)
        ]
      },
      {
        title: 'Microsoft Online Test',
        company: 'Microsoft',
        duration: 90,
        difficulty: 'Hard',
        totalMarks: 40,
        questions: [
          ...getRandomSubset(quantsMedium, 10),
          ...getRandomSubset(quantsHard, 6),
          ...getRandomSubset(logicalMedium, 8),
          ...getRandomSubset(logicalHard, 6),
          ...getRandomSubset(verbalMedium, 7),
          ...getRandomSubset(verbalEasy, 3)
        ]
      },
      {
        title: 'Google Aptitude Round',
        company: 'Google',
        duration: 120,
        difficulty: 'Hard',
        totalMarks: 50,
        questions: [
          ...getRandomSubset(quantsMedium, 12),
          ...getRandomSubset(quantsHard, 8),
          ...getRandomSubset(logicalMedium, 10),
          ...getRandomSubset(logicalHard, 8),
          ...getRandomSubset(verbalMedium, 8),
          ...getRandomSubset(verbalEasy, 4)
        ]
      },
      {
        title: 'IBM Cognitive Ability Test',
        company: 'IBM',
        duration: 75,
        difficulty: 'Medium',
        totalMarks: 30,
        questions: [
          ...getRandomSubset(quantsEasy, 6),
          ...getRandomSubset(quantsMedium, 6),
          ...getRandomSubset(logicalEasy, 5),
          ...getRandomSubset(logicalMedium, 5),
          ...getRandomSubset(verbalEasy, 5),
          ...getRandomSubset(verbalMedium, 3)
        ]
      },
      {
        title: 'Capgemini Aptitude Test',
        company: 'Capgemini',
        duration: 60,
        difficulty: 'Medium',
        totalMarks: 25,
        questions: [
          ...getRandomSubset(quantsEasy, 5),
          ...getRandomSubset(quantsMedium, 5),
          ...getRandomSubset(logicalEasy, 4),
          ...getRandomSubset(logicalMedium, 4),
          ...getRandomSubset(verbalEasy, 4),
          ...getRandomSubset(verbalMedium, 3)
        ]
      },
      {
        title: 'Tech Mahindra Aptitude Round',
        company: 'Tech Mahindra',
        duration: 60,
        difficulty: 'Medium',
        totalMarks: 25,
        questions: [
          ...getRandomSubset(quantsEasy, 5),
          ...getRandomSubset(quantsMedium, 5),
          ...getRandomSubset(logicalEasy, 4),
          ...getRandomSubset(logicalMedium, 4),
          ...getRandomSubset(verbalEasy, 4),
          ...getRandomSubset(verbalMedium, 3)
        ]
      },
      {
        title: 'HCL Aptitude Test',
        company: 'HCL',
        duration: 60,
        difficulty: 'Easy',
        totalMarks: 20,
        questions: [
          ...getRandomSubset(quantsEasy, 6),
          ...getRandomSubset(quantsMedium, 1),
          ...getRandomSubset(logicalEasy, 6),
          ...getRandomSubset(logicalMedium, 1),
          ...getRandomSubset(verbalEasy, 6)
        ]
      },
      {
        title: 'Deloitte Aptitude Test',
        company: 'Deloitte',
        duration: 75,
        difficulty: 'Medium',
        totalMarks: 30,
        questions: [
          ...getRandomSubset(quantsEasy, 6),
          ...getRandomSubset(quantsMedium, 6),
          ...getRandomSubset(logicalEasy, 5),
          ...getRandomSubset(logicalMedium, 5),
          ...getRandomSubset(verbalEasy, 5),
          ...getRandomSubset(verbalMedium, 3)
        ]
      },
      {
        title: 'Oracle Aptitude Round',
        company: 'Oracle',
        duration: 90,
        difficulty: 'Medium',
        totalMarks: 35,
        questions: [
          ...getRandomSubset(quantsEasy, 8),
          ...getRandomSubset(quantsMedium, 7),
          ...getRandomSubset(logicalEasy, 6),
          ...getRandomSubset(logicalMedium, 6),
          ...getRandomSubset(verbalEasy, 5),
          ...getRandomSubset(verbalMedium, 3)
        ]
      },
      {
        title: 'Adobe Quantitative Assessment',
        company: 'Adobe',
        duration: 90,
        difficulty: 'Hard',
        totalMarks: 35,
        questions: [
          ...getRandomSubset(quantsMedium, 8),
          ...getRandomSubset(quantsHard, 5),
          ...getRandomSubset(logicalMedium, 7),
          ...getRandomSubset(logicalHard, 5),
          ...getRandomSubset(verbalMedium, 7),
          ...getRandomSubset(verbalEasy, 3)
        ]
      }
    ];

    const insertedTests = await TestConfig.insertMany(tests);
    console.log(`Created ${insertedTests.length} sample tests`);

  } catch (error) {
    console.error('Error creating sample tests:', error);
  }
};

if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}