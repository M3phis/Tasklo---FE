import { useRef, useEffect } from 'react'

export function GroupListMenu({
    isOpen,
    onClose,
    onAddCard,
    onDeleteList,
    onChangeColor,
    currentColor,
    triggerRef
}) {
    const menuRef = useRef(null)

    const colors = [
        { name: 'Green', value: '#8de066' },
        { name: 'Yellow', value: '#f7e44d' },
        { name: 'Orange', value: '#ffbb59' },
        { name: 'Red', value: '#f28b82' },
        { name: 'Purple', value: '#d7a3ef' },
        { name: 'Blue', value: '#4da8db' },
        { name: 'Sky', value: '#4dd8f0' },
        { name: 'Lime', value: '#7bedab' },
        { name: 'Pink', value: '#ff9ede' },
        { name: 'Gray', value: '#b3b3b3' }
    ]

    useEffect(() => {
        if (isOpen && menuRef.current && triggerRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect()
            menuRef.current.style.position = 'fixed'
            menuRef.current.style.top = `${triggerRect.bottom + 5}px`
            menuRef.current.style.left = `${triggerRect.left - 200 + triggerRect.width}px`
            menuRef.current.style.zIndex = '1000'
        }
    }, [isOpen, triggerRef])

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target) &&
                triggerRef.current && !triggerRef.current.contains(event.target)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose, triggerRef])

    if (!isOpen) return null

    return (
        <div ref={menuRef} className="group-list-menu">
            {/* Header */}
            <div className="menu-header">
                <span className="menu-title">List actions</span>
                <button
                    onClick={onClose}
                    className="close-button"
                >
                    ×
                </button>
            </div>

            {/* Main Menu */}
            <div className="menu-content">
                <button
                    onClick={() => {
                        onAddCard()
                        onClose()
                    }}
                    className="menu-button"
                >
                    Add card
                </button>

                <button
                    className="menu-button disabled"
                >
                    Change list color
                </button>

                <div className="color-picker">
                    <div className="color-grid">
                        {colors.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => {
                                    onChangeColor(color.value)
                                    onClose()
                                }}
                                className={`color-button ${currentColor === color.value ? 'selected' : ''}`}
                                style={{ backgroundColor: color.value }}
                                title={color.name}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            onChangeColor(null)
                            onClose()
                        }}
                        className="remove-color-button"
                    >
                        <span className="remove-icon">×</span>
                        Remove color
                    </button>
                </div>

                <button
                    onClick={() => {
                        onDeleteList()
                        onClose()
                    }}
                    className="menu-button"
                >
                    Delete this list
                </button>
            </div>
        </div>
    )
}