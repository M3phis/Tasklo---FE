import { useRef, useEffect } from 'react'
import CrossIcon from '@atlaskit/icon/glyph/cross'

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
        { name: 'Green', value: '#4caf50' },
        { name: 'Yellow', value: '#ffc107' },
        { name: 'Orange', value: '#ff9800' },
        { name: 'Red', value: '#f44336' },
        { name: 'Purple', value: '#9c27b0' },
        { name: 'Blue', value: '#2196f3' },
        { name: 'Sky', value: '#00bcd4' },
        { name: 'Lime', value: '#8bc34a' },
        { name: 'Pink', value: '#e91e63' },
        { name: 'Gray', value: '#607d8b' }
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
            <div className="group-list-menu-header">
                <span className="group-list-menu-title">List actions</span>
                <button onClick={onClose} className="group-list-close-button"><CrossIcon label="" primaryColor="#626F86" /></button>
            </div>

            <div className="group-list-menu-content">
                <button
                    onClick={() => {
                        onAddCard()
                        onClose()
                    }}
                    className="group-list-menu-button"
                >
                    Add card
                </button>

                <button className="group-list-menu-button-list-color">Change list color</button>

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
                        className="remove-color-button"> <CrossIcon label="" primaryColor="#172B4D" />Remove color</button>
                </div>

                <button
                    onClick={() => {
                        onDeleteList()
                        onClose()
                    }}
                    className="group-list-menu-button"
                >
                    Delete this list
                </button>
            </div>
        </div>
    )
}