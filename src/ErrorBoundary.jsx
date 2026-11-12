import { Component } from 'react'

// Shows the real error on screen instead of a blank page.
export default class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h2>Something went wrong</h2>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{String(this.state.error?.stack || this.state.error)}</pre>
        <button onClick={() => { localStorage.clear(); location.reload() }}>Clear saved data and reload</button>
      </div>
    )
  }
}
