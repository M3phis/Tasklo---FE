import { useState, useEffect, useRef } from 'react'

export function CreateBoardPanel({ onClose, anchorRef, placement = 'bottom' }) {
  const [title, setTitle] = useState('')
  const [selectedBg, setSelectedBg] = useState('bg1')
  const [workspace, setWorkspace] = useState('Trello Workspace')
  const [visibility, setVisibility] = useState('Workspace')
  const panelRef = useRef()

  const backgroundImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=160&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=160&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=160&fit=crop',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=160&fit=crop',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&h=160&fit=crop',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=160&fit=crop',
  ]

  const backgroundColors = [
    '#B3D4FF',
    '#579DFF',
    '#1D7AFC',
    '#0747A6',
    '#6554C0',
    '#8777D9',
  ]

  useEffect(() => {
    if (anchorRef?.current && panelRef.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      const panel = panelRef.current
      const panelWidth = 320
      const screenWidth = window.innerWidth

      panel.style.position = 'fixed'
      panel.style.zIndex = 9999

      if (placement === 'right') {
        const top = rect.top
        const left = rect.right + 8
        panel.style.top = `${top}px`
        panel.style.left =
          left + panelWidth > screenWidth
            ? `${screenWidth - panelWidth - 16}px`
            : `${left}px`
      } else {
        const top = rect.bottom + 8
        const left =
          rect.left + panelWidth > screenWidth
            ? screenWidth - panelWidth - 16
            : rect.left
        panel.style.top = `${top}px`
        panel.style.left = `${left}px`
      }
    }
  }, [anchorRef, placement])

  function handleSubmit(ev) {
    ev.preventDefault()
    if (!title.trim()) return
    onClose()
  }

  return (
    <section className="create-board-panel" ref={panelRef}>
      <div className="panel-header">
        <h2>Create board</h2>
        <button onClick={onClose} className="close-btn">
          ✕
        </button>
      </div>

      <div className="preview-image">
        <img
          src={backgroundImages.includes(selectedBg) ? selectedBg : ''}
          style={{ backgroundColor: selectedBg }}
          alt="preview"
        />
      </div>

      <h4>Background</h4>
      <div className="background-options">
        {backgroundImages.map((bg) => (
          <div
            key={bg}
            className={`bg-option image ${selectedBg === bg ? 'selected' : ''}`}
            onClick={() => setSelectedBg(bg)}
            style={{ backgroundImage: `url(${bg})` }}
          />
        ))}
        {backgroundColors.map((color) => (
          <div
            key={color}
            className={`bg-option color ${
              selectedBg === color ? 'selected' : ''
            }`}
            onClick={() => setSelectedBg(color)}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="board-form">
        <label>
          Board title*
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Marketing board"
            required
            className={!title.trim() ? 'invalid' : ''}
          />
          {!title.trim() && (
            <span className="error-msg">🧠 Board title is required</span>
          )}
        </label>

        <label>
          Workspace
          <select
            value={workspace}
            onChange={(e) => setWorkspace(e.target.value)}
          >
            <option>Trello Workspace</option>
            <option>Personal Workspace</option>
          </select>
        </label>

        <label>
          Visibility
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option>Workspace</option>
            <option>Private</option>
            <option>Public</option>
          </select>
        </label>

        <p className="info-text">
          This Workspace has 3 boards remaining. Free Workspaces can only have
          10 open boards. For unlimited boards, upgrade your Workspace.
        </p>

        <button
          type="submit"
          className="create-board-btn"
          disabled={!title.trim()}
        >
          Create
        </button>
      </form>
    </section>
  )
}
