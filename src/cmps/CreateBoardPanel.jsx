import { useState, useEffect, useRef } from 'react'
import { addBoard } from '../store/board.actions.js'
import { useSelector } from 'react-redux'

export function CreateBoardPanel({ onClose, anchorRef, placement = 'bottom' }) {
  const user = useSelector((storeState) => storeState.userModule.user)
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

  const [title, setTitle] = useState('')
  const [selectedBg, setSelectedBg] = useState(backgroundImages[0])
  const [workspace, setWorkspace] = useState('Trello Workspace')
  const [visibility, setVisibility] = useState('Workspace')
  const panelRef = useRef()

  useEffect(() => {
    if (anchorRef?.current && panelRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const panel = panelRef.current;
      const panelWidth = 320;
      const panelHeight = panel.offsetHeight;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      let top, left;

      // Responsive: On small screens, always open full width below trigger
      if (screenWidth < 600) {
        top = rect.bottom + 8;
        left = 8;
        panel.style.position = 'fixed';
        panel.style.width = `calc(100vw - 16px)`;
        panel.style.maxWidth = `95vw`;
        panel.style.top = `${top}px`;
        panel.style.left = `${left}px`;
        panel.style.zIndex = 9999;
        return;
      } else if (placement === 'right') {
        top = rect.top;
        left = rect.right + 8;
        if (left + panelWidth > screenWidth) {
          left = rect.left - panelWidth - 8;
          if (left < 8) left = screenWidth - panelWidth - 8;
        }
        if (top + panelHeight > screenHeight) {
          top = screenHeight - panelHeight - 8;
          if (top < 8) top = 8;
        }
        panel.style.width = `${panelWidth}px`;
        panel.style.maxWidth = `95vw`;
      } else {
        top = rect.bottom + 8;
        left = rect.left;
        if (left + panelWidth > screenWidth) {
          left = screenWidth - panelWidth - 16;
        }
        if (top + panelHeight > screenHeight) {
          top = screenHeight - panelHeight - 8;
          if (top < 8) top = 8;
        }
        panel.style.width = `${panelWidth}px`;
        panel.style.maxWidth = `95vw`;
      }

      panel.style.position = 'fixed';
      panel.style.zIndex = 9999;
      panel.style.top = `${top}px`;
      panel.style.left = `${left}px`;
    }
  }, [anchorRef, placement]);

  function createEmptyBoard(title, selectedBg) {
    const isImage = selectedBg && selectedBg.startsWith('http')
    const isColor = selectedBg && selectedBg.startsWith('#')
    return {
      title,
      createdAt: Date.now(),
      labels: [],
      createdBy: user ? {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        imgUrl: user.imgUrl
      } : null,
      members: user ? [{
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        imgUrl: user.imgUrl
      }] : [],
      groups: [],
      activities: [],
      isStarred: false,
      style: {
        background: isImage ? selectedBg : null,
        color: isColor ? selectedBg : null,
      },
    }
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!title.trim()) return

    try {
      const newBoard = createEmptyBoard(title, selectedBg)
      const savedBoard = await addBoard(newBoard)
      console.log('Created board:', savedBoard)
      onClose()
    } catch (err) {
      console.error('Failed to create board:', err)
    }
  }

  return (
    <section className="create-board-panel" ref={panelRef}>
      <div className="panel-header">
        <h2>Create board</h2>
        <button onClick={onClose} className="board-modal-close-btn">
          ✕
        </button>
      </div>

      <div className="preview-image">
        <img
          src={backgroundImages.includes(selectedBg) ? selectedBg : ''}
          style={{ backgroundColor: backgroundColors.includes(selectedBg) ? selectedBg : undefined }}
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
            className={`bg-option color ${selectedBg === color ? 'selected' : ''}`}
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

        <button type="submit" className="create-board-btn" disabled={!title.trim()}>
          Create
        </button>
      </form>
    </section>
  )
}
