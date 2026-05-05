import { useState, useEffect } from 'react'
import ProfileInput from './ProfileInput.jsx'

function getInitialValues(command) {
  const values = {}
  for (const field of command.fields) {
    if (field.type === 'checkbox') values[field.id] = field.default ?? false
    else if (field.type === 'select') values[field.id] = field.default ?? field.options[0].value
    else values[field.id] = field.default ?? ''
  }
  return values
}

function buildPreview(command, values) {
  const preview = {}
  for (const field of command.fields) {
    if (field.type === 'checkbox') {
      preview[field.id] = values[field.id] ?? false
    } else {
      preview[field.id] = values[field.id] || (field.required ? `<${field.label}>` : '')
    }
  }
  return command.generate(preview)
}

function isReady(command, values) {
  return command.fields
    .filter(f => f.required && f.type !== 'checkbox')
    .every(f => values[f.id] && values[f.id].trim() !== '')
}

function tokenize(cmd) {
  const parts = []
  const re = /"[^"]*"|'[^']*'|--[\w-]+|\||\S+/g
  let lastIndex = 0
  let m
  while ((m = re.exec(cmd)) !== null) {
    if (m.index > lastIndex) parts.push({ type: 'ws', text: cmd.slice(lastIndex, m.index) })
    parts.push({ type: 'token', text: m[0] })
    lastIndex = m.index + m[0].length
  }
  if (lastIndex < cmd.length) parts.push({ type: 'ws', text: cmd.slice(lastIndex) })
  return parts
}

function classifyTokens(parts) {
  let cmdSeen = false, subcmdCount = 0, prevWasFlag = false
  return parts.map(part => {
    if (part.type === 'ws') return { ...part, cls: null }
    const { text } = part
    let cls
    const isPlaceholder = /^"?<[^>]+>"?$/.test(text)
    if (isPlaceholder) {
      prevWasFlag = false; cls = 'sh-placeholder'
    } else if (text === '|') {
      cmdSeen = false; subcmdCount = 0; prevWasFlag = false; cls = 'sh-pipe'
    } else if (!cmdSeen) {
      cmdSeen = true; subcmdCount = 0; prevWasFlag = false; cls = 'sh-cmd'
    } else if (text.startsWith('--')) {
      prevWasFlag = true; cls = 'sh-flag'
    } else if (text.startsWith('"') || text.startsWith("'")) {
      prevWasFlag = false; cls = 'sh-string'
    } else if (prevWasFlag) {
      prevWasFlag = false; cls = 'sh-value'
    } else if (subcmdCount < 2) {
      subcmdCount++; cls = 'sh-subcmd'
    } else {
      prevWasFlag = false; cls = 'sh-arg'
    }
    return { ...part, cls }
  })
}

function SyntaxHighlight({ cmd }) {
  return (
    <>
      {classifyTokens(tokenize(cmd)).map((part, i) =>
        part.cls
          ? <span key={i} className={part.cls}>{part.text}</span>
          : <span key={i}>{part.text}</span>
      )}
    </>
  )
}

export default function CommandForm({ command, profiles, onProfileUsed }) {
  const [values, setValues] = useState(() => getInitialValues(command))
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setValues(getInitialValues(command))
    setCopied(false)
  }, [command.id])

  const preview = buildPreview(command, values)
  const ready = isReady(command, values)
  const set = (id, val) => setValues(prev => ({ ...prev, [id]: val }))

  const handleCopy = async () => {
    if (!ready) return
    await navigator.clipboard.writeText(preview)
    const profileField = command.fields.find(f => f.type === 'profile')
    if (profileField && values[profileField.id]) onProfileUsed(values[profileField.id])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="command-form">
      <div className="form-header">
        <h2>{command.name}</h2>
        <p className="form-description">{command.description}</p>
      </div>

      <div className="form-fields">
        {command.fields.map(field => (
          <div key={field.id} className={`form-field ${field.type === 'checkbox' ? 'form-field--check' : ''}`}>
            {field.type !== 'checkbox' && (
              <label className="field-label">
                {field.label}
                {field.required && <span className="required"> *</span>}
              </label>
            )}

            {field.type === 'profile' && (
              <ProfileInput value={values[field.id]} onChange={val => set(field.id, val)} recentProfiles={profiles} />
            )}
            {field.type === 'text' && (
              <input type="text" className="input" value={values[field.id]}
                onChange={e => set(field.id, e.target.value)} placeholder={field.placeholder || ''} spellCheck={false} />
            )}
            {field.type === 'textarea' && (
              <textarea className="input textarea" value={values[field.id]}
                onChange={e => set(field.id, e.target.value)} placeholder={field.placeholder || ''} rows={3} spellCheck={false} />
            )}
            {field.type === 'select' && (
              <select className="input select" value={values[field.id]} onChange={e => set(field.id, e.target.value)}>
                {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            )}
            {field.type === 'checkbox' && (
              <label className="checkbox-label">
                <input type="checkbox" checked={values[field.id]} onChange={e => set(field.id, e.target.checked)} />
                <span>{field.label}</span>
              </label>
            )}
          </div>
        ))}
      </div>

      <div className="form-output">
        <div className="output-header">
          <span className="output-label">Generated command</span>
          {!ready && <span className="output-hint">Fill required fields to copy</span>}
        </div>

        <div className={`terminal-window ${!ready ? 'terminal-window--draft' : ''}`}>
          <div className="terminal-titlebar">
            <div className="terminal-dots">
              <span className="tdot tdot--red" />
              <span className="tdot tdot--yellow" />
              <span className="tdot tdot--green" />
            </div>
            <span className="terminal-label">bash</span>
          </div>
          <div className="terminal-body">
            <pre><code><span className="sh-prompt">$ </span><SyntaxHighlight cmd={preview} /></code></pre>
          </div>
        </div>

        <button className={`copy-btn ${copied ? 'copy-btn--copied' : ''}`} onClick={handleCopy} disabled={!ready}>
          {copied ? '✓  Copied!' : 'Copy to clipboard'}
        </button>
      </div>
    </div>
  )
}
