import { useEffect, useRef, useState } from 'react'

export const AttachmentsModal = ({ onClose, task, position }) => {
  const modalRef = useRef(null)
  const [linkUrl, setLinkUrl] = useState('')
  const [displayText, setDisplayText] = useState('')

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

  const handleInsert = () => {
    // Handle insert logic here
    console.log('Insert attachment:', { linkUrl, displayText })
    onClose()
  }

  const handleChooseFile = () => {
    // Handle file selection logic here
    console.log('Choose file clicked')
  }

  return (
    <div className="attachments-modal-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className={`attachments-modal ${position ? 'positioned' : ''}`}
        onClick={(e) => e.stopPropagation()}
        style={
          position
            ? {
                '--modal-top': `${position.y}px`,
                '--modal-left': `${position.x}px`,
              }
            : {}
        }
      >
        <div className="attachments-modal-header">
          <div className="header-left">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="info-icon"
            >
              <circle
                cx="8"
                cy="8"
                r="7"
                stroke="#6b778c"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M8 7v4"
                stroke="#6b778c"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="8" cy="5" r="0.5" fill="#6b778c" />
            </svg>
          </div>
          <span>Attach</span>
          <button className="attachments-modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="attachments-modal-content">
          <div className="file-upload-section">
            <h3>Attach a file from your computer</h3>
            <p className="upload-description">
              You can also drag and drop files to upload them.
            </p>
            <button className="choose-file-btn" onClick={handleChooseFile}>
              Choose a file
            </button>
          </div>

          <div className="divider"></div>

          <div className="link-section">
            <h3>Search or paste a link</h3>
            <input
              type="text"
              placeholder="Find recent links or paste a new link"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="link-input"
            />

            <h3>Display text (optional)</h3>
            <input
              type="text"
              placeholder="Text to display"
              value={displayText}
              onChange={(e) => setDisplayText(e.target.value)}
              className="display-text-input"
            />
          </div>

          <div className="modal-actions">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="insert-btn" onClick={handleInsert}>
              Insert
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
