import React from 'react';
import { Global } from '../../server/Global';
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
    if(Global.initialized)
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
        <img src="/loading.gif" style={{width: '50px', marginTop: '50px'}}></img>
      </div>
    )
  }
}

export default LoadingPage;