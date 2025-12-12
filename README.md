# AptiSure - Placement Preparation Platform
A comprehensive web application for placement test preparation featuring practice modes, company-specific mock tests, and intelligent progress tracking.

# Features
## Practice Mode
Random Practice: Get one question at a time with instant feedback
Generated Sets: Create custom question sets with difficulty distribution
Topic Selection: Filter by Quants, Logical, Verbal and 45+ subtopics
Instant Solutions: Detailed explanations after each answer

## Test Mode
16 Company Tests: TCS, Wipro, Infosys, Amazon, Microsoft, Google, and more
Timed Tests: Realistic test environment with countdown timer
Question Navigator: Jump between questions during test
Detailed Results: Score breakdown with correct/incorrect answers

## Analytics Dashboard
Donut Chart: Visual representation of solved questions by difficulty
Score Graph: Track last 5 test performances
Progress Stats: Easy/Medium/Hard question counts
Performance Tracking: Monitor improvement over time

## Authentication
Google OAuth login
7-day JWT session persistence
Secure user data management

# Tech Stack
## Frontend
- React 18 with Vite
- TailwindCSS for styling
- Recharts for data visualization
- Lucide React for icons
- React Router for navigation
- Axios for API calls

## Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- Passport.js for Google OAuth
- JWT for session management

# Database Schema
1. Users: Google OAuth data, solved stats, solved question IDs
2. Questions: 1300+ questions with tags, difficulty, solutions
3. TestConfigs: Company-specific test configurations
4. TestResults: Stored test submissions with scores
5. Attempts: Individual question attempt history

# Prerequisites
Node.js v18+
MongoDB (local or Atlas)
Google OAuth credentials