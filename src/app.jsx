import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import SplashPage from './routes/SplashPage';
import UploadPage from './routes/UploadPage';
import WebcamPage from './routes/WebcamPage';
import EditPage from './routes/EditPage';
import NotFound from './routes/NotFound';
import './app.scss';

class App extends Component {
  render(){
    return (
      <div className="container">
        <Switch location={location}>
					<Route exact path="/" component={SplashPage} />
					<Route path="/upload" component={UploadPage}/>
          <Route path="/webcam" component={WebcamPage}/>
          <Route path="/edit" component={EditPage}/>
          <Route component={NotFound}/>
        </Switch>
      </div>
    )
  }
}

export default App;
