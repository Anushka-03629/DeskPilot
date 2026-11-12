# DeskPilot: AI IT Support Assistant

**Live demo:** https://desk-pilot-one.vercel.app/

DeskPilot helps employees fix small IT problems themselves, so they don't need to call the service desk. When a problem can't be fixed that way, it creates a ticket that is already triaged for the agent. It is built with React and works with no setup in demo mode.


## Screenshots

| Assistant | Agent console | Insights |
|---|---|---|
| ![Assistant](docs/assistant.png) | ![Agent console](docs/agent.png) | ![Insights](docs/insights.png) |

## What it does

**For employees (Assistant tab)**
- Describe a problem in plain words and get guided fixes one step at a time
- Answer "That fixed it" or "Still not working" after each step
- A fixed issue is logged as a **call avoided**
- If self-help fails, one click sends the issue to the Service Desk

**Safety rules**
- Issues like phishing, malware, stolen devices and suspected breaches skip self-help and are raised straight away as **Critical**, as a real service desk would handle them

**For agents (Agent console tab)**
- Each ticket arrives with a clean title, category and suggested priority with reasoning
- Shows the steps the user already tried, so the agent doesn't repeat them
- Lists the questions to ask the user and gives a ready-to-send reply draft
- Search, filter by status, and update ticket status

**For managers (Insights tab)**
- Deflection rate, calls avoided, tickets raised and estimated agent time saved
- Most common issues and tickets by category
- A recommendation to write a knowledge base article for the top recurring issue

## Try it in 30 seconds
1. Open the [live demo](https://desk-pilot-one.vercel.app/)
2. On the Assistant tab, click **VPN not connecting** and send it
3. Click through the steps, then try **Still not working** until it offers to send to the Service Desk
4. Open **Insights** and click **Load sample data**

## AI mode and demo mode
- **Demo mode (default):** triage runs on built-in rules, so the app works without any key
- **AI mode:** in **Settings**, paste an Anthropic API key to have an AI model generate the triage (title, category, priority, reasoning, questions and reply draft)
- The key is stored only in your browser (localStorage) and sent only to `api.anthropic.com`
- The AI is asked for strict JSON, and the response is parsed inside a try/catch. If the call fails or the output is invalid, the app falls back to the rule-based triage instead of breaking

## Tech stack
React 18, Vite, plain CSS (light and dark mode), localStorage for data, Anthropic Messages API (optional). No backend or database.

## Run locally
```bash
git clone https://github.com/Anushka-03629/DeskPilot.git
cd DeskPilot
npm install
npm run dev
```
Then open http://localhost:5173

## Project structure
```
src/
  App.jsx             navigation and shared state
  ai.js               AI triage call and rule-based fallback
  data.js             knowledge base, risky keywords, sample data
  ErrorBoundary.jsx   shows errors instead of a blank page
  components/
    Assistant.jsx     guided self-help chat
    AgentConsole.jsx  ticket queue and details
    Insights.jsx      deflection metrics
    Settings.jsx      API key and data controls
```

## Design decisions
- **Deflection first:** the most useful ticket is the one that never gets raised, so the assistant tries fixes before escalating
- **Rules before AI for risky issues:** security-related keywords trigger escalation before any AI or self-help runs
- **Always works:** demo mode and the fallback mean the app never depends on an API being available
- **Simple state:** React hooks and a small localStorage hook, with no extra libraries

## Known limitations and next steps
- The API key is used from the browser, which is fine for a personal demo. A production version would send the request through a backend to protect the key
- Tickets are stored in the browser only, not shared between users
- The knowledge base is small. Next steps are more articles, SLA timers, and integration with a real ticketing tool such as Jira or ServiceNow

## Author
Anushka ([@Anushka-03629](https://github.com/Anushka-03629))
