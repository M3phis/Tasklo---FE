import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { FaApple, FaSlack, FaMicrosoft } from 'react-icons/fa'
import logo from '../assets/img/logo.png'
import rightImg from '../assets/img/rightloginimg.svg'
import leftImg from '../assets/img/leftloginim.svg'

export function AuthForm({ mode = 'signup' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const isSignup = mode === 'signup'

  function onContinue(ev) {
    ev.preventDefault()
    if (isSignup) {
      navigate('/signup/details', { state: { email } })
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={onContinue}>
        <img src={logo} alt="Tasklo" />
        <h2>{isSignup ? 'Sign up to continue' : 'Log in to your account'}</h2>

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {!isSignup && (
          <>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </>
        )}

        {isSignup && (
          <p className="signup-terms">
            By signing up, I accept the Tasklian{' '}
            <Link to="/terms-of-service">Cloud Terms of Service</Link> and
            acknowledge the <Link to="/privacy-policy">Privacy Policy</Link>.
          </p>
        )}

        <button type="submit" className="continue-btn">
          {isSignup ? 'Sign up' : 'Continue'}
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

        {isSignup ? (
          <Link to="/login" className="login-link">
            Already have a Tasklo account? Log in
          </Link>
        ) : (
          <Link to="/signup" className="login-link">
            Create an account
          </Link>
        )}
      </form>

      <img className="right-img" src={rightImg} alt="background" />
      <img className="left-img" src={leftImg} alt="background" />
    </div>
  )
}
