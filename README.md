# NOVA 🚀  
### AI-Powered Productivity Copilot

NOVA is an intelligent productivity assistant designed to help users manage tasks, schedules, deadlines, and focus sessions dynamically using AI.

It combines smart task management, Google Calendar integration, adaptive scheduling, and AI-powered decision making into one unified productivity workspace.

---

## Problem Statement

Traditional productivity and scheduling applications are static and require users to manually organize tasks and priorities.

They fail to intelligently adapt when schedules shift, deadlines change, unexpected delays happen, or external calendar events affect planning.

NOVA solves this by acting as an AI productivity copilot that helps users dynamically manage their workflow.

---

## Solution Overview

NOVA uses artificial intelligence to analyze tasks, prioritize work, integrate calendar events, suggest schedules, and help users recover from delays intelligently.

Instead of manually managing productivity, users interact with an AI assistant that continuously helps optimize their workflow.

---

## Key Features

- AI-powered task parsing using Google Gemini API  
- Smart task categorization (Work / Study / Personal)  
- Automatic task prioritization  
- Google Calendar integration  
- Calendar event analysis and task importing  
- AI productivity assistant chatbot  
- Dynamic delay recovery system ("I Got Delayed")  
- Smart schedule generation  
- Focus Mode with Pomodoro timer  
- Productivity dashboard and analytics  
- Task management with progress tracking  
- Firebase authentication system  
- Cloud database storage with Firestore  

---

## Tech Stack

### Frontend
- React.js  
- Vite  
- Tailwind CSS  
- Framer Motion  
- Recharts  

### Backend
- Firebase Authentication  
- Firestore Database  

### AI Layer
- Google Gemini API  

### Integrations
- Google Calendar API  

### Deployment
- Firebase Hosting (Google Cloud)  

---

## Google Technologies Utilized

- Google Gemini API  
- Firebase Authentication  
- Firestore Database  
- Firebase Hosting  
- Google Calendar API  
- Google Cloud Infrastructure  

---

## Project Architecture

```text
User Interface (React + Vite + TailwindCSS)
                ↓
        Application State Management
     (TaskContext + AuthContext + FocusContext)

        ↙                    ↘
Firebase Authentication      Google Calendar API
(User Login System)         (Event Import System)

                ↓
        Firestore Database
   (Tasks, User Data, Progress)

                ↓
      Google Gemini API Layer
(AI Task Parsing, Scheduling, Delay Recovery,
 Calendar Event Analysis, AI Assistant)
```

---

## Core Modules

### Dashboard
Tracks productivity score, focus sessions, deadlines, and user activity.

### Task Management
AI-powered task parsing, categorization, prioritization, drag-and-drop workflow management.

### Smart Calendar
Imports Google Calendar events and converts actionable events into tasks.

### AI Assistant
Conversational AI assistant that helps prioritize and organize tasks.

### Focus Mode
Pomodoro timer system for deep work sessions with session tracking.

### Delay Recovery Engine
Users can report delays and NOVA intelligently reschedules remaining work.

---

## Future Improvements

- Advanced productivity analytics  
- Habit tracking system  
- Better drag-and-drop interactions  
- Personalized AI productivity coaching  
- Cross-device synchronization  

---

## Author

**Sahil Agrawal**  
B.Tech Computer Science Engineering  
Dayananda Sagar College of Engineering  

---

## Project Status

Hackathon Submission Build — June 2026 🚀