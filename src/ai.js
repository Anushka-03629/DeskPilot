import { KB, isRisky, matchIssue } from './data'

// Rule-based triage. Used in demo mode and as a fallback if the AI call fails.
export function localTriage(text, tried = []) {
  const risky = isRisky(text)
  const m = matchIssue(text)
  const wide = /everyone|all users|whole (team|office)|nobody|outage/i.test(text)
  const priority = risky ? 'Critical' : wide ? 'High' : m?.priority || 'Medium'
  const category = risky ? 'Security' : m?.category || 'General'
  const title = m && !risky ? m.title : text.length > 60 ? text.slice(0, 57) + '...' : text
  const reasoning = risky
    ? 'Possible security incident. Needs immediate agent attention, so self-help was skipped.'
    : wide
    ? 'Multiple users affected, so priority is raised.'
    : `Typical impact for "${category}" issues. Single user, work can usually continue.`
  const missing = ['When did the problem start?', 'Any error message or screenshot?', 'Does it happen on other devices or networks?']
  const reply = `Hi,\n\nThanks for reaching out about "${title}". ${tried.length ? `I can see you already tried ${tried.length} step(s), so we will not repeat those. ` : ''}To help us fix this faster, could you please reply with:\n- ${missing.join('\n- ')}\n\nWe will keep you updated.\n\nKind regards,\nService Desk`
  return { title, category, priority, reasoning, tried, missing, reply, source: 'demo' }
}

const PROMPT = `You are a service desk triage assistant. Given a user's IT problem and steps they already tried, reply with ONLY valid JSON (no markdown) with keys: title (short), category (Network|Hardware|Software|Access|Security|General), priority (Low|Medium|High|Critical), reasoning (one sentence), missing (array of up to 3 questions for the user), reply (polite ready-to-send email draft, under 120 words). Security issues are always Critical.`

export async function aiTriage(text, tried, apiKey) {
  if (!apiKey) return localTriage(text, tried)
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 800,
        system: PROMPT,
        messages: [{ role: 'user', content: `Problem: ${text}\nSteps already tried: ${tried.join('; ') || 'none'}` }],
      }),
    })
    if (!res.ok) throw new Error('API error ' + res.status)
    const data = await res.json()
    const raw = data.content.map((c) => c.text || '').join('').replace(/```json|```/g, '').trim()
    const out = JSON.parse(raw)
    return { ...out, tried, source: 'ai' }
  } catch (e) {
    console.warn('AI triage failed, using fallback:', e)
    return { ...localTriage(text, tried), source: 'fallback' }
  }
}
