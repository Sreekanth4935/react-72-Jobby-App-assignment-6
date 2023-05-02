import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BiHomeAlt} from 'react-icons/bi'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-menu-mobile">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="header-image"
        />
      </Link>
      <div className="mobile-nav-section">
        <Link to="/">
          <BiHomeAlt className="icon" />
        </Link>

        <Link to="/jobs">
          <BsBriefcaseFill className="icon" />
        </Link>
        <Link to="/login">
          <FiLogOut className="icon" onClick={onClickLogout} />
        </Link>
      </div>
      <div className="desktop-nav-section sub-heading-nav">
        <Link to="/" className="link-names">
          <h1 className="nav-heading">Home</h1>
        </Link>
        <Link to="/jobs" className="link-names">
          <h1 className="nav-heading">Jobs</h1>
        </Link>
      </div>
      <button type="button" className="logout-button" onClick={onClickLogout}>
        logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
