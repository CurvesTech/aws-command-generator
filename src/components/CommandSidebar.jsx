export default function CommandSidebar({ commands, selectedId, onSelect }) {
  const categories = [...new Set(commands.map(c => c.category))]

  return (
    <aside className="sidebar">
      {categories.map(cat => (
        <div key={cat} className="sidebar-group">
          <div className="sidebar-category">{cat}</div>
          {commands
            .filter(c => c.category === cat)
            .map(cmd => (
              <button
                key={cmd.id}
                className={`sidebar-item ${selectedId === cmd.id ? 'active' : ''}`}
                onClick={() => onSelect(cmd.id)}
              >
                {cmd.name}
              </button>
            ))}
        </div>
      ))}
    </aside>
  )
}
