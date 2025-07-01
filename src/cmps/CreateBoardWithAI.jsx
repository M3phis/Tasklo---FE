import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { boardService } from '../services/board'
import { addBoard } from '../store/board.actions.js'

export function CreateBoardWithAI({
  onClose,
  anchorRef,
  placement = 'bottom',
}) {
  const [description, setDescription] = useState('')
  const [timeline, setTimeline] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const panelRef = useRef()
  const navigate = useNavigate()

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

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!description.trim()) return

    setIsLoading(true)

    try {
      const board = await boardService.createBoardWithAI({
        description,
        timeline,
      })

      const savedBoard = await addBoard(board)
      navigate(`/board/${savedBoard._id}`)
    } catch (err) {
      console.error('❌ Failed to create AI board:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="create-board-panel" ref={panelRef}>
      <div className="panel-header">
        <h2>Create with AI</h2>
        <button onClick={onClose} className="ai-board-modal-close-btn">
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="ai-board-form">
        <label>
          What is this board about?
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project or goal..."
            rows={3}
            required
          />
        </label>

        <label>
          Any deadline or timeline?
          <input
            type="text"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="e.g. By end of July / 2 weeks / No deadline"
          />
        </label>

        <button
          type="submit"
          className="create-board-btn"
          disabled={!description.trim() || isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Board'}
        </button>
      </form>
    </section>
  )
}
