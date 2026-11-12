const HOURS_PER_CALL = 0.25 // assumption: an avoided call saves about 15 minutes

function Bars({ data }) {
  const max = Math.max(1, ...data.map((d) => d[1]))
  return data.map(([name, n]) => (
    <div className="bar" key={name}>
      <span>{name}</span>
      <div><i style={{ width: (n / max) * 100 + '%' }} /></div>
      <b>{n}</b>
    </div>
  ))
}

const count = (arr) => Object.entries(arr.reduce((a, k) => ((a[k] = (a[k] || 0) + 1), a), {})).sort((a, b) => b[1] - a[1])

export default function Insights({ tickets, avoided, loadSample }) {
  const total = tickets.length + avoided.length
  if (!total)
    return (
      <div className="empty">
        <h2>Nothing to analyse yet</h2>
        <p>Use the Assistant for a few issues, or load sample data.</p>
        <button className="primary" onClick={loadSample}>Load sample data</button>
      </div>
    )

  const rate = Math.round((avoided.length / total) * 100)
  const issues = count([...avoided.map((a) => a.issue), ...tickets.map((t) => t.triage.title)]).slice(0, 5)
  const cats = count(tickets.map((t) => t.triage.category))
  const top = issues[0]

  return (
    <section className="insights">
      <div className="stats">
        <div><big>{rate}%</big>deflection rate</div>
        <div><big>{avoided.length}</big>calls avoided</div>
        <div><big>{tickets.length}</big>tickets raised</div>
        <div><big>{(avoided.length * HOURS_PER_CALL).toFixed(1)}h</big>agent time saved</div>
      </div>
      <div className="panel"><h3>Most common issues</h3><Bars data={issues} /></div>
      {cats.length > 0 && <div className="panel"><h3>Tickets by category</h3><Bars data={cats} /></div>}
      {top && top[1] > 1 && (
        <div className="panel rec"><h3>Recommendation</h3>
          <p>"{top[0]}" came up {top[1]} times. Write a knowledge base article or automate the fix to cut more calls.</p>
        </div>
      )}
      <p className="muted">Time saved assumes 15 minutes per avoided call.</p>
    </section>
  )
}
