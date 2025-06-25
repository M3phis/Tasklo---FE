import { useState } from 'react'
import ideasImg from '../assets/img/ideas.png'
import boardsImg from '../assets/img/boards.png'
import hubImg from '../assets/img/taskhub.png'

export function HomePage() {
  const [selected, setSelected] = useState('ideas')

  const imageMap = {
    ideas: ideasImg,
    boards: boardsImg,
    hub: hubImg,
  }

  return (
    <div className="landing-root">
      <main className="landing-main">
        <section className="landing-content">
          <h1>Capture, organize, and tackle your to-dos from anywhere.</h1>
          <p>
            Escape the clutter and chaos—unleash your productivity with Tasklo.
          </p>
          <form className="landing-signup-form">
            <div className="input-wrapper">
              <input name="email" type="email" placeholder="Email" />
            </div>
            <button type="submit">Sign up – it’s free!</button>
          </form>
          <div className="privacy-note">
            By entering my email, I acknowledge the{' '}
            <a href="#">Tasklo Privacy Policy</a>
          </div>
          <a href="#" className="video-link">
            Watch video <span className="play-icon">▶</span>
          </a>
        </section>

        <section className="landing-visual">
          <video
            height={525}
            width={681}
            src="https://videos.ctfassets.net/rz1oowkt5gyp/4AJBdHGUKUIDo7Po3f2kWJ/3923727607407f50f70ccf34ab3e9d90/updatedhero-mobile-final.mp4"
            autoPlay
            muted
          />
        </section>
      </main>

      <section className="landing-info">
        <header className="test">
          <p className="header-info">Tasklo 101</p>
          <h2>Your productivity powerhouse</h2>
          <p className="header-context">
            Stay organized and efficient with Ideas, Boards, and Task Hub. Every
            to-do, idea, or responsibility—no matter how small—finds its place,
            keeping you at the top of your game.
          </p>
        </header>

        <div className="main-landing-info">
          <section className="landing-info-text">
            {['ideas', 'boards', 'hub'].map((key) => (
              <div
                key={key}
                className={`landing-info-item ${
                  selected === key ? 'active' : ''
                }`}
                onClick={() => setSelected(key)}
              >
                <h4>
                  {key === 'ideas'
                    ? 'Ideas'
                    : key === 'boards'
                    ? 'Boards'
                    : 'Task Hub'}
                </h4>
                <p>
                  {key === 'ideas' &&
                    'Great ideas can strike anytime. Capture them instantly, keep them safe, and turn them into action when the time is right.'}
                  {key === 'boards' &&
                    'Your to-do list may be long, but it can be manageable! Keep tabs on everything from "to-dos to tackle" to "mission accomplished!”'}
                  {key === 'hub' &&
                    'Organize, drag, and drop. Your workspace for handling tasks in motion — visually and intuitively.'}
                </p>
              </div>
            ))}
          </section>

          <section className="landing-info-image">
            <div className="image-wrapper">
              <img
                key={selected}
                src={imageMap[selected]}
                alt=""
                className="fade"
              />
              <div className="image-nav">
                {['ideas', 'boards', 'hub'].map((key) => (
                  <button
                    key={key}
                    className={`dot ${selected === key ? 'active' : ''}`}
                    onClick={() => setSelected(key)}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}
