import { useState } from 'react'
import { COMMANDS } from './commands.js'
import { useProfiles } from './useProfiles.js'
import CommandSidebar from './components/CommandSidebar.jsx'
import CommandForm from './components/CommandForm.jsx'

export default function App() {
  const [selectedId, setSelectedId] = useState(COMMANDS[0].id)
  const { profiles, addProfile } = useProfiles()

  const selected = COMMANDS.find(c => c.id === selectedId)

  return (
    <div className="app">
      <header className="app-header">
        <svg className="header-icon" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 18 L20 4 L32 18" stroke="#FF9900" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M2 22 L38 22" stroke="#FF9900" strokeWidth="4" strokeLinecap="round"/>
        </svg>
        <span className="header-title">AWS Command Generator</span>
      </header>

      <div className="app-body">
        <CommandSidebar
          commands={COMMANDS}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <main className="app-main">
          {selected && (
            <CommandForm
              key={selected.id}
              command={selected}
              profiles={profiles}
              onProfileUsed={addProfile}
            />
          )}
        </main>
      </div>
    </div>
  )
}
