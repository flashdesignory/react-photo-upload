import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SplashPage.scss';

class SplashPage extends Component {
  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(e) {
    e.preventDefault();
    const { id } = e.target;
    const { history, location } = this.props;
    console.log(`handleOnClick(${id}, ${location})`);
    switch (id) {
      case 'upload-button':
        history.push('/upload');
        break;
      default:
    }
  }

  render() {
    return (
      <div className="page splash">
        <div className="buttons-container">
          <div className="navigation-buttons">
            <button
              className="button wide upload"
              type="button"
              id="upload-button"
              onClick={this.handleOnClick}
            >
              <span className="button-text">
                Start
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

SplashPage.defaultProps = {
  history: {},
  location: {},
};

SplashPage.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};

export default SplashPage;
