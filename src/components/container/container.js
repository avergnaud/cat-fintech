import React, { useState } from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import containerStyles from "./container.module.scss"
import logo from "./logo.svg";

const LinkItem = props => (
  <li className={containerStyles.linkItem}>
    <Link to={props.to}>{props.children}</Link>
  </li>
)

const NavMenuItems = props => (
  <React.Fragment>
    <LinkItem to="/">Home</LinkItem>
    <LinkItem to="/about">A propos</LinkItem>
    <LinkItem to="/contact">Contact</LinkItem>
    <LinkItem to="/blog">Blog</LinkItem>
  </React.Fragment>
)

export default function Container({ children }) {

  const [showBurgerNav, setShowBurgerNav] = useState(false);

  const burgerButtonClicked = e => {
    e.preventDefault(); 
    setShowBurgerNav(true);
  }

  const closeBurgerButtonClicked = e => {
    e.preventDefault(); 
    setShowBurgerNav(false);
  }

  return (
    <header className="header container-fluid">
      <div className={`row ${containerStyles.headerRow}`}>
        <a
          className={`col-3 ${containerStyles.catamaniaHome}`}
          href="https://www.cat-amania.com"
          >
          <img 
            src={logo}
            className={containerStyles.catamaniaLogo}
            alt="Cat-Amania - Connectons nos talents"
            title="Cat-Amania - Connectons nos talents"
          />
        </a>
        <ul className={`col-7 ${containerStyles.commonNav} ${containerStyles.headerNav}`}>
          <NavMenuItems></NavMenuItems>
        </ul>
        <button 
          className={`col-3 ${containerStyles.burgerButton}`}
          onClick={burgerButtonClicked}
        >
        
          <FontAwesomeIcon icon={faBars} size="1x" />
        </button>
          {
            showBurgerNav ? <ul className={`col-7 ${containerStyles.commonNav} ${containerStyles.burgerNav}`}>
            <NavMenuItems></NavMenuItems>
            <button
              className={`col-3 ${containerStyles.closeBurgerButton}`}
              onClick={closeBurgerButtonClicked}
            >
              <FontAwesomeIcon icon={faTimes} size="1x" />
            </button>
          </ul> : null
          }
      </div>
    </header>
  )
  /*
  <div className={containerStyles.container}>
    <header className={containerStyles.header}>
      <Link to="/" className={containerStyles.homeLink}>
        <h3 className={containerStyles.title}>NN fintech</h3>
      </Link>
      <ul className={containerStyles.menu}>
        <LinkItem to="/blog/">Blog</LinkItem>
        <LinkItem to="/about/">About</LinkItem>
        <LinkItem to="/contact/">Contact</LinkItem>
      </ul>
    </header>
    {children}
  </div>
  */
}