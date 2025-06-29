import { useState, useEffect, useRef } from 'react'

export function CoverModal({
  task,
  position,
  onClose,
  onUpdateCover,
  onRemoveCover,
  // triggerButtonRef = null
}) {
  const [selectedCoverType, setSelectedCoverType] = useState(
    task?.style?.coverSize || 'full'
  ) // 'full' or 'centered'
  const [selectedColor, setSelectedColor] = useState(
    task?.style?.backgroundColor || null
  )
  const [selectedPhoto, setSelectedPhoto] = useState(
    task?.style?.background || task?.style?.backgroundImage || null
  )
  const modalRef = useRef(null)

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     const isOutsideModal = modalRef.current && !modalRef.current.contains(event.target)
  //     const isOnTriggerButton = triggerButtonRef?.current && triggerButtonRef.current.contains(event.target)

  //     if (isOutsideModal && !isOnTriggerButton) {
  //       onClose()
  //     }
  //   }

  //   const timer = setTimeout(() => {
  //     document.addEventListener('click', handleClickOutside)
  //   }, 50)

  //   return () => {
  //     clearTimeout(timer)
  //     document.removeEventListener('click', handleClickOutside)
  //   }
  // }, [onClose, triggerButtonRef])

  const handleColorSelect = (color) => {
    setSelectedColor(color)
    setSelectedPhoto(null) // Clear photo selection when color is selected
    if (onUpdateCover) {
      onUpdateCover({
        type: 'color',
        value: color,
        size: selectedCoverType,
      })
    }
  }

  const handlePhotoSelect = (photoUrl) => {
    setSelectedPhoto(photoUrl)
    setSelectedColor(null) // Clear color selection when photo is selected
    if (onUpdateCover) {
      onUpdateCover({
        type: 'photo',
        value: photoUrl,
        size: selectedCoverType,
      })
    }
  }

  const handleSizeChange = (newSize) => {
    setSelectedCoverType(newSize)
    // If there's already a selected cover, update it with the new size
    if (selectedColor) {
      onUpdateCover({
        type: 'color',
        value: selectedColor,
        size: newSize,
      })
    } else if (selectedPhoto) {
      onUpdateCover({
        type: 'photo',
        value: selectedPhoto,
        size: newSize,
      })
    }
  }

  const handleRemoveCover = () => {
    if (onRemoveCover) {
      onRemoveCover()
    }
  }

  const handleUploadImage = () => {
    // TODO: Implement file upload functionality
    console.log('Upload image clicked')
  }

  return (
    <div
      ref={modalRef}
      className="cover-modal"
      style={{
        position: 'fixed',
        left: position?.x,
        top: position?.y,
        zIndex: 1000,
      }}
    >
      <div className="cover-modal-content">
        {/* Header */}
        <div className="cover-modal-header">
          <h3 className="cover-modal-title">Cover</h3>
          <button className="cover-modal-close-btn" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M13.5 1.5L1.5 13.5M1.5 1.5l12 12"
                stroke="#6b778c"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Size Section */}
        <div className="cover-modal-section">
          <h4 className="cover-modal-section-title">Size</h4>
          <div className="cover-size-options">
            <div
              className={`cover-size-option ${selectedCoverType === 'full' ? 'selected' : ''
                }`}
              onClick={() => handleSizeChange('full')}
            >
              <div className="size-preview-full"></div>
            </div>
            <div
              className={`cover-size-option ${selectedCoverType === 'centered' ? 'selected' : ''
                }`}
              onClick={() => handleSizeChange('centered')}
            >
              <div className="size-preview-centered"></div>
            </div>
          </div>
        </div>

        {/* Remove Cover Button */}
        <button className="cover-modal-btn" onClick={handleRemoveCover}>
          Remove cover
        </button>

        {/* Colors Section */}
        <div className="cover-modal-section">
          <h4 className="cover-modal-section-title">Colors</h4>
          <div className="cover-colors-grid">
            {[
              '#4BCE97',
              '#F5CD47',
              '#FEA362',
              '#FF8A85',
              '#9F8FEF',
              '#579DFF',
              '#60C6D2',
              '#94C748',
              '#E774BB',
              '#8590A2',
            ].map((color, index) => (
              <div
                key={index}
                className={`cover-color-option ${selectedColor === color ? 'selected' : ''
                  }`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
              />
            ))}
          </div>
        </div>

        {/* Border */}
        <div className="cover-modal-divider"></div>

        {/* Attachments Section */}
        <div className="cover-modal-section">
          <h4 className="cover-modal-section-title">Attachments</h4>
          <button className="cover-modal-btn" onClick={handleUploadImage}>
            Upload a cover image
          </button>
          <p className="cover-modal-tip">
            Tip: Drag an image on to the card to upload it.
          </p>
        </div>

        {/* Photos from Unsplash */}
        <div className="cover-modal-section">
          <h4 className="cover-modal-section-title">Photos from Unsplash</h4>
          <div className="cover-photos-grid">
            {[
              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=160&fit=crop',
              'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=160&fit=crop',
              'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=160&fit=crop',
              'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=160&fit=crop',
              'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&h=160&fit=crop',
              'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=160&fit=crop',
            ].map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Unsplash ${index + 1}`}
                className={`cover-photo-option ${selectedPhoto === src ? 'selected' : ''
                  }`}
                onClick={() => handlePhotoSelect(src)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
