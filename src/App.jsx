import { useState, useEffect } from 'react'
import Assistant from './components/Assistant'
import AgentConsole from './components/AgentConsole'
import Insights from './components/Insights'
import Settings from './components/Settings'
import { aiTriage } from './ai'
import { SAMPLE_TICKETS, SAMPLE_AVOIDED } from './data'

// Tiny hook: state that survives page refresh (no backend needed).
function useLS(key, init) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init } catch { return init }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)) } catch {} }, [key, v])
  return [v, setV]
}

const TABS = [['assistant', 'Assistant'], ['agent', 'Agent console'], ['insights', 'Insights'], ['settings', 'Settings']]

export default function App() {
  const [tab, setTab] = useState('assistant')
  const [tickets, setTickets] = useLS('dp_tickets', [])
  const [avoided, setAvoided] = useLS('dp_avoided', [])
  const [apiKey, setApiKey] = useLS('dp_key', '')

  const addTicket = async (text, tried) => {
    const triage = await aiTriage(text, tried, apiKey)
    const t = { id: 'INC-' + (1001 + tickets.length), text, triage, status: 'Open', created: Date.now() }
    setTickets((p) => [t, ...p])
    return t
  }
  const logAvoided = (issue) => setAvoided((p) => [...p, { issue, ts: Date.now() }])
  const setStatus = (id, status) => setTickets((p) => p.map((t) => (t.id === id ? { ...t, status } : t)))
  const loadSample = () => { setTickets(SAMPLE_TICKETS); setAvoided(SAMPLE_AVOIDED) }
  const clearAll = () => { setTickets([]); setAvoided([]) }

  return (
    <div className="app">
      <header className="top">
        <div className="brand"><span className="dot" />DeskPilot</div>
        <nav>
          {TABS.map(([id, label]) => (
            <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>
              {label}{id === 'agent' && tickets.length > 0 && <b>{tickets.filter((t) => t.status === 'Open').length}</b>}
            </button>
          ))}
        </nav>
      </header>
      <main>
        {tab === 'assistant' && <Assistant addTicket={addTicket} logAvoided={logAvoided} />}
        {tab === 'agent' && <AgentConsole tickets={tickets} setStatus={setStatus} loadSample={loadSample} />}
        {tab === 'insights' && <Insights tickets={tickets} avoided={avoided} loadSample={loadSample} />}
        {tab === 'settings' && <Settings apiKey={apiKey} setApiKey={setApiKey} clearAll={clearAll} />}
      </main>
    </div>
  )
}
