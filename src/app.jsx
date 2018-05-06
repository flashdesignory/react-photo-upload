import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import SplashPage from './routes/SplashPage';
import UploadPage from './routes/UploadPage';
import WebcamPage from './routes/WebcamPage';
import EditPage from './routes/EditPage';
import ResultPage from './routes/ResultPage';
import NotFound from './routes/NotFound';
import Header from './modules/header/Header';
import './app.scss';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      image: null,
      result: null
    }
    this.setImageData = this.setImageData.bind(this);
    this.getImageData = this.getImageData.bind(this);
  }
  setImageData(type, data){
    this.setState({
      [type] : data
    })
  }
  getImageData(type){
    return this.state[type];
  }
  render(){
    const { location, history } = this.props;
    return (
      <div className="container">
        <Header/>
        <Switch location={location}>
					<Route exact path="/" render={() => <SplashPage history={history}/>}/>
					<Route path="/upload" render={() => <UploadPage setImageData={this.setImageData} history={history}/>}/>
          <Route path="/webcam" render={() => <WebcamPage setImageData={this.setImageData} history={history}/>}/>
          <Route path="/edit" render={() => <EditPage setImageData={this.setImageData} imageData={this.state['image']} history={history}/>}/>
          <Route path="/result" render={() => <ResultPage imageData={this.state['result']} history={history}/>}/>
          <Route component={NotFound}/>
        </Switch>
      </div>
    )
  }
}

export default withRouter(App);
