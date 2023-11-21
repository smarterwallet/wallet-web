import React, { useEffect, useState } from 'react'
import HeaderBar from '../../elements/HeaderBar'
import { Collapse } from 'antd'
import { Config } from '../../../server/config/Config';
import { Global } from '../../../server/Global';
import { Navigate } from 'react-router-dom';

interface CryptoMap {
  [Add: string]: string
}

interface Strategy {
  TokenFrom: String;
  TokenTo: String
}

interface Strategys {
  RunningStrategy: Strategy[];
  HistoryStrategy: Strategy[]
}

class MyStrategys extends React.Component<{}, Strategys> {
  constructor(props: any) {
    super(props)

    this.state = {
      RunningStrategy: [],
      HistoryStrategy: []
    }
  }

  //用于将币种地址转换为币种名称
  Crypto: CryptoMap = {
    '0xF981Ac497A0fe7ad2Dd670185c6e7D511Bf36d6d': 'USWT',
    '0x4B63443E5eeecE233AADEC1359254c5C601fB7f4': 'SWT'
  }

  //获取当前地址已有策略
  async getStrategy() {
    const address = Global.account.contractWalletAddress
    await fetch(Config.AUTO_TRADING_API + `/api/v1/strategy/simple?address=${address}`).then(
      response => response.json()
    ).then(
      data => {
        //如果执行结果为空，则当成正在执行的策略。如果执行结果不为空，则当成执行完的策略
        data.result.map((item: any) => {
          if (item.execute_result === null) {
            const FromAdd = item.token_from as string
            const From = this.Crypto[FromAdd]
            const ToAdd = item.token_to as string
            const To = this.Crypto[ToAdd]
            this.setState({
              RunningStrategy: [
                {
                  TokenFrom: From,
                  TokenTo: To
                }
              ]
            })
          }
          else {
            const FromAdd = item.token_from as string
            const From = this.Crypto[FromAdd]
            const ToAdd = item.token_to as string
            const To = this.Crypto[ToAdd]
            this.setState({
              HistoryStrategy: [
                {
                  TokenFrom: From,
                  TokenTo: To
                }
              ]
            })
          }
        })
      }
    )
  }

  componentDidMount() {
    this.getStrategy()
  }

  render() {
    const create=()=>{
      return (<Navigate to='/home' />)
    }
    return (
      <div className='ww-page-container my-strategys-page'>
        <div className='header'>
          <HeaderBar text='My Trading Bots' />
          
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2335" width="65" height="65" style={{ marginLeft: '45px' }} onClick={create}><path d="M514.048 62.464q93.184 0 175.616 35.328t143.872 96.768 96.768 143.872 35.328 175.616q0 94.208-35.328 176.128t-96.768 143.36-143.872 96.768-175.616 35.328q-94.208 0-176.64-35.328t-143.872-96.768-96.768-143.36-35.328-176.128q0-93.184 35.328-175.616t96.768-143.872 143.872-96.768 176.64-35.328zM772.096 576.512q26.624 0 45.056-18.944t18.432-45.568-18.432-45.056-45.056-18.432l-192.512 0 0-192.512q0-26.624-18.944-45.568t-45.568-18.944-45.056 18.944-18.432 45.568l0 192.512-192.512 0q-26.624 0-45.056 18.432t-18.432 45.056 18.432 45.568 45.056 18.944l192.512 0 0 191.488q0 26.624 18.432 45.568t45.056 18.944 45.568-18.944 18.944-45.568l0-191.488 192.512 0z" p-id="2336" fill="#465f6d"></path></svg>

        </div>
        <Collapse
          defaultActiveKey="1"
          items={
            this.state.RunningStrategy.map((item) => ({
              label: 'Running Strategy',
              children: (
                <Collapse
                  defaultActiveKey="1"
                  items={[
                    {
                      label: 'Simple spot grid strategy',
                      children: (
                        <div className='list'>
                          <div className='onGoing'>
                            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2307" width="40" height="40" style={{ width: '80px', height: '80px' }}><path d="M870.2 466.333333l-618.666667-373.28a53.333333 53.333333 0 0 0-80.866666 45.666667v746.56a53.206667 53.206667 0 0 0 80.886666 45.666667l618.666667-373.28a53.333333 53.333333 0 0 0 0-91.333334z" fill="#68a933" p-id="2308"></path></svg>
                            <p className='onGoingText'>Ongoing</p>
                          </div>
                          <p className='p'>Swap {item.TokenFrom} for {item.TokenTo} </p>
                        </div>
                      )
                    }
                  ]}
                />
              )
            }))
          } />
      </div>
    )
  }
}

export default MyStrategys