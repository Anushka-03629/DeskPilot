import { useState } from 'react'

export default function Settings({ apiKey, setApiKey, clearAll }) {
  const [v, setV] = useState(apiKey)
  return (
    <section className="settings">
      <h2>AI settings</h2>
      <p>Paste an Anthropic API key to turn on AI triage. It is stored only in this browser and sent only to api.anthropic.com. Without a key, DeskPilot runs in demo mode with built-in rules.</p>
      <div className="row">
        <input type="password" value={v} onChange={(e) => setV(e.target.value)} placeholder="sk-ant-..." />
        <button className="primary" onClick={() => setApiKey(v.trim())}>Save key</button>
      </div>
      <p className="muted">Status: {apiKey ? 'AI triage on' : 'Demo mode'}</p>
      <h2>Data</h2>
      <button onClick={() => window.confirm('Delete all tickets and stats?') && clearAll()}>Clear all data</button>
    </section>
  )
}
