import { Link } from 'react-router-dom'

export function NavBarBoards() {
  return (
    <section className="workspace-nav-bar">
      <div className="workspace-header">
        <span>T</span>Tasklo Workspace
      </div>
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
    </section>
  )
}
