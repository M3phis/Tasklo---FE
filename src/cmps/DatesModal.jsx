import { useState, useEffect } from 'react'

// Helper functions
const formatDateForInput = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  const year = d.getFullYear()
  return `${month}/${day}/${year}`
}

const parseInputDate = (inputString) => {
  if (!inputString) return null
  const d = new Date(inputString)
  return d.getTime()
}

const formatEpochForDisplay = (epoch) => {
  if (!epoch) return ''
  return formatDateForInput(new Date(epoch))
}

export function DatesModal({ task, onClose, onUpdateDates }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [startDate, setStartDate] = useState(
    formatEpochForDisplay(task?.startDate) || ''
  )
  const [dueDate, setDueDate] = useState(
    formatEpochForDisplay(task?.dueDate) || ''
  )
  const [startTime, setStartTime] = useState('12:00 PM')
  const [dueTime, setDueTime] = useState('1:00 PM')
  const [hasStartDate, setHasStartDate] = useState(!!task?.startDate)
  const [hasDueDate, setHasDueDate] = useState(!!task?.dueDate)
  const [selectedDate, setSelectedDate] = useState(null)

  // Remember previous dates when toggling checkboxes
  const [previousStartDate, setPreviousStartDate] = useState(
    formatEpochForDisplay(task?.startDate) || ''
  )
  const [previousDueDate, setPreviousDueDate] = useState(
    formatEpochForDisplay(task?.dueDate) || ''
  )

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Get calendar data
  const getCalendarData = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startingDayOfWeek = firstDay.getDay()
    const daysInMonth = lastDay.getDate()

    const days = []

    // Previous month's trailing days
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        isNextMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
      })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isNextMonth: false,
        date: new Date(year, month, day),
      })
    }

    // Next month's leading days
    const remainingCells = 42 - days.length // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isNextMonth: true,
        date: new Date(year, month + 1, day),
      })
    }

    return days
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const navigateYear = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setFullYear(currentDate.getFullYear() + direction)
    setCurrentDate(newDate)
  }

  const handleDateClick = (dateObj) => {
    const dateString = formatDateForInput(dateObj.date)
    setSelectedDate(dateObj.date)

    // Smart date selection logic
    if (hasStartDate && hasDueDate) {
      if (!startDate && !dueDate) {
        // No dates set, set start date first
        setStartDate(dateString)
        setPreviousStartDate(dateString)
      } else if (startDate && !dueDate) {
        // Start date exists, set due date
        const startDateObj = new Date(startDate)
        if (dateObj.date >= startDateObj) {
          setDueDate(dateString)
          setPreviousDueDate(dateString)
        } else {
          // Selected date is before start date, move start date
          setStartDate(dateString)
          setPreviousStartDate(dateString)
        }
      } else if (!startDate && dueDate) {
        // Due date exists, set start date
        const dueDateObj = new Date(dueDate)
        if (dateObj.date <= dueDateObj) {
          setStartDate(dateString)
          setPreviousStartDate(dateString)
        } else {
          // Selected date is after due date, move due date
          setDueDate(dateString)
          setPreviousDueDate(dateString)
        }
      } else {
        // Both dates exist, determine which to update based on proximity
        const startDateObj = new Date(startDate)
        const dueDateObj = new Date(dueDate)
        const startDiff = Math.abs(
          dateObj.date.getTime() - startDateObj.getTime()
        )
        const dueDiff = Math.abs(dateObj.date.getTime() - dueDateObj.getTime())

        if (startDiff < dueDiff) {
          setStartDate(dateString)
          setPreviousStartDate(dateString)
        } else {
          setDueDate(dateString)
          setPreviousDueDate(dateString)
        }
      }
    } else if (hasStartDate) {
      setStartDate(dateString)
      setPreviousStartDate(dateString)
    } else if (hasDueDate) {
      setDueDate(dateString)
      setPreviousDueDate(dateString)
    }
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date) => {
    const dateString = formatDateForInput(date)
    return dateString === startDate || dateString === dueDate
  }

  const isInRange = (date) => {
    if (!startDate || !dueDate) return false
    const dateObj = new Date(date)
    const startDateObj = new Date(startDate)
    const dueDateObj = new Date(dueDate)
    return dateObj > startDateObj && dateObj < dueDateObj
  }

  const isStartDate = (date) => {
    const dateString = formatDateForInput(date)
    return dateString === startDate
  }

  const isDueDate = (date) => {
    const dateString = formatDateForInput(date)
    return dateString === dueDate
  }

  const handleSave = () => {
    const updates = {}
    if (hasStartDate && startDate) {
      updates.startDate = parseInputDate(startDate)
    } else {
      updates.startDate = null
    }

    if (hasDueDate && dueDate) {
      updates.dueDate = parseInputDate(dueDate)
    } else {
      updates.dueDate = null
    }

    onUpdateDates(updates)
    onClose()
  }

  const handleRemove = () => {
    onUpdateDates({ startDate: null, dueDate: null })
    onClose()
  }

  const calendarDays = getCalendarData()

  return (
    <div className="dates-modal-overlay" onClick={onClose}>
      <div className="dates-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dates-modal-header">
          <span>Dates</span>
          <button className="date-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="calendar-container">
          <div className="calendar-navigation">
            <button onClick={() => navigateYear(-1)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M11 12L7 8L11 4"
                  stroke="#44546F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 12L3 8L7 4"
                  stroke="#44546F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button onClick={() => navigateMonth(-1)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 12L6 8L10 4"
                  stroke="#44546F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className="month-year">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button onClick={() => navigateMonth(1)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 4L10 8L6 12"
                  stroke="#44546F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button onClick={() => navigateYear(1)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M5 4L9 8L5 12"
                  stroke="#44546F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 4L13 8L9 12"
                  stroke="#44546F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="calendar-grid">
            <div className="day-headers">
              {dayNames.map((day) => (
                <div key={day} className="day-header">
                  {day}
                </div>
              ))}
            </div>
            <div className="calendar-days">
              {calendarDays.map((dateObj, index) => (
                <button
                  key={index}
                  className={`calendar-day ${
                    !dateObj.isCurrentMonth ? 'other-month' : ''
                  } ${isToday(dateObj.date) ? 'today' : ''} ${
                    isStartDate(dateObj.date) ? 'start-date' : ''
                  } ${isDueDate(dateObj.date) ? 'due-date' : ''} ${
                    isInRange(dateObj.date) ? 'in-range' : ''
                  }`}
                  onClick={() => handleDateClick(dateObj)}
                >
                  {dateObj.day}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="date-inputs-section">
          <div className="date-input-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={hasStartDate}
                onChange={(e) => {
                  setHasStartDate(e.target.checked)
                  if (e.target.checked) {
                    // Restore previous date if available
                    setStartDate(previousStartDate)
                  } else {
                    // Remember current date before clearing
                    if (startDate) setPreviousStartDate(startDate)
                    setStartDate('')
                  }
                }}
              />
              Start date
            </label>
            {hasStartDate && (
              <input
                type="text"
                className="date-input"
                placeholder="M/D/YYYY"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            )}
          </div>

          <div className="date-input-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={hasDueDate}
                onChange={(e) => {
                  setHasDueDate(e.target.checked)
                  if (e.target.checked) {
                    // Restore previous date if available
                    setDueDate(previousDueDate)
                  } else {
                    // Remember current date before clearing
                    if (dueDate) setPreviousDueDate(dueDate)
                    setDueDate('')
                  }
                }}
              />
              Due date
            </label>
            {hasDueDate && (
              <div className="due-date-inputs">
                <input
                  type="text"
                  className="date-input"
                  placeholder="M/D/YYYY"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                <input
                  type="text"
                  className="time-input"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="dates-modal-actions">
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
          <button className="remove-btn" onClick={handleRemove}>
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
