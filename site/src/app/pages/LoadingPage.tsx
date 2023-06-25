import React from 'react';
import { Server } from '../../server/server';
import './LoadingPage.css';

interface LoadingPageProps {
  maintenance: boolean;
  setInitialized:() => void;
}

class LoadingPage extends React.Component<LoadingPageProps, {}> {
  constructor(props:LoadingPageProps) {
    super(props);
  }

  componentDidMount() {
    if(!this.props.maintenance)
      this.checkState();
  }

  checkState() {
    if(Server.initialized)
      this.props.setInitialized();
    else {
      setTimeout(() => {
        this.checkState();
      }, 250);
    }
  }

  render() {
    if(this.props.maintenance) {
      return (
        <div>
          <img className="loading-page-maintenance" src="/maintenance.png"></img>      
        </div>
      )
    }

    return (
      <div className="loading-page">
        {/* <img src="/logo.png" style={{width: '280px', marginTop: '50px'}}></img> */}
        <img src="/loading.gif" style={{width: '50px', marginTop: '50px'}}></img>
        <div className='loading-page-content'>
          Don't worry about a thing<br/>
          'Cause every little thing <br/>gonna be alright<br/><br/>
          Singin', don't worry about a thing<br/>
          'Cause every little thing <br/>gonna be alright
        </div>
      </div>
    )
  }
}

export default LoadingPage;