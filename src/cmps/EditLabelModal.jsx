import React, { useState } from 'react'

export function EditLabelModal({ label, position, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(label?.title || '')
  const [selectedColor, setSelectedColor] = useState(label?.color || '#61BD4F')

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

  const handleSave = () => {
    onSave({
      ...label,
      title: title.trim(),
      color: selectedColor,
    })
    onClose()
  }

  const handleDelete = () => {
    onDelete(label.id)
    onClose()
  }

  return (
    <div className="edit-label-modal-overlay" onClick={onClose}>
      <div
        className="edit-label-modal"
        onClick={(e) => e.stopPropagation()}
        style={
          position
            ? {
                position: 'absolute',
                top: position.y,
                left: position.x,
                transform: 'none',
              }
            : {}
        }
      >
        <div className="edit-label-modal-header">
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
          <span>Edit label</span>
          <button className="edit-modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="edit-label-content">
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
                  className={`color-option ${
                    selectedColor === color ? 'selected' : ''
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

          {/* Action Buttons */}
          <div className="edit-label-actions">
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
