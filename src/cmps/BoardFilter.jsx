import { FaSearch } from 'react-icons/fa'
import { CreateMenuContainer } from './CreateMenuContainer.jsx'

export function BoardFilter({ filterBy, onSetFilterBy }) {
  function handleChange({ target }) {
    const field = target.name
    const value = target.value
    onSetFilterBy({ [field]: value })
  }

  return (
    <section className="board-filter">
      <form onSubmit={(ev) => ev.preventDefault()} className="filter-form">
        <span className="search-icon">
          <FaSearch />
        </span>
        <input
          type="text"
          name="txt"
          placeholder="Search"
          value={filterBy.txt}
          onChange={handleChange}
        />
      </form>

      <CreateMenuContainer
        placement="bottom"
        trigger={({ onClick, ref }) => (
          <button ref={ref} className="create-btn" onClick={onClick}>
            Create
          </button>
        )}
      />
    </section>
  )
}
