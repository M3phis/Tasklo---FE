import { Link } from 'react-router-dom'
import { FaTrello } from 'react-icons/fa'
import { FaChevronDown } from 'react-icons/fa6'
const LOGO = (
  <svg
    width="135"
    height="55"
    viewBox="0 0 135 55"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="80"
      y="18"
      text-anchor="middle"
      font-family="Segoe UI, Arial, sans-serif"
      font-size="11"
      font-weight="bold"
      fill="#0052CC"
      letter-spacing="2"
    >
      TASKLIAN
    </text>

    <g>
      <rect x="10" y="22" width="28" height="28" fill="url(#paint0_linear)" />
      <rect x="16" y="28" width="7" height="16" rx="2" fill="#fff" />
      <rect x="26" y="28" width="7" height="11" rx="2" fill="#fff" />
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="10"
          y1="22"
          x2="38"
          y2="50"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#0052CC" />
          <stop offset="1" stop-color="#2684FF" />
        </linearGradient>
      </defs>
    </g>

    <text
      x="48"
      y="44"
      font-family="Segoe UI, Arial, sans-serif"
      font-size="24"
      font-weight="bold"
      fill="#253858"
    >
      Tasklo
    </text>
  </svg>
)

export function LandingHeader() {
  return (
    <section className="landing-content">
      <header className="landing-header">
        <div className="header-left">
          <div className="logo">{LOGO}</div>
          <nav className="main-nav hide-on-mobile">
            <button className="nav-btn">
              Features <FaChevronDown />
            </button>
            <button className="nav-btn">
              Solutions <FaChevronDown />
            </button>
            <button className="nav-btn">
              Plans <FaChevronDown />
            </button>
            <button className="nav-btn">Pricing</button>
            <button className="nav-btn">
              Resources <FaChevronDown />
            </button>
          </nav>
        </div>
        <div className="header-right">
          <Link to="/login" className="login-link">
            Log in
          </Link>
          <Link to="/board" className="cta-btn">
            Try as guest
          </Link>
        </div>
      </header>
      <div className="landing-banner">
        Accelerate your teams' work with Tasklian Intelligence (AI) features 🤖
        now available for all Premium and Enterprise! Learn more.
        <a href="#" className="banner-link">
          Learn more.
        </a>
      </div>
    </section>
  )
}
