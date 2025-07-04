import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { FaApple, FaSlack, FaMicrosoft } from 'react-icons/fa'
import logo from '../assets/img/logo.png'
import rightImg from '../assets/img/rightloginimg.svg'
import leftImg from '../assets/img/leftloginim.svg'

export function Signup() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  function onContinue(ev) {
    ev.preventDefault()
    navigate('/signup/details', { state: { email } })
  }

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={onContinue}>
        <img src={logo} alt="Tasklo" />
        <h2>Sign up to continue</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <p className="signup-terms">
          By signing up, I accept the Tasklian{' '}
          <Link to="/terms-of-service">Cloud Terms of Service</Link> and
          acknowledge the <Link to="/privacy-policy">Privacy Policy</Link>.
        </p>

        <button type="submit" className="continue-btn">
          Sign up
        </button>

        <div className="divider">
          <span>Or continue with:</span>
        </div>

        <div className="social-login-buttons">
          <button type="button" className="social-btn google">
            <FcGoogle size={20} /> Google
          </button>
          <button type="button" className="social-btn microsoft">
            <FaMicrosoft size={18} color="#5E5E5E" /> Microsoft
          </button>
          <button type="button" className="social-btn apple">
            <FaApple size={18} color="#000" /> Apple
          </button>
          <button type="button" className="social-btn slack">
            <FaSlack size={18} color="#611f69" /> Slack
          </button>
        </div>

        <Link to="/login" className="login-link">
          Already have a Tasklo account? Log in
        </Link>
      </form>
      <img className="right-img" src={rightImg} alt="background img" />
      <img className="left-img" src={leftImg} alt="background img" />
    </div>
  )
}
