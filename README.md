# DeskPilot: AI IT Support Assistant

A React app that helps employees fix small IT problems themselves (**ticket deflection**) and gives service desk agents fully triaged tickets when self-help is not enough.


## Features
- **Employee assistant:** guided fixes one step at a time with "That fixed it / Still not working" buttons
- **Safety escalation:** phishing, malware, stolen device and similar issues skip self-help and go straight to the desk
- **Agent console:** auto-triaged tickets with priority and reasoning, steps already tried, questions to ask, and a ready-to-send reply draft
- **Insights:** deflection rate, calls avoided, agent time saved, most common issues, KB recommendation
- **AI + demo mode:** works with no key using built-in rules; add an Anthropic API key in Settings for AI triage. Falls back to rules if the API call fails
- Data stored in the browser (localStorage), no backend. Light and dark mode follow the system theme

## Run it
```bash
npm install
npm run dev
```
Open the app, go to Insights and click **Load sample data** to see it populated.

## Tech
React 18, Vite, plain CSS, localStorage, Anthropic Messages API (optional).

## Structure
```
src/
  ai.js          AI triage call + rule-based fallback
  data.js        knowledge base, risky keywords, sample data
  App.jsx        navigation and shared state
  components/    Assistant, AgentConsole, Insights, Settings
```

## Design decisions
- The AI is asked for strict JSON and the response is parsed in a try/catch, so a bad response never breaks the app
- The API key stays in the browser and is never committed. For production this call would move to a backend
- Risky issues are escalated by rule before any AI or self-help runs, as a real desk would

## Ideas for next steps
Real ticketing integration (ServiceNow/Jira), a backend for the API key, SLA timers, more KB articles.

## Resume bullet
Built DeskPilot, a React self-service assistant that guides employees through step-by-step IT fixes and auto-generates triaged tickets (category, priority, missing info, reply draft) for unresolved issues, with a dashboard tracking call-deflection rate and recurring issues.
