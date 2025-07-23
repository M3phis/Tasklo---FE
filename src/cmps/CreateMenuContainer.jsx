import { useState, useRef, useEffect } from "react";
import { CreateMenu } from "./CreateMenu.jsx";
import { CreateBoardPanel } from "./CreateBoardPanel.jsx";
import { CreateBoardWithAI } from "./CreateBoardWithAI.jsx";

export function CreateMenuContainer({ trigger, placement = "bottom" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("menu");

  const containerRef = useRef();
  const anchorRef = useRef();

  function handleCreateBoard() {
    setMode("board");
  }

  function handleClose() {
    setIsOpen(false);
    setMode("menu");
  }

  function handleCreateAI() {
    setMode("ai");
  }

  useEffect(() => {
    function handleClickOutside(ev) {
      if (containerRef.current && !containerRef.current.contains(ev.target)) {
        handleClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="create-container" ref={containerRef}>
      {trigger({ onClick: () => setIsOpen((prev) => !prev), ref: anchorRef })}

      {isOpen && mode === "menu" && (
        <div className="create-menu-wrapper">
          <CreateMenu
            onCreateBoard={handleCreateBoard}
            onCreateAI={handleCreateAI}
            anchorRef={anchorRef}
            placement={placement}
          />
        </div>
      )}

      {isOpen && mode === "board" && (
        <div className="create-panel-wrapper">
          <CreateBoardPanel
            onClose={handleClose}
            anchorRef={anchorRef}
            placement={placement}
          />
        </div>
      )}
      {isOpen && mode === "ai" && (
        <div className="create-panel-wrapper">
          <CreateBoardWithAI
            onClose={handleClose}
            anchorRef={anchorRef}
            placement={placement}
          />
        </div>
      )}
    </div>
  );
}
