import React from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import containerStyles from "./container.module.scss"
import logo from "./logo.svg";

const LinkItem = props => (
  <li className={containerStyles.linkItem}>
    <Link to={props.to}>{props.children}</Link>
  </li>
)

export default function Container({ children }) {
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
        <ul className={`col-7 ${containerStyles.headerUl}`}>
          <LinkItem to="/">Home</LinkItem>
          <LinkItem to="/about">A propos</LinkItem>
          <LinkItem to="/contact">Contact</LinkItem>
          <LinkItem to="/blog">Blog</LinkItem>
        </ul>
        <button className={`col-3 ${containerStyles.burger}`}>
          <FontAwesomeIcon icon={faBars} size="2x" />
        </button>
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