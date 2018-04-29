import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './header.scss';

const Header = () => {
  return (
    <header>
      <div className="header-inner">
        <div className="title"><Link to="/"><h1>Image Uploader</h1></Link></div>
    </div>
    </header>
  )
}

export default Header;
