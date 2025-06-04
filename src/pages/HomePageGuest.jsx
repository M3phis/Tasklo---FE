export function HomePageGuest() {
  return (
    <div className="trello-home">
      <header className="home-header">
        <div className="logo">
          <img
            src="https://trello.com/assets/87e1af770a49a7f1d201e404d0c3eb1c.svg"
            alt="Trello Logo"
          />
          <span>Trello</span>
        </div>
        <nav className="home-nav">
          <a href="#">Features</a>
          <a href="#">Solutions</a>
          <a href="#">Plans</a>
          <a href="#">Pricing</a>
          <a href="#">Resources</a>
          <a href="#">Log in</a>
          <button className="signup-btn">Get Trello for free</button>
        </nav>
      </header>

      <main className="home-main">
        <section className="hero">
          <h1>Trello brings all your tasks, teammates, and tools together</h1>
          <p>Keep everything in the same place—even if your team isn’t.</p>
          <form className="signup-form">
            <input type="email" placeholder="Email" />
            <button type="submit">Sign up - it’s free!</button>
          </form>
        </section>

        <section className="features-preview">
          <h2>See work in a whole new way</h2>
          <div className="features-list">
            <div className="feature-card">
              <h3>Boards</h3>
              <p>Organize your work into visual boards.</p>
            </div>
            <div className="feature-card">
              <h3>Lists</h3>
              <p>Track progress with customizable lists.</p>
            </div>
            <div className="feature-card">
              <h3>Cards</h3>
              <p>Manage tasks, deadlines, and more with cards.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>© 2025 Trello Clone. Not affiliated with Atlassian.</p>
      </footer>
    </div>
  )
}
