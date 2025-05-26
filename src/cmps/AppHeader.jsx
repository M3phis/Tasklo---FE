import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service";
import { logout } from "../store/user.actions";
import { BoardFilter } from "../cmps/BoardFilter.jsx";
import { loadBoards } from "../store/board.actions";

export function AppHeader() {
  const user = useSelector((storeState) => storeState.userModule.user);
  const [filterBy, setFilterBy] = useState(boardService.getEmptyFilter());
  const navigate = useNavigate();

  useEffect(() => {
    loadBoards(filterBy);
  }, [filterBy]);

  function onSetFilterBy(filterBy) {
    setFilterBy((prevFilterBy) => ({ ...prevFilterBy, ...filterBy }));
  }

  async function onLogout() {
    try {
      await logout();
      navigate("/");
      showSuccessMsg(`Bye now`);
    } catch (err) {
      showErrorMsg("Cannot logout");
    }
  }

  return (
    <header className="app-header main-container full">
      <nav className="">
        <NavLink to="/" className="logo">
          <div className="tasklo-logo">
            <div className="logo-icon">
              <div className="bar bar-left"></div>
              <div className="bar bar-right"></div>
            </div>
            <div className="logo-text">Tasklo</div>
          </div>
        </NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/board">Boards</NavLink>
        <NavLink to="/chat">Chat</NavLink>
        <NavLink to="/review">Review</NavLink>
        {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}
        <BoardFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />

        {!user && (
          <NavLink to="login" className="login-link">
            Login
          </NavLink>
        )}

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
  );
}
