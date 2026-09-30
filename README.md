# StudyMind AI 🤖📚

StudyMind AI is an AI-powered personal study assistant designed to help college students learn, practice, and track their study progress.

## 🚀 Features

- 🤖 AI Study Assistant
- 📖 Simple explanations for difficult topics
- 📝 AI-generated practice quizzes
- 🎯 Interactive multiple-choice questions
- 📊 Quiz score and percentage calculation
- 💾 Study progress tracking
- 📌 Strong / Developing / Weak topic identification
- 📚 Recommended next topic
- 🔄 Automated AI workflow using n8n

## 🛠️ Technologies Used

- HTML
- CSS
- JavaScript
- n8n
- Google Gemini
- n8n Webhooks
- n8n Data Tables

## 🏗️ System Architecture

Student  
↓  
StudyMind AI Web Interface  
↓  
n8n Webhook  
↓  
Request Routing  
↓  
Google Gemini AI / Quiz / Progress Workflow  
↓  
n8n Data Table  
↓  
Response  
↓  
Student

## 🔄 How It Works

### 1. AI Study Assistant
Students can ask StudyMind AI questions about their studies and receive simple explanations.

### 2. Practice Quiz
The system can generate a practice quiz with multiple-choice questions.

### 3. Quiz Evaluation
Students select their answers and submit the quiz. The system calculates the score and percentage.

### 4. Progress Tracking
Quiz results are stored in an n8n Data Table.

### 5. Performance Status

| Percentage | Status |
|---|---|
| Below 60% | Weak |
| 60% – 79% | Developing |
| 80% and above | Strong |

### 6. Recommendation
Based on the student's performance, StudyMind AI recommends what the student should study or practice next.

## 💡 Project Goal

The goal of StudyMind AI is to provide students with a simple personalized learning assistant that combines artificial intelligence, automation, quizzes, and progress tracking in one system.

## 👨‍💻 Developed By

**Dhanush Kalaga**

B.Tech — Computer Science and Engineering (Artificial Intelligence & Machine Learning)

## 🔮 Future Improvements

- Support for multiple subjects
- Automatic answer-key generation for every quiz
- Student login and individual profiles
- Detailed progress charts
- Personalized study schedules
- Deployment as a public web application
- Voice-based interaction

## 📌 Project Status

Core StudyMind AI workflow completed with AI assistance, interactive quizzes, progress tracking, and recommendations.
