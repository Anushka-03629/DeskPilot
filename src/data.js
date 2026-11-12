// Mini knowledge base: each issue has guided steps the assistant walks through.
export const KB = [
  { id: 'vpn', title: 'VPN not connecting', category: 'Network', priority: 'Medium',
    keywords: ['vpn', 'remote access', 'globalprotect', 'anyconnect'],
    steps: ['Check your internet works by opening any website.', 'Disconnect the VPN fully, wait 10 seconds, then reconnect.', 'Restart the VPN app (quit it from the system tray first).', 'Restart your laptop and try again.'] },
  { id: 'wifi', title: 'Wi-Fi problems', category: 'Network', priority: 'Medium',
    keywords: ['wifi', 'wi-fi', 'internet', 'no network', 'wireless'],
    steps: ['Turn Wi-Fi off and on again.', 'Forget the Wi-Fi network and reconnect with your password.', 'Turn on Airplane mode for 10 seconds, then turn it off.', 'Restart your laptop.'] },
  { id: 'printer', title: 'Printer not working', category: 'Hardware', priority: 'Low',
    keywords: ['print', 'printer', 'printing', 'scanner'],
    steps: ['Check the printer is on and shows no error on its screen.', 'Cancel stuck jobs in the print queue.', 'Remove the printer and add it again from Settings.', 'Try printing a test page.'] },
  { id: 'password', title: 'Password or account locked', category: 'Access', priority: 'Medium',
    keywords: ['password', 'locked', 'locked out', 'login', 'sign in', 'cant log', "can't log"],
    steps: ['Wait 15 minutes. Accounts often unlock on their own.', 'Check Caps Lock and the keyboard language.', 'Use the self-service password reset page on the company portal.', 'Sign in on a different device to rule out a cached old password.'] },
  { id: 'teams', title: 'Teams or Outlook issues', category: 'Software', priority: 'Medium',
    keywords: ['teams', 'outlook', 'crash', 'crashing', 'email not', 'not syncing', 'office'],
    steps: ['Fully quit the app (right-click its icon in the tray, choose Quit).', 'Reopen it and check for updates.', 'Sign out, then sign back in.', 'Clear the app cache or try the web version to see if it works there.'] },
  { id: 'slow', title: 'Slow laptop', category: 'Hardware', priority: 'Low',
    keywords: ['slow', 'laggy', 'freezing', 'hang', 'hanging', 'performance'],
    steps: ['Close apps and browser tabs you are not using.', 'Open Task Manager and check which app uses the most CPU or memory.', 'Restart your laptop. Many people go weeks without one.', 'Check you have at least 10 GB of free disk space.'] },
]

// Anything matching these skips self-help and goes straight to the desk.
export const RISKY = ['phishing', 'hacked', 'hack', 'virus', 'malware', 'ransomware', 'suspicious', 'stolen', 'lost laptop', 'lost my laptop', 'data loss', 'deleted all', 'breach', 'clicked a link']

export const isRisky = (t) => RISKY.some((k) => t.toLowerCase().includes(k))
export const matchIssue = (t) => {
  const s = t.toLowerCase()
  return KB.find((i) => i.keywords.some((k) => s.includes(k))) || null
}

const mk = (id, text, category, priority, status, ago) => ({
  id, text, status, created: Date.now() - ago * 3600000,
  triage: { title: text, category, priority, reasoning: 'Sample data', tried: [], missing: [], reply: '' },
})
export const SAMPLE_TICKETS = [
  mk('INC-1001', 'VPN drops every 10 minutes', 'Network', 'Medium', 'Open', 5),
  mk('INC-1002', 'Teams crashing on startup', 'Software', 'Medium', 'In Progress', 9),
  mk('INC-1003', 'Clicked a link in a suspicious email', 'Security', 'Critical', 'Resolved', 20),
  mk('INC-1004', 'Printer on floor 3 offline', 'Hardware', 'Low', 'Open', 30),
  mk('INC-1005', 'VPN not connecting from home', 'Network', 'Medium', 'Resolved', 40),
]
export const SAMPLE_AVOIDED = ['VPN not connecting', 'Password or account locked', 'Wi-Fi problems', 'Printer not working', 'Teams or Outlook issues', 'Password or account locked', 'VPN not connecting', 'Slow laptop', 'Password or account locked', 'VPN not connecting']
  .map((issue, i) => ({ issue, ts: Date.now() - i * 7200000 }))
