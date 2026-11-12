import { useState } from 'react'

const STATUSES = ['Open', 'In Progress', 'Resolved']

export default function AgentConsole({ tickets, setStatus, loadSample }) {
  const [selId, setSelId] = useState(null)
  const [filter, setFilter] = useState('All')
  const [q, setQ] = useState('')
  const [copied, setCopied] = useState(false)

  if (!tickets.length)
    return (
      <div className="empty">
        <h2>No tickets yet</h2>
        <p>Raise one from the Assistant tab, or load sample data to explore.</p>
        <button className="primary" onClick={loadSample}>Load sample data</button>
      </div>
    )

  const shown = tickets.filter((t) => (filter === 'All' || t.status === filter) && (t.triage.title + t.text).toLowerCase().includes(q.toLowerCase()))
  const sel = tickets.find((t) => t.id === selId) || shown[0]

  const copy = () => { navigator.clipboard.writeText(sel.triage.reply); setCopied(true); setTimeout(() => setCopied(false), 1500) }

  return (
    <section className="console">
      <div className="queue">
        <div className="row">
          <input placeholder="Search tickets" value={q} onChange={(e) => setQ(e.target.value)} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>{['All', ...STATUSES].map((s) => <option key={s}>{s}</option>)}</select>
        </div>
        {shown.map((t) => (
          <button key={t.id} className={'ticket p-' + t.triage.priority + (sel?.id === t.id ? ' sel' : '')} onClick={() => setSelId(t.id)}>
            <b>{t.id}</b> <span className="tag">{t.triage.priority}</span>
            <div>{t.triage.title}</div>
            <small>{t.status} · {t.triage.category}</small>
          </button>
        ))}
        {!shown.length && <p className="muted">No tickets match.</p>}
      </div>

      {sel && (
        <div className="detail">
          <h2>{sel.triage.title}</h2>
          <p className="muted">{sel.id} · {new Date(sel.created).toLocaleString()} · triaged by {sel.triage.source === 'ai' ? 'AI' : 'rules (demo mode)'}</p>
          <div className="row">
            {STATUSES.map((s) => <button key={s} className={sel.status === s ? 'primary' : ''} onClick={() => setStatus(sel.id, s)}>{s}</button>)}
          </div>
          <h3>Priority: {sel.triage.priority}</h3>
          <p>{sel.triage.reasoning}</p>
          <h3>User said</h3><p>{sel.text}</p>
          <h3>Already tried (do not repeat)</h3>
          {sel.triage.tried?.length ? <ul>{sel.triage.tried.map((s, i) => <li key={i}>{s}</li>)}</ul> : <p className="muted">Nothing yet.</p>}
          <h3>Ask the user</h3>
          <ul>{(sel.triage.missing || []).map((s, i) => <li key={i}>{s}</li>)}</ul>
          <h3>Reply draft</h3>
          <pre>{sel.triage.reply || 'No draft for sample tickets.'}</pre>
          {sel.triage.reply && <button onClick={copy}>{copied ? 'Copied' : 'Copy reply'}</button>}
        </div>
      )}
    </section>
  )
}
