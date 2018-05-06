import React from 'react';
import './preloader.scss';

const Preloader = () => {
  return (
    <div className="preloader">
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    </div>
  )
}

export default Preloader;
