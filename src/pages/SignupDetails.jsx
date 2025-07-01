import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { signup } from '../store/user.actions.js'
import logo from '../assets/img/logo.png'
import rightImg from '../assets/img/rightloginimg.svg'
import leftImg from '../assets/img/leftloginim.svg'

export function SignupDetails() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state.email || ''

  const [formData, setFormData] = useState({
    fullname: '',
    password: '',
    marketingConsent: false,
  })

  function handleChange(ev) {
    const { name, value, type, checked } = ev.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleSubmit(ev) {
    ev.preventDefault()

    try {
      const credentials = {
        username: email,
        email,
        ...formData,
      }
      const user = await signup(credentials)
      if (user) navigate('/board')
    } catch (err) {
      console.error('Signup failed:', err)
    }
  }

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <img src={logo} alt="Tasklo logo" className="logo" />
        <h3 className="verified-heading">Email address verified</h3>
        <p className="sub-heading">Finish setting up your account</p>

        <div className="email-display">
          <div>Email address</div>
          <p className="email-value">{email}</p>
        </div>

        <label htmlFor="fullname">Full name</label>
        <input
          id="fullname"
          type="text"
          name="fullname"
          placeholder="Enter full name"
          value={formData.fullname}
          onChange={handleChange}
          required
          className="full-name-signup"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Create password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <p className="password-hint">
          Password must have at least 8 characters
        </p>

        <label className="checkbox-line">
          <input
            type="checkbox"
            name="marketingConsent"
            checked={formData.marketingConsent}
            onChange={handleChange}
          />
          Yes! Send me news and updates about Tasklo.
        </label>

        <p className="signup-terms">
          By signing up, I accept the{' '}
          <a href="/terms-of-service" target="_blank" rel="noreferrer">
            Tasklian Cloud Terms of Service
          </a>{' '}
          and acknowledge the{' '}
          <a href="/privacy-policy" target="_blank" rel="noreferrer">
            Privacy Policy
          </a>
          .
        </p>

        <button type="submit" className="continue-btn">
          Continue
        </button>
      </form>
      <img className="right-img" src={rightImg} alt="background img" />
      <img className="left-img" src={leftImg} alt="background img" />
    </div>
  )
}
