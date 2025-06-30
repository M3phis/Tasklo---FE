import React, { useState, useRef, useLayoutEffect } from 'react'
import { utilService } from '../services/util.service'

export function CreateLabelModal({ position, onClose, onSave }) {
  const modalRef = useRef(null)
  const [calculatedPosition, setCalculatedPosition] = useState({ x: 0, y: 0 })
  const [title, setTitle] = useState('')
  const [selectedColor, setSelectedColor] = useState('#61BD4F')

  // 5x6 color matrix (30 colors total)
  const colors = [
    '#61BD4F',
    '#F2D600',
    '#FFAB4A',
    '#EB5A46',
    '#C377E0',
    '#0079BF',
    '#00C2E0',
    '#51E898',
    '#FF78CB',
    '#344563',
    '#026AA7',
    '#4BBF6B',
    '#FFC642',
    '#D04437',
    '#89609E',
    '#B04632',
    '#D29034',
    '#519839',
    '#CD8DE5',
    '#8B4513',
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85929E',
  ]

  useLayoutEffect(() => {
    if (!position) return

    const modalHeight = 400 // Estimated height of create label modal
    const modalWidth = 304
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth
    const gap = 8

    let finalX = position.x
    let finalY = position.y

    // Calculate available space
    const spaceAbove = position.y - gap
    const spaceBelow = viewportHeight - position.y - gap

    // Smart vertical positioning
    if (spaceBelow >= modalHeight) {
      // Enough space below
      finalY = position.y
    } else if (spaceAbove >= modalHeight) {
      // Not enough space below but enough above
      finalY = position.y - modalHeight - gap
    } else {
      // Not enough space in either direction
      if (spaceAbove > spaceBelow) {
        // More space above - position at top of viewport
        finalY = gap
      } else {
        // More space below - position to fit as much as possible
        finalY = Math.max(gap, viewportHeight - modalHeight - gap)
      }
    }

    // Horizontal positioning
    if (finalX + modalWidth > viewportWidth) {
      finalX = Math.max(gap, viewportWidth - modalWidth - gap)
    }
    if (finalX < gap) {
      finalX = gap
    }

    setCalculatedPosition({ x: finalX, y: finalY })
  }, [position])

  const handleCreate = () => {
    const newLabel = {
      id: utilService.makeId(),
      title: title.trim() || 'New Label',
      color: selectedColor,
    }
    onSave(newLabel)
    onClose()
  }

  return (
    <div className="create-label-modal-overlay" onClick={onClose}>
      <div
        className="create-label-modal"
        onClick={(e) => e.stopPropagation()}
        style={
          position
            ? {
              position: 'absolute',
              top: position.y,
              left: position.x,
              transform: position.alignAbove ? 'translateY(-100%)' : 'none',
            }
            : {}
        }
      >
        <div className="create-label-modal-header">
          <button className="back-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 12L6 8L10 4"
                stroke="#5E6C84"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span>Create label</span>
          <button className="create-modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="create-label-content">
          {/* Label Preview */}
          <div className="label-preview">
            <span
              className="preview-label"
              style={{ backgroundColor: selectedColor }}
            >
              {title || 'Label preview'}
            </span>
          </div>

          {/* Title Input */}
          <div className="title-section">
            <label className="title-label">Title</label>
            <input
              type="text"
              className="title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter label title"
            />
          </div>

          {/* Color Selection */}
          <div className="color-section">
            <label className="color-label">Select a color</label>
            <div className="color-grid">
              {colors.map((color, index) => (
                <button
                  key={index}
                  className={`color-option ${selectedColor === color ? 'selected' : ''
                    }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Remove Color Button */}
          <button className="remove-color-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="#6B778C"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Remove color
          </button>

          {/* Create Button */}
          <div className="create-label-actions">
            <button className="create-btn" onClick={handleCreate}>
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
