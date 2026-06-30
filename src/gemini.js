import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

export async function parseTask(taskInput) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });
  const today = new Date().toDateString();

  const prompt = `
You are an AI productivity assistant.

Take the user's task input and return ONLY raw JSON.
Do NOT use markdown.
Do NOT wrap in json.

Format:
{
  "title": "",
  "priority": "",
  "deadline": "",
  "category": ""
}

Rules:

CATEGORY:
- Academic, coding, study, assignment, exam -> Study
- Office, client, presentation, meeting -> Work
- Health, gym, family, birthday, personal errands -> Personal

PRIORITY:
- Urgent, exam tomorrow, deadline today -> High
- Otherwise default Medium

DATE RULES (VERY IMPORTANT):
- Today's date is ${today}.
- If user says "today", use today's date exactly.
- If user says "tomorrow", use the next day's date.
- Preserve time information if user specifies a time (example: today 11am → include that day correctly).
- If user gives a date WITHOUT year (example: 13 Dec), assume next upcoming occurrence.
- NEVER return a past date.
- NEVER return dates before today's date.
- If no date mentioned, return "No deadline".
Return example:

{
  "title": "Wish birthday",
  "priority": "Medium",
  "deadline": "13 Dec 2026",
  "category": "Personal"
}

User input: ${taskInput}
`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  const cleaned = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}


export async function analyzeCalendarEvent(eventTitle) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const prompt = `
You are an AI productivity assistant.

Analyze this calendar event.

Event:
"${eventTitle}"

Return ONLY raw JSON.
Do NOT use markdown.
Do NOT wrap in json.

Format:

{
  "actionable": true,
  "priority": "High",
  "category": "Work"
}

Rules:

ACTIONABLE = true only if user needs to actively prepare, work, or take action.

ACTIONABLE = false for passive events.

Examples:

"Submit assignment tomorrow"
→ actionable = true

"Team meeting at 5pm"
→ actionable = true

"Train to Gorakhpur"
→ actionable = false

"Birthday dinner"
→ actionable = false

"Dentist appointment"
→ actionable = false

Priority:
Urgent deadlines → High
Meetings/work → Medium
Personal → Low

Category:
Study / Work / Personal

Return JSON only.
`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  const cleaned = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}



export async function askNova(userMessage, tasks) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const prompt = `
You are NOVA, an AI productivity assistant.

The user currently has these tasks:

${JSON.stringify(tasks)}

The user asked:

"${userMessage}"

Answer as a smart productivity coach.

Rules:
- Give practical advice
- Prioritize based on deadlines and priority
- Keep answer short but helpful
- Talk like an intelligent assistant
IMPORTANT:
- Do NOT use markdown
- Do NOT use ** symbols
- Do NOT use bullet formatting symbols
- Respond in plain clean text

`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}



export async function generateSchedule(tasks) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });
  const today = new Date().toDateString();

  const prompt = `
You are NOVA, an AI productivity scheduling assistant.

The user has these tasks:

${JSON.stringify(tasks)}

Create the best schedule for TODAY.

Rules:
- Prioritize High priority tasks first
- Study/work tasks should come before personal tasks
- Give realistic time blocks
- Include short breaks
- If a task has no immediate deadline, push it later
- Keep schedule practical for a college student

Return plain text only.

Example:

9:00 AM - Work on DBMS Assignment  
11:00 AM - Short Break  
11:30 AM - Continue Hackathon Project  
1:00 PM - Lunch  
2:00 PM - Review Pending Study Tasks  
5:00 PM - Gym  
7:00 PM - Personal Tasks

Do NOT use markdown.
Do NOT use bullet points.
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function handleDelay(tasks, delayTime) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const prompt = `
You are NOVA, an intelligent productivity AI.

The user had a planned schedule but got delayed.

Current tasks:

${JSON.stringify(tasks)}

Delay caused:

${delayTime}

You must intelligently reschedule the remaining tasks.

Rules:
- Prioritize urgent and high priority tasks first
- Shift low priority tasks later
- Suggest a revised plan
- Keep answer short but intelligent

IMPORTANT:
Do NOT use markdown
Do NOT use bullet symbols
Plain clean text only
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}