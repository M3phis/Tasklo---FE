import { boardService } from '../services/board/board.service.local'
import { useParams } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview'
import { moveCard } from '../store/board.actions'
import { useDispatch } from 'react-redux'
import { createPortal } from 'react-dom'

export function Card({ task, onRemoveTask, group }) {
  const [isDragging, setIsDragging] = useState(false)
  const ref = useRef(null)
  const { boardId } = useParams()
  const dispatch = useDispatch()
  const [preview, setPreview] = useState(null)
  useEffect(() => {
    const element = ref.current
    if (!element) return

    return combine(
      draggable({
        element,
        getInitialData() {
          return { ...task, groupId: group.id }
        },
        onDragStart(event) {
          setIsDragging(true)
        },
        onDragOver(event) {
          event.preventDefault()
        },
        onDrop() {
          setIsDragging(false)
          setPreview(null)
        },
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            render({ container }) {
              setPreview(container)
            },
          })
        },
      }),
      dropTargetForElements({
        element,
        getData() {
          return { ...task, groupId: group.id }
        },
        onDrop: async ({ source, self }) => {
          try {
            await moveCard(
              boardId,
              source.data.groupId,
              source.data.id,
              self.data.groupId
            )
          } catch (error) {
            console.error('Failed to move card:', error)
          }
        },
      })
    )
  }, [boardId, group.id, task, dispatch])

  return (
    <div
      key={task.id}
      className={`task-card ${isDragging ? 'drag-cursor' : ''}`}
      ref={ref}
    >
      <p>{task.title}</p>
      <button
        className="remove-task-btn"
        onClick={() => onRemoveTask(group.id, task.id)}
        aria-label="Remove task"
      >
        X
      </button>
      {preview && createPortal(<CardPreveiw card={task} />, preview)}
    </div>
  )
}

const CardPreveiw = ({ card }) => {
  return <div className="card-preview">{<p>{card.title}</p>}</div>
}
