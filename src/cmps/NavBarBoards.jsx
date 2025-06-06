import { Link } from 'react-router-dom'

export function NavBarBoards() {
  return (
    <nav className="nav-bar-boards">
      <Link to="/board/Settings">
        <span>Settings</span>
      </Link>
      <Link to="/workspace/Members">
        <span>Members</span>
      </Link>
      <Link to="/workspace">
        <span>Boards</span>
      </Link>
    </nav>
  )
}
