import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { DatesModal } from '../DatesModal'
import { LabelsModal } from '../LabelsModal'
import { MembersModal } from '../MembersModal'

export const MODAL_TYPES = {
  LABELS: 'LABELS',
  MEMBERS: 'MEMBERS',
  DATES: 'DATES',
}

export function TaskDetailsDynamic({
  type,
  task,
  board,
  group,
  onClose,
  onUpdateTask,
  position,
  triggerRef,
}) {
  const modalRef = useRef(null)
  const [calculatedPosition, setCalculatedPosition] = useState(position)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    function updateSize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useLayoutEffect(() => {
    if (position && position.x !== undefined && position.y !== undefined) {
      setCalculatedPosition(position)
      return
    }

    if (modalRef.current && triggerRef?.current) {
      const modalRect = modalRef.current.getBoundingClientRect()
      const triggerRect = triggerRef.current.getBoundingClientRect()

      let newTop = triggerRect.bottom + 8
      let newLeft = triggerRect.left

      if (newTop + modalRect.height > windowSize.height) {
        newTop = Math.max(10, windowSize.height - modalRect.height - 10)
      }

      if (newLeft + modalRect.width > windowSize.width) {
        newLeft = Math.max(10, windowSize.width - modalRect.width - 10)
      }

      setCalculatedPosition({ x: newLeft, y: newTop })
    }
  }, [windowSize, type, triggerRef, position])

  function handleClose(event) {
    if (event) {
      event.stopPropagation()
      event.preventDefault()
    }
    onClose()
  }

  function handleToggleLabel(labelId) {
    const currentLabelIds = task.labelIds || []
    const updatedLabelIds = currentLabelIds.includes(labelId)
      ? currentLabelIds.filter((id) => id !== labelId)
      : [...currentLabelIds, labelId]

    const updatedTask = { ...task, labelIds: updatedLabelIds }
    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }
    onUpdateTask(updatedGroup)
  }

  function handleToggleMember(memberId) {
    const currentMemberIds = task.memberIds || []
    const updatedMemberIds = currentMemberIds.includes(memberId)
      ? currentMemberIds.filter((id) => id !== memberId)
      : [...currentMemberIds, memberId]

    const updatedTask = { ...task, memberIds: updatedMemberIds }
    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }
    onUpdateTask(updatedGroup)
  }

  function handleUpdateDates(dateUpdates) {
    const updatedTask = { ...task, ...dateUpdates }
    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }
    onUpdateTask(updatedGroup)
  }

  function renderModalContent() {
    switch (type) {
      case MODAL_TYPES.LABELS:
        return (
          <LabelsModal
            labels={board.labels || []}
            taskLabelIds={task.labelIds || []}
            position={calculatedPosition}
            onClose={handleClose}
            onToggleLabel={handleToggleLabel}
          />
        )

      case MODAL_TYPES.MEMBERS:
        return (
          <MembersModal
            boardMembers={board.members || []}
            cardMemberIds={task.memberIds || []}
            position={calculatedPosition}
            onClose={handleClose}
            onToggleMember={handleToggleMember}
          />
        )

      case MODAL_TYPES.DATES:
        return (
          <DatesModal
            task={task}
            position={calculatedPosition}
            onClose={handleClose}
            onUpdateDates={handleUpdateDates}
          />
        )

      default:
        return null
    }
  }

  if (!type) return null

  const modalContent = (
    <div
      ref={modalRef}
      className={`dynamic-modal ${type.toLowerCase()}`}
      style={{
        position: 'fixed',
        top: calculatedPosition.y,
        left: calculatedPosition.x,
        zIndex: 1100,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {renderModalContent()}
    </div>
  )

  return createPortal(modalContent, document.body)
}
