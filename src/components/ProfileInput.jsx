import { useState, useRef, useEffect } from 'react'

export default function ProfileInput({ value, onChange, recentProfiles }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = recentProfiles.filter(p =>
    p.toLowerCase().includes((value || '').toLowerCase())
  )

  return (
    <div className="profile-input" ref={ref}>
      <div className="profile-field">
        <input
          type="text"
          className="input"
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="e.g. dt-dev"
          autoComplete="off"
          spellCheck={false}
        />
        {recentProfiles.length > 0 && (
          <button
            type="button"
            className="profile-chevron"
            onClick={() => setOpen(o => !o)}
            tabIndex={-1}
            aria-label="Show recent profiles"
          >
            ▾
          </button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <ul className="profile-dropdown">
          <li className="profile-dropdown-header">Recently used</li>
          {filtered.map(p => (
            <li
              key={p}
              className="profile-option"
              onMouseDown={e => { e.preventDefault(); onChange(p); setOpen(false) }}
            >
              {p}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
