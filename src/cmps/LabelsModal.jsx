import React, { useState } from 'react'

export function LabelsModal({
  labels = [],
  taskLabelIds = [],
  onClose,
  onToggleLabel,
}) {
  const [search, setSearch] = useState('')

  const filteredLabels = labels

  return (
    <div className="labels-modal-overlay" onClick={onClose}>
      <div className="labels-modal" onClick={(e) => e.stopPropagation()}>
        <div className="labels-modal-header">
          <span>Labels</span>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="labels-list">
          {filteredLabels.map((label) => (
            <div key={label.id} className="label-row">
              <input
                type="checkbox"
                checked={taskLabelIds.includes(label.id)}
                onChange={() => onToggleLabel(label.id)}
              />
              <span
                className="label-color"
                style={{ background: label.color }}
                title={label.title}
              ></span>
              <button className="edit-label-btn" title="Edit label">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path
                    d="M12.3 2.3a1 1 0 0 1 1.4 1.4l-8 8a1 1 0 0 1-.4.2l-2 0.5a0.25 0.25 0 0 1-.3-0.3l0.5-2a1 1 0 0 1 .2-0.4l8-8z"
                    stroke="#5E6C84"
                    strokeWidth="1.2"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button className="create-label-btn">Create a new label</button>
        <button className="colorblind-btn">
          Enable colorblind friendly mode
        </button>
      </div>
    </div>
  )
}
