import React from 'react';
import { Link } from 'react-router-dom';
import './header.scss';

const Header = () => (
  <header>
    <div className="header-inner">
      <div className="title">
        <Link to="/">
          <h1>
Image Uploader
          </h1>
        </Link>
      </div>
    </div>
  </header>
);

export default Header;
