import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/user.actions'
import { BoardFilter } from '../cmps/BoardFilter.jsx'
import { loadBoards } from '../store/board.actions'
import menuButton from '../svg/menu.svg'
import megaphoneButton from '../svg/megaphone.svg'
import bellButton from '../svg/bell.svg'
import qmakrButton from '../svg/qmark.svg'

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
          <img src={menuButton} alt="Menu Button" />
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

        <div className="nav-buttons">
          <button>
            <img src={megaphoneButton} alt="contect us" />
          </button>

          <button>
            <img src={bellButton} alt="Notifications" />
          </button>

          <button>
            <img src={qmakrButton} alt="" />
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
