import { useEffect, useRef } from 'react'
import { FaRobot, FaTrello } from 'react-icons/fa'

export function CreateMenu({
  onCreateBoard,
  onCreateAI,
  anchorRef,
  placement = 'bottom',
}) {
  const menuRef = useRef()

  useEffect(() => {
    if (anchorRef?.current && menuRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      const menu = menuRef.current
      const menuWidth = 320
      const screenWidth = window.innerWidth

      menu.style.position = 'fixed'
      menu.style.zIndex = 9999

      const top = rect.bottom + 8
      let left = rect.left

      if (placement === 'right') {
        menu.style.top = `${rect.top}px`
        menu.style.left = `${rect.right + 8}px`
      } else {
        if (rect.left + menuWidth > screenWidth) {
          left = screenWidth - menuWidth - 16
        }
        menu.style.top = `${top}px`
        menu.style.left = `${left}px`
      }
    }
  }, [anchorRef, placement])

  return (
    <div className="create-menu" ref={menuRef}>
      <div className="menu-item" onClick={onCreateBoard}>
        <div className="menu-item-header">
          <FaTrello className="icon" />
          <h4>Create board</h4>
        </div>
        <p>
          A board is made up of cards ordered on lists. Use it to manage
          projects, track information, or organize anything.
        </p>
      </div>

      <div className="menu-item" onClick={onCreateAI}>
        <div className="menu-item-header">
          <FaRobot className="icon" />
          <h4>Create with AI</h4>
        </div>
        <p>Let AI generate a smart board based on your project description.</p>
      </div>
    </div>
  )
}
