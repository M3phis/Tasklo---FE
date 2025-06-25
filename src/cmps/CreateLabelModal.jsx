import React, { useState } from 'react'
import { utilService } from '../services/util.service'

export function CreateLabelModal({ position, onClose, onSave }) {
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
                transform: 'none',
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
