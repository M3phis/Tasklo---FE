import { useState } from 'react'
import { useNavigate } from 'react-router'

import { userService } from '../services/user'
import { login } from '../store/user.actions'

export function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  })
  const navigate = useNavigate()

  async function onLogin(ev) {
    ev.preventDefault()
    if (!credentials.email || !credentials.password) return
    await login(credentials)
    navigate('/')
  }

  function handleChange(ev) {
    const field = ev.target.name
    const value = ev.target.value
    setCredentials({ ...credentials, [field]: value })
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={onLogin}>
        <img src="/logo.png" alt="Tasklo Logo" style={{ width: 80, margin: '0 auto 16px' }} />
        <h2>Log in to your account</h2>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <button className="continue-btn" type="submit">Continue</button>
        <div className="divider"><span>Or continue with:</span></div>
        <div className="social-login-buttons">
          <button type="button" className="social-btn google">
            <img src="/google.svg" alt="Google" onError={e => e.target.style.display='none'} /> Google
          </button>
          <button type="button" className="social-btn microsoft">
            <img src="/microsoft.svg" alt="Microsoft" onError={e => e.target.style.display='none'} /> Microsoft
          </button>
          <button type="button" className="social-btn apple">
            <img src="/apple.svg" alt="Apple" onError={e => e.target.style.display='none'} /> Apple
          </button>
          <button type="button" className="social-btn slack">
            <img src="/slack.svg" alt="Slack" onError={e => e.target.style.display='none'} /> Slack
          </button>
        </div>
        <a href="/signup" className="login-link">Create an account</a>
      </form>
    </div>
  )
}
