import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import SplashPage from './routes/SplashPage';
import UploadPage from './routes/UploadPage';
import WebcamPage from './routes/WebcamPage';
import EditPage from './routes/EditPage';
import ResultPage from './routes/ResultPage';
import NotFound from './routes/NotFound';
import Header from './modules/header/header';
import './app.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      edit: null,
      result: null,
    };
    this.setImageData = this.setImageData.bind(this);
    this.getImageData = this.getImageData.bind(this);
  }

  setImageData(type, data, cb) {
    console.log(`type: ${type}`);
    if (type === '') {
      this.setState({
        image: null, edit: null, result: null,
      }, () => {
        if (cb) cb();
      });
    } else {
      this.setState({
        [type]: data,
      }, () => {
        if (cb) cb();
      });
    }
  }

  getImageData(type) {
    return this.state[type]; // eslint-disable-line  react/destructuring-assignment
  }

  render() {
    const { location, history } = this.props;
    const { image, edit } = this.state;
    return (
      <div className="container">
        <Header />
        <Switch location={location}>
          <Route
            exact
            path="/"
            render={() => (
              <SplashPage
                history={history}
              />
            )}
          />
          <Route
            path="/upload"
            render={() => (
              <UploadPage
                setImageData={this.setImageData}
                history={history}
              />
            )}
          />
          <Route
            path="/webcam"
            render={() => (
              <WebcamPage
                setImageData={this.setImageData}
                history={history}
              />
            )}
          />
          <Route
            path="/edit"
            render={() => (
              <EditPage
                setImageData={this.setImageData}
                imageData={image}
                editData={edit}
                history={history}
              />
            )}
          />
          <Route
            path="/result"
            render={() => (
              <ResultPage
                setImageData={this.setImageData}
                imageData={edit}
                history={history}
              />
            )}
          />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}

App.defaultProps = {
  history: {},
  location: {},
};

App.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};

export default withRouter(App);
