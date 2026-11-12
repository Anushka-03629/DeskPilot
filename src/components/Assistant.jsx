import { useState, useRef, useEffect } from 'react'
import { isRisky, matchIssue, KB } from '../data'

export default function Assistant({ addTicket, logAvoided }) {
  const [input, setInput] = useState('')
  const [chat, setChat] = useState([{ from: 'bot', text: "Hi, I'm DeskPilot. Tell me what's wrong and I'll try to fix it with you before you need to call the desk." }])
  const [issue, setIssue] = useState(null) // { text, title?, steps? }
  const [step, setStep] = useState(0)
  const [busy, setBusy] = useState(false)
  const box = useRef(null)
  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight }, [chat, step])

  const say = (from, text) => setChat((c) => [...c, { from, text }])
  const tried = issue?.steps ? issue.steps.slice(0, step) : []

  const escalate = async (text, triedSteps) => {
    setBusy(true)
    const t = await addTicket(text, triedSteps)
    say('bot', `Ticket ${t.id} sent to the Service Desk as ${t.triage.priority} priority. An agent will contact you. Anything else?`)
    setIssue(null); setStep(0); setBusy(false)
  }

  const send = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    setInput(''); say('user', text)
    if (isRisky(text)) {
      say('bot', 'This could be a security issue, so please do not try to fix it yourself. I am raising it with the Service Desk right now.')
      return escalate(text, [])
    }
    const m = matchIssue(text)
    if (m) { setIssue({ ...m, text }); setStep(0); say('bot', `This looks like "${m.title}". Let's try a few quick steps.`) }
    else { setIssue({ text }); say('bot', "I don't have a quick fix for that one. I can send it to the Service Desk with all details ready.") }
  }

  const fixed = () => { logAvoided(issue.title); say('user', 'That fixed it'); say('bot', 'Great! You just saved yourself a call. Anything else?'); setIssue(null); setStep(0) }
  const notFixed = () => { say('user', 'Still not working'); setStep((s) => s + 1) }

  const inSteps = issue?.steps && step < issue.steps.length

  return (
    <section className="assistant">
      <div className="chat" ref={box}>
        {chat.map((m, i) => <div key={i} className={'msg ' + m.from}>{m.text}</div>)}
        {inSteps && (
          <div className="stepcard">
            <small>Step {step + 1} of {issue.steps.length}</small>
            <p>{issue.steps[step]}</p>
            <div className="row">
              <button className="ok" onClick={fixed}>That fixed it</button>
              <button onClick={notFixed}>Still not working</button>
            </div>
          </div>
        )}
        {issue && !inSteps && (
          <div className="stepcard">
            <p>{issue.steps ? "We've tried the quick fixes." : 'Ready to hand this over?'} Send it to the Service Desk and an agent will pick it up.</p>
            <div className="row"><button className="primary" disabled={busy} onClick={() => escalate(issue.text, tried)}>{busy ? 'Creating ticket...' : 'Send to Service Desk'}</button></div>
          </div>
        )}
      </div>
      <form className="composer" onSubmit={send}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. my VPN won't connect" />
        <button className="primary">Send</button>
      </form>
      <div className="chips">
        {KB.map((k) => <button key={k.id} onClick={() => setInput(k.title)}>{k.title}</button>)}
      </div>
    </section>
  )
}
