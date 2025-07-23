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
      const rect = anchorRef.current.getBoundingClientRect();
      const menu = menuRef.current;
      const menuWidth = 320;
      const menuHeight = menu.offsetHeight;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      let top, left;

      if (placement === 'right') {
        top = rect.top;
        left = rect.right + 8;

        // If menu would overflow right, align to left of trigger
        if (left + menuWidth > screenWidth) {
          left = rect.left - menuWidth - 8;
          // If still off-screen, clamp to right edge
          if (left < 8) left = screenWidth - menuWidth - 8;
        }
        // If menu would overflow bottom, clamp
        if (top + menuHeight > screenHeight) {
          top = screenHeight - menuHeight - 8;
          if (top < 8) top = 8;
        }
      } else {
        top = rect.bottom + 8;
        left = rect.left;
        if (left + menuWidth > screenWidth) {
          left = screenWidth - menuWidth - 16;
        }
        if (top + menuHeight > screenHeight) {
          top = screenHeight - menuHeight - 8;
          if (top < 8) top = 8;
        }
      }

      menu.style.position = 'fixed';
      menu.style.zIndex = 9999;
      menu.style.top = `${top}px`;
      menu.style.left = `${left}px`;
    }
  }, [anchorRef, placement])

  return (
    <div className="create-menu" ref={menuRef}>
      <div className="create-menu-item" onClick={onCreateBoard}>
        <div className="menu-item-header">
          <FaTrello className="icon" />
          <h4>Create board</h4>
        </div>
        <p>
          A board is made up of cards ordered on lists. Use it to manage
          projects, track information, or organize anything.
        </p>
      </div>

      <div className="create-menu-item" onClick={onCreateAI}>
        <div className="menu-item-header">
          <FaRobot className="icon" />
          <h4>Create with AI</h4>
        </div>
        <p>Let AI generate a smart board based on your project description.</p>
      </div>
    </div>
  )
}
