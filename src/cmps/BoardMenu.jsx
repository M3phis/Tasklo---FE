import { useState } from 'react'
import { ChangeBackgroundModal } from './ChangeBackgroundModal'

export function BoardMenu({ isOpen, onClose, board, onUpdateBoard, onReopen }) {
  const [showAboutBoard, setShowAboutBoard] = useState(false)
  const [showChangeBackground, setShowChangeBackground] = useState(false)

  if (!isOpen && !showChangeBackground) return null

  function handleBackdropClick(ev) {
    if (ev.target === ev.currentTarget) {
      onClose()
    }
  }

  function handleToggleStar(ev) {
    ev.stopPropagation()
    ev.preventDefault()

    const updatedBoard = { ...board, isStarred: !board.isStarred }

    if (onUpdateBoard) {
      onUpdateBoard(updatedBoard)
    }
  }

  function handleMenuItemClick(action) {
    console.log('Menu action:', action)
    // Add specific handlers for each menu item
  }

  function handleChangeBackgroundClick() {
    setShowChangeBackground(true)
    onClose() // Close the side menu
  }

  function handleBackgroundModalClose() {
    setShowChangeBackground(false)
  }

  function handleBackToMenu() {
    setShowChangeBackground(false)
    if (onReopen) {
      onReopen()
    }
  }

  return (
    <>
      {isOpen && !showChangeBackground && (
        <div className="board-menu-overlay" onClick={handleBackdropClick}>
          <div className="board-menu">
            <div className="board-menu-header">
              <h3>Menu</h3>
              <button className="close-btn" onClick={onClose}>
                ×
              </button>
            </div>

            <div className="board-menu-content">
              {/* Share Section */}
              <div className="menu-item share-item">
                <div className="menu-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z" />
                  </svg>
                </div>
                <div className="menu-text">
                  <div className="menu-title">Share</div>
                </div>
                <div className="menu-avatars">
                  {board?.members?.slice(0, 4).map((member, idx) => (
                    <div key={member.id || idx} className="mini-avatar">
                      {member.imgUrl ? (
                        <img src={member.imgUrl} alt={member.fullname} />
                      ) : (
                        member.fullname?.charAt(0)?.toUpperCase() || 'U'
                      )}
                    </div>
                  ))}
                  {board?.members?.length > 4 && (
                    <div className="mini-avatar more">
                      +{board.members.length - 4}
                    </div>
                  )}
                </div>
              </div>

              {/* About this board */}
              <div className="menu-item">
                <div className="menu-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                </div>
                <div className="menu-text">
                  <div className="menu-title">About this board</div>
                  <div className="menu-subtitle">
                    Add a description to your board
                  </div>
                </div>
              </div>

              {/* Visibility */}
              <div className="menu-item">
                <div className="menu-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                </div>
                <div className="menu-text">
                  <div className="menu-title">Visibility: Workspace</div>
                </div>
              </div>

              {/* Print, export, and share */}
              <div className="menu-item">
                <div className="menu-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
                  </svg>
                </div>
                <div className="menu-text">
                  <div className="menu-title">Print, export, and share</div>
                </div>
              </div>

              {/* Star */}
              <div className="menu-item" onClick={handleToggleStar}>
                <div className="menu-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ color: board?.isStarred ? '#f2d600' : '#42526e' }}
                  >
                    {board?.isStarred ? (
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    ) : (
                      <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
                    )}
                  </svg>
                </div>
                <div className="menu-text">
                  <div className="menu-title">
                    {board?.isStarred ? 'Unstar' : 'Star'}
                  </div>
                </div>
              </div>

              <div className="menu-divider"></div>

              {/* Settings */}
              <div className="menu-item">
                <div className="menu-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
                  </svg>
                </div>
                <div className="menu-text">
                  <div className="menu-title">Settings</div>
                </div>
              </div>

              {/* Change background */}
              <div className="menu-item" onClick={handleChangeBackgroundClick}>
                <div className="menu-icon change-bg">
                  <div className="bg-preview"></div>
                </div>
                <div className="menu-text">
                  <div className="menu-title">Change background</div>
                </div>
              </div>

              {/* Custom Fields */}
              <div className="menu-item">
                <div className="menu-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                  </svg>
                </div>
                <div className="menu-text">
                  <div className="menu-title">Custom Fields</div>
                </div>
              </div>

              <div className="menu-divider"></div>

              {/* Leave board */}
              <div className="menu-item danger">
                <div className="menu-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17,7L15.59,8.41L18.17,11H8V13H18.17L15.59,15.58L17,17L22,12L17,7M4,5H12V3H4C2.89,3 2,3.89 2,5V19A2,2 0 0,0 4,21H12V19H4V5Z" />
                  </svg>
                </div>
                <div className="menu-text">
                  <div className="menu-title">Leave board</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ChangeBackgroundModal
        isOpen={showChangeBackground}
        onClose={handleBackgroundModalClose}
        onBack={handleBackToMenu}
        board={board}
        onUpdateBoard={onUpdateBoard}
      />
    </>
  )
}
