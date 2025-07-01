import { useState, useRef, useEffect, useLayoutEffect, forwardRef } from 'react'
import { createPortal } from 'react-dom'
import { DatesModal } from '../DatesModal'
import { LabelsModal } from '../LabelsModal'
import { MembersModal } from '../MembersModal'
import { CoverModal } from '../CoverModal'

export const MODAL_TYPES = {
  LABELS: 'LABELS',
  MEMBERS: 'MEMBERS',
  DATES: 'DATES',
  COVER: 'COVER'
}

export const TaskDetailsDynamic = forwardRef(({
  type,
  task,
  board,
  group,
  onClose,
  onUpdateTask,
  position,
  triggerRef,
  onHeightChange
}, ref) => {
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

  useEffect(() => {
    if (ref && modalRef.current) {
      ref(modalRef.current)
    }
  }, [ref, type])

  useEffect(() => {
    if (onHeightChange && modalRef.current) {
      const timer = setTimeout(() => {
        onHeightChange()
      }, 10)

      return () => clearTimeout(timer)
    }
  }, [task, onHeightChange, type])

  useLayoutEffect(() => {
    if (position && position.x !== undefined && position.y !== undefined) {
      let finalY = position.y

      if (position.alignAbove && modalRef.current) {
        const modalHeight = modalRef.current.offsetHeight
        finalY = position.y - modalHeight
      }

      setCalculatedPosition({
        x: position.x,
        y: finalY,
        alignAbove: position.alignAbove
      })
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

    if (onHeightChange) {
      setTimeout(onHeightChange, 50)
    }
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

    if (onHeightChange) {
      setTimeout(onHeightChange, 50)
    }
  }

  function handleUpdateDates(dateUpdates) {
    const updatedTask = { ...task, ...dateUpdates }
    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }
    onUpdateTask(updatedGroup)
  }

  function handleUpdateCover(coverData) {
    const updatedTask = {
      ...task,
      style: {
        ...task.style,
        ...(coverData.type === 'color'
          ? {
            backgroundColor: coverData.value,
            backgroundImage: undefined,
            background: undefined,
            coverSize: coverData.size,
          }
          : {
            background: coverData.value,
            backgroundColor: undefined,
            backgroundImage: undefined,
            coverSize: coverData.size,
          }),
      },
    }
    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }
    onUpdateTask(updatedGroup)
  }

  function handleRemoveCover() {
    const updatedTask = {
      ...task,
      style: {
        ...task.style,
        backgroundColor: undefined,
        backgroundImage: undefined,
        background: undefined,
        coverSize: undefined,
      },
    }
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

      case MODAL_TYPES.COVER:
        return (
          <CoverModal
            task={task}
            position={calculatedPosition}
            onClose={handleClose}
            onUpdateCover={handleUpdateCover}
            onRemoveCover={handleRemoveCover}
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
})
