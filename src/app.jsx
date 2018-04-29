import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import SplashPage from './routes/SplashPage';
import UploadPage from './routes/UploadPage';
import WebcamPage from './routes/WebcamPage';
import EditPage from './routes/EditPage';
import NotFound from './routes/NotFound';
import Header from './modules/header/Header';
import './app.scss';

class App extends Component {
  render(){
    const { location, history } = this.props;
    return (
      <div className="container">
        <Header/>
        <Switch location={location}>
					<Route exact path="/" render={() => <SplashPage history={history}/>}/>
					<Route path="/upload" render={() => <UploadPage history={history}/>}/>
          <Route path="/webcam" render={() => <WebcamPage history={history}/>}/>
          <Route path="/edit" render={() => <EditPage history={history}/>}/>
          <Route component={NotFound}/>
        </Switch>
      </div>
    )
  }
}

export default withRouter(App);
