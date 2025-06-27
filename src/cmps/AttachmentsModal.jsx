import { useEffect, useRef, useState } from 'react'
import {
  uploadService,
  validateFile,
  formatFileSize,
} from '../services/upload.service.js'

export const AttachmentsModal = ({
  onClose,
  task,
  position,
  onAddAttachment,
}) => {
  const modalRef = useRef(null)
  const fileInputRef = useRef(null)
  const [linkUrl, setLinkUrl] = useState('')
  const [displayText, setDisplayText] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [uploadError, setUploadError] = useState('')

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
    if (!linkUrl.trim()) return

    const newAttachment = {
      id: Date.now().toString(),
      type: 'link',
      url: linkUrl.trim(),
      title: displayText.trim() || linkUrl.trim(),
      createdAt: Date.now(),
    }

    console.log('Insert attachment:', newAttachment)

    // Call the callback to add the attachment
    if (onAddAttachment) {
      onAddAttachment(newAttachment)
    }

    onClose()
  }

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadError('')
    setUploadProgress(0)

    try {
      const fileArray = Array.from(files)

      // Validate files
      for (const file of fileArray) {
        validateFile(file, 10) // 10MB limit
      }

      // Upload files
      const uploadedFiles = await uploadService.uploadMultipleFiles(fileArray, {
        folder: 'tasklo/attachments',
        tags: [`task_${task.id}`, 'attachment'],
      })

      // Create attachment objects
      const attachments = uploadedFiles.map((file) => ({
        id: file.id,
        type: file.type,
        url: file.url,
        title: file.originalName,
        size: file.size,
        mimeType: file.mimeType,
        width: file.width,
        height: file.height,
        createdAt: file.createdAt,
      }))

      // Add all attachments
      for (const attachment of attachments) {
        if (onAddAttachment) {
          onAddAttachment(attachment)
        }
      }

      onClose()
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(error.message)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleChooseFile = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event) => {
    const files = event.target.files
    if (files) {
      handleFileUpload(files)
    }
  }

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
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
          <div
            className={`file-upload-section ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <h3>Attach a file from your computer</h3>
            <p className="upload-description">
              You can also drag and drop files to upload them.
            </p>

            {isUploading ? (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <span>Uploading...</span>
              </div>
            ) : (
              <button
                className="choose-file-btn"
                onClick={handleChooseFile}
                disabled={isUploading}
              >
                Choose a file
              </button>
            )}

            {uploadError && (
              <div className="upload-error">
                <span className="error-text">{uploadError}</span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar"
            />
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
              disabled={isUploading}
            />

            <h3>Display text (optional)</h3>
            <input
              type="text"
              placeholder="Text to display"
              value={displayText}
              onChange={(e) => setDisplayText(e.target.value)}
              className="display-text-input"
              disabled={isUploading}
            />
          </div>

          <div className="modal-actions">
            <button
              className="cancel-btn"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              className="insert-btn"
              onClick={handleInsert}
              disabled={!linkUrl.trim() || isUploading}
            >
              Insert
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
