import { Link, NavLink, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/user.actions'
import { BoardFilter } from '../cmps/BoardFilter.jsx'
import { loadBoards } from '../store/board.actions'
import MegaphoneIcon from '@atlaskit/icon/core/megaphone'
import QuestionCircleIcon from '@atlaskit/icon/core/question-circle'
import NotificationIcon from '@atlaskit/icon/core/notification'
import { LandingHeader } from './LandingHeader.jsx'
import { boardService } from '../services/board'

export function AppHeader() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useSelector((storeState) => storeState.userModule.user)
  const [filterBy, setFilterBy] = useState(boardService.getEmptyFilter())
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const isRootPath = location.pathname === '/'
  const hideHeaderPaths = ['/signup', '/login', '/signup/details']

  useEffect(() => {
    loadBoards(filterBy)
  }, [filterBy])

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  function onSetFilterBy(filterBy) {
    setFilterBy((prevFilterBy) => ({ ...prevFilterBy, ...filterBy }))
  }

  async function onLogout() {
    try {
      await logout()
      navigate('/') // Always go to home page after logout
      showSuccessMsg(`Bye now`)
    } catch (err) {
      showErrorMsg('Cannot logout')
    }
  }

  if (hideHeaderPaths.includes(location.pathname)) return null
  if (isRootPath) return <LandingHeader />

  return (
    <header className="app-header main-container full">
      <nav className="">
        <NavLink to="/board" className="logo">
          <div className="tasklo-logo">
            <div className="logo-icon">
              <div className="bar bar-left"></div>
              <div className="bar bar-right"></div>
            </div>
            <div className="logo-text">Tasklo</div>
          </div>
        </NavLink>

        <div className="header-center-group">
          <BoardFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
        </div>

        <button
          className="hamburger-menu"
          aria-label="Open menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span></span>
        </button>

        <div className={`nav-buttons${isMenuOpen ? ' open' : ''}`}>
          <button>
            <MegaphoneIcon label="" color="#455570" />
          </button>

          <button>
            <NotificationIcon label="" color="#455570" />
          </button>

          <button>
            <QuestionCircleIcon label="" color="#455570" />
          </button>
          <div className="user-menu" onClick={() => setShowUserMenu((prev) => !prev)} style={{ cursor: 'pointer', position: 'relative' }}>
            {user && (user.username || user.fullname)
              ? (user.username ? user.username[0] : user.fullname[0]).toUpperCase()
              : 'G'}
            {showUserMenu && (
              <div className="user-menu-dropdown" style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                borderRadius: '8px',
                zIndex: 2000,
                minWidth: '120px',
                padding: '8px 0',
              }}>
                <button
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    padding: '10px 16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '1em',
                  }}
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
