import { FaSearch } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'

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
        {filterBy.txt && (
          <button
            type="button"
            className="btn-clear"
            onClick={() => onSetFilterBy({ txt: '' })}
          >
            <MdClose />
          </button>
        )}
      </form>
    </section>
  )
}
