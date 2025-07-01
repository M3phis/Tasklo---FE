import { useState, useEffect } from 'react'
import { uploadService } from '../services/upload.service'

export function ChangeBackgroundModal({
  isOpen,
  onClose,
  onBack,
  board,
  onUpdateBoard,
}) {
  const [showPhotosModal, setShowPhotosModal] = useState(false)
  const [showColorsModal, setShowColorsModal] = useState(false)
  const [customImages, setCustomImages] = useState([])
  const [isUploading, setIsUploading] = useState(false)

  // Load custom images from localStorage on component mount
  useEffect(() => {
    const savedCustomImages = localStorage.getItem('tasklo-custom-backgrounds')
    if (savedCustomImages) {
      try {
        const parsedImages = JSON.parse(savedCustomImages)
        setCustomImages(parsedImages)
      } catch (err) {
        console.error('Failed to parse saved custom images:', err)
      }
    }
  }, [])

  // Save custom images to localStorage whenever customImages changes
  useEffect(() => {
    if (customImages.length > 0) {
      localStorage.setItem(
        'tasklo-custom-backgrounds',
        JSON.stringify(customImages)
      )
    }
  }, [customImages])

  if (!isOpen) return null

  function handleBackdropClick(ev) {
    if (ev.target === ev.currentTarget) {
      onClose()
    }
  }

  function handlePhotosClick() {
    setShowPhotosModal(true)
  }

  function handleColorsClick() {
    setShowColorsModal(true)
  }

  function handlePhotosModalClose() {
    setShowPhotosModal(false)
  }

  function handleColorsModalClose() {
    setShowColorsModal(false)
  }

  async function handleCustomUpload() {
    try {
      setIsUploading(true)
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'

      input.onchange = async (ev) => {
        const file = ev.target.files[0]
        if (!file) return

        try {
          const uploadedUrl = await uploadService.uploadFile(file)
          const newCustomImages = [...customImages, uploadedUrl.url]
          setCustomImages(newCustomImages)

          // Automatically apply the uploaded image as background
          handlePhotoSelect(uploadedUrl.url)
        } catch (err) {
          console.error('Upload failed:', err)
        } finally {
          setIsUploading(false)
        }
      }

      input.click()
    } catch (err) {
      console.error('Upload error:', err)
      setIsUploading(false)
    }
  }

  const photos = [
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzNDk0MTd8MHwxfHNlYXJjaHw4fHxjb2RlfGVufDB8fHx8MTY2Njc4NTMwMA&ixlib=rb-4.0.3&q=80',
    'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1169&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1171&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1169&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1171&q=80',
  ]

  const colors = [
    '#0079bf',
    '#d29034',
    '#519839',
    '#b04632',
    '#89609e',
    '#cd5a91',
    '#4bbf6b',
    '#00aecc',
    '#838c91',
  ]

  function handlePhotoSelect(photoUrl) {
    const updatedBoard = {
      ...board,
      style: {
        ...board.style,
        background: photoUrl,
        color: null,
      },
    }
    onUpdateBoard(updatedBoard)
  }

  function handleColorSelect(color) {
    const updatedBoard = {
      ...board,
      style: {
        ...board.style,
        color: color,
        background: null,
      },
    }
    onUpdateBoard(updatedBoard)
  }

  return (
    <div className="change-background-overlay" onClick={handleBackdropClick}>
      <div className="change-background-modal">
        <div className="change-background-header">
          <button className="back-btn" onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </button>
          <h3>Change background</h3>
          <button className="change-background-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="background-tabs">
          <div className="tab-group">
            <button className="tab-btn photos-btn" onClick={handlePhotosClick}>
              <div className="tab-preview photos-preview">
                <div className="photo-grid">
                  <div
                    className="photo-item"
                    style={{
                      backgroundImage:
                        'url(https://images.unsplash.com/photo-1515879218367-8466d910aaa4?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzNDk0MTd8MHwxfHNlYXJjaHw4fHxjb2RlfGVufDB8fHx8MTY2Njc4NTMwMA&ixlib=rb-4.0.3&q=80)',
                    }}
                  ></div>
                  <div
                    className="photo-item"
                    style={{
                      backgroundImage:
                        'url(https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80)',
                    }}
                  ></div>
                  <div
                    className="photo-item"
                    style={{
                      backgroundImage:
                        'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1169&q=80)',
                    }}
                  ></div>
                  <div
                    className="photo-item"
                    style={{
                      backgroundImage:
                        'url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1171&q=80)',
                    }}
                  ></div>
                </div>
              </div>
            </button>
            <span className="tab-label">Photos</span>
          </div>

          <div className="tab-group">
            <button className="tab-btn colors-btn" onClick={handleColorsClick}>
              <div className="tab-preview colors-preview">
                <div className="color-row">
                  <div
                    className="color-item"
                    style={{ backgroundColor: '#c377e0' }}
                  ></div>
                  <div
                    className="color-item"
                    style={{ backgroundColor: '#eb5a46' }}
                  ></div>
                </div>
              </div>
            </button>
            <span className="tab-label">Colors</span>
          </div>
        </div>

        <div className="custom-section">
          <h4>Custom</h4>
          <div className="custom-group">
            <button
              className="custom-btn"
              onClick={handleCustomUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <div className="upload-spinner">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        dur="1s"
                        repeatCount="indefinite"
                        values="0 12 12;360 12 12"
                      />
                    </path>
                  </svg>
                </div>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
              )}
            </button>

            {customImages.map((imageUrl, index) => (
              <div
                key={index}
                className="custom-image"
                style={{ backgroundImage: `url(${imageUrl})` }}
                onClick={() => handlePhotoSelect(imageUrl)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Photos Modal */}
      {showPhotosModal && (
        <div
          className="change-background-overlay"
          onClick={handlePhotosModalClose}
        >
          <div className="change-background-modal">
            <div className="change-background-header">
              <button className="back-btn" onClick={handlePhotosModalClose}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
              </button>
              <h3>Photos</h3>
              <button className="close-btn" onClick={onClose}>
                ×
              </button>
            </div>
            <div className="background-content">
              <div className="photos-grid">
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    className="photo-option"
                    style={{ backgroundImage: `url(${photo})` }}
                    onClick={() => handlePhotoSelect(photo)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Colors Modal */}
      {showColorsModal && (
        <div
          className="change-background-overlay"
          onClick={handleColorsModalClose}
        >
          <div className="change-background-modal">
            <div className="change-background-header">
              <button className="back-btn" onClick={handleColorsModalClose}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
              </button>
              <h3>Colors</h3>
              <button className="close-btn" onClick={onClose}>
                ×
              </button>
            </div>
            <div className="background-content">
              <div className="colors-grid">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="color-option"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
