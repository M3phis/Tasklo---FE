import { useEffect, useRef, useState } from 'react'

export const AddChecklistModal = ({ onClose, onAddChecklist, position }) => {
  const modalRef = useRef(null)
  const [title, setTitle] = useState('Checklist')

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const handleAdd = () => {
    if (!title.trim()) return

    // Generate a unique ID for the checklist
    const checklistId = Math.random().toString(36).substr(2, 9)

    const newChecklist = {
      id: checklistId,
      title: title.trim(),
      todos: [],
    }

    onAddChecklist(newChecklist)
    onClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  return (
    <div className="add-checklist-modal-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="add-checklist-modal positioned"
        onClick={(e) => e.stopPropagation()}
        style={{
          '--modal-top': `${position?.y || 0}px`,
          '--modal-left': `${position?.x || 0}px`,
        }}
      >
        <div className="add-checklist-modal-header">
          <span>Add checklist</span>
          <button className="add-checklist-modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="add-checklist-modal-content">
          <div className="title-section">
            <label htmlFor="checklist-title">Title</label>
            <input
              id="checklist-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="title-input"
              autoFocus
            />
          </div>

          <button className="add-checklist-btn" onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
