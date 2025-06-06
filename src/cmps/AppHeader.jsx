import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/user.actions'
import { BoardFilter } from '../cmps/BoardFilter.jsx'
import { loadBoards } from '../store/board.actions'
import MegaphoneIcon from '@atlaskit/icon/core/megaphone'
import QuestionCircleIcon from '@atlaskit/icon/core/question-circle'
import NotificationIcon from '@atlaskit/icon/core/migration/notification--notification-direct'
import AppSwitcherIcon from '@atlaskit/icon/core/app-switcher'

export function AppHeader() {
  const user = useSelector((storeState) => storeState.userModule.user)
  const [filterBy, setFilterBy] = useState(boardService.getEmptyFilter())
  const navigate = useNavigate()

  useEffect(() => {
    loadBoards(filterBy)
  }, [filterBy])

  function onSetFilterBy(filterBy) {
    setFilterBy((prevFilterBy) => ({ ...prevFilterBy, ...filterBy }))
  }

  async function onLogout() {
    try {
      await logout()
      navigate('/')
      showSuccessMsg(`Bye now`)
    } catch (err) {
      showErrorMsg('Cannot logout')
    }
  }

  return (
    <header className="app-header main-container full">
      <nav className="">
        <button className="menu-button">
          <AppSwitcherIcon label="" color="#9fadbc" />
        </button>
        <NavLink to="/board" className="logo">
          <div className="tasklo-logo">
            <div className="logo-icon">
              <div className="bar bar-left"></div>
              <div className="bar bar-right"></div>
            </div>
            <div className="logo-text">Tasklo</div>
          </div>
        </NavLink>

        <BoardFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />

        <button className="create-btn">Create</button>

        <div className="nav-buttons">
          <button>
            <MegaphoneIcon label="" color="#9fadbc" />
          </button>

          <button>
            <NotificationIcon label="" color="#9fadbc" />
          </button>

          <button>
            <QuestionCircleIcon label="" color="#9fadbc" />
          </button>

          {!user && (
            <NavLink to="login" className="login-link">
              Login
            </NavLink>
          )}
        </div>
        {user && (
          <div className="user-info">
            <Link to={`user/${user._id}`}>
              {user.imgUrl && <img src={user.imgUrl} />}
              {user.fullname}
            </Link>
            {/* <span className="score">{user.score?.toLocaleString()}</span> */}
            <button onClick={onLogout}>logout</button>
          </div>
        )}
      </nav>
    </header>
  )
}
