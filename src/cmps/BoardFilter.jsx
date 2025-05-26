export function BoardFilter({ filterBy, onSetFilterBy }) {
  function handleChange({ target }) {
    const field = target.name
    const value = target.value
    onSetFilterBy({ [field]: value })
  }

  return (
    <section className="board-filter">
      <form onSubmit={(ev) => ev.preventDefault()}>
        <input
          type="text"
          name="txt"
          placeholder="Search boards..."
          value={filterBy.txt}
          onChange={handleChange}
        />
      </form>
    </section>
  )
}
