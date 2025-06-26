import React, { useState } from 'react'
import { EditLabelModal } from './EditLabelModal'
import { CreateLabelModal } from './CreateLabelModal'

export function LabelsModal({
  labels = [],
  taskLabelIds = [],
  position,
  onClose,
  onToggleLabel,
  onSaveLabel,
  onDeleteLabel,
  onCreateLabel,
}) {
  const [search, setSearch] = useState('')
  const [editingLabel, setEditingLabel] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredLabels = labels.filter((label) =>
    label.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleEditLabel = (label) => {
    setEditingLabel(label)
  }

  const handleCloseEdit = () => {
    setEditingLabel(null)
  }

  const handleCreateLabel = () => {
    setShowCreateModal(true)
  }

  const handleCloseCreate = () => {
    setShowCreateModal(false)
  }

  return (
    <>
      <div className="labels-modal-overlay" onClick={onClose}>
        <div
          className="labels-modal"
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
          <div className="labels-modal-header">
            <span>Labels</span>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>

          <input
            className="labels-search"
            type="text"
            placeholder="Search labels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="labels-section">
            <span className="labels-section-title">Labels</span>
          </div>

          <div className="labels-list">
            {filteredLabels.map((label) => (
              <div key={label.id} className="label-row">
                <input
                  type="checkbox"
                  checked={taskLabelIds.includes(label.id)}
                  onChange={() => onToggleLabel(label.id)}
                  className="label-checkbox"
                />
                <span
                  className="label-color"
                  style={{ background: label.color }}
                  title={label.title}
                >
                  {label.title}
                </span>
                <button
                  className="edit-label-btn"
                  title="Edit label"
                  onClick={() => handleEditLabel(label)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#5f6368"
                  >
                    <path d="M167-120q-21 5-36.5-10.5T120-167l40-191 198 198-191 40Zm191-40L160-358l458-458q23-23 57-23t57 23l84 84q23 23 23 57t-23 57L358-160Zm317-600L261-346l85 85 414-414-85-85Z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button className="create-label-btn" onClick={handleCreateLabel}>
            Create a new label
          </button>
        </div>
      </div>

      {editingLabel && (
        <EditLabelModal
          label={editingLabel}
          position={position}
          onClose={handleCloseEdit}
          onSave={onSaveLabel}
          onDelete={onDeleteLabel}
        />
      )}

      {showCreateModal && (
        <CreateLabelModal
          position={position}
          onClose={handleCloseCreate}
          onSave={onCreateLabel}
        />
      )}
    </>
  )
}
