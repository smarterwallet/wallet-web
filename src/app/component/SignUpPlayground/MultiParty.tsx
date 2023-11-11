import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import CountDownButton from '../CountDownButton';
import './style.scss'; 

interface MultiSignupPayload {

}

const MultiPartyAccount = () => {
  const navigate = useNavigate();

  return (
    <div className='multi-party-account'>
      <p>At least 2 of 3 keys will be required to login successfully</p>
      <div className='multi-party-content'>
        <div>
          <h3>Wallet server</h3>
          <img className='checkIcon' src="/icon/success.png" />        
        </div>
        <div>
          <h3>Decentralized storage</h3>          
          <img className='checkIcon' src="/icon/success.png" />
        </div>
        
      </div>
      <Button
        onClick={() => navigate('/signup/multiSignup')}
        style={{ width: '100%' }}
      >
        Register
      </Button>
    </div>
  )
}

export default MultiPartyAccount;