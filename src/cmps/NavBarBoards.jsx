import { Link } from 'react-router-dom'
import PersonIcon from '@atlaskit/icon/core/person'
import SettingsIcon from '@atlaskit/icon/core/settings'
import { FaTrello } from 'react-icons/fa'

export function NavBarBoards() {
  return (
    <section className="workspace-nav-bar">
      <div className="workspace-header">
        <span>T</span>Tasklo Workspace
      </div>
      <nav className="nav-bar-boards">
        <Link to="/board/Settings">
          <SettingsIcon label="" color="rgb(23, 43, 77)" />
          <span>Settings</span>
        </Link>
        <Link to="/workspace/Members">
          <PersonIcon label="" color="rgb(23, 43, 77)" /> <span>Members</span>
        </Link>
        <Link to="/workspace">
          <FaTrello label="" color="rgb(23, 43, 77)" />
          <span>Boards</span>
        </Link>
      </nav>
    </section>
  )
}
