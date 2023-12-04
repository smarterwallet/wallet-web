import React, { useState } from 'react';
import { Result as Res } from 'antd-mobile';
import { Link } from 'react-router-dom';
import { truncateString } from '../../../util/util';

type Props = {
  needFooter?: boolean;
  title: string;
  transactionDetail: {
    receiver?: string;
    amount?: number | string;
    source?: string;
    target?: string;
    token?: string;
    address?: string;
  };
  extra?: React.ReactNode;
};

const Result: React.FC<Props> = ({ title, transactionDetail, extra, needFooter = false }) => {
  const {
    token = 'USDC',
    amount = 100,
    receiver = '0xF42f4b5cb102b3f5A180E08E6BA726c0179D172E',
    source = 'mumbai',
    target = 'fuji',
    address = '0x00',
  } = transactionDetail;
  const [step, setStep] = useState(0);
  return (
    <>
      {step === 0 && (
        <p className=" mx-auto mb-4 mt-24 w-11/12 text-4xl font-semibold text-circle-green">
          Send ${token} to {truncateString(receiver || '0x00')}
        </p>
      )}
      {step === 0 && (
        <div
          style={{
            boxShadow: '9.057971000671387px 9.057971000671387px 36.23188400268555px 0px rgba(0, 0, 0, 0.25)',
          }}
          className=" mx-auto w-11/12 rounded-lg"
        >
          <div className="rounded-t-lg p-4 h-[48rem]" style={{ backgroundColor: '#e7ece6' }}>
            {extra}
            <div className="text-5xl font-medium text-circle-green pl-4 mb-4">{title}</div>
            <div className="flex py-2 text-2xl">
              <div className="flex flex-1 items-center justify-center text-circle-green">
                <p>You</p>
              </div>
              <div className="flex flex-1 items-center justify-center text-3xl font-medium text-redhot-500">
                <p>- {amount}</p>
              </div>
              <div className="flex flex-1 items-center justify-center text-circle-green">
                <p>${token}</p>
              </div>
            </div>
            <div className="flex py-2  text-2xl">
              <div className="flex flex-1 items-center justify-center text-circle-green">
                <p>Receipt</p>
              </div>
              <div className="flex flex-1 items-center justify-center text-3xl font-medium text-apple-400">
                <p>+ {amount}</p>
              </div>
              <div className="flex flex-1 items-center justify-center text-circle-green">
                <p>${token}</p>
              </div>
            </div>
            <div className="text-2xl mt-8 mb-2">
              <span className="font-medium text-circle-green">Receipt</span>
              <span className=" ml-6 text-circle-green">{truncateString(receiver)}</span>
            </div>
            <div className="text-2xl  mb-2">
              <span className="font-medium text-circle-green">Address</span>
              <span className=" ml-6 text-circle-green">{truncateString(address)}</span>
            </div>
            <div className="flex justify-between text-2xl">
              <div>
                <div>
                  <span className="font-medium text-circle-green">Transaction fees</span>
                  <span className=" ml-6 text-circle-green">{/* {transactionFees} */}0</span>
                </div>
              </div>
              <div className="text-2xl  mb-2">
                <span className="font-semibold text-circle-green text-redhot-frosting-primary">No.1</span>
              </div>
            </div>
            <div className="mb-2 flex justify-between text-2xl">
              <div>
                <div>
                  <span className="font-medium text-circle-green">Processing time</span>
                  <span className=" ml-6 text-circle-green">
                    {/* {processingTime} */}
                    2~5s
                  </span>
                </div>
              </div>
              <div>
                <span className="font-semibold text-circle-green text-redhot-frosting-primary">No.1</span>
              </div>
            </div>
          </div>
          {needFooter && (
            <div
              style={{
                backgroundColor: '#fafbfa',
              }}
              className="flex h-24  w-full items-center rounded-b-lg text-center text-3xl font-semibold text-circle-green"
            >
              <div
                style={{ borderRight: '1px solid rgba(168, 165, 169, 0.5)' }}
                className="flex-1 py-2"
                onClick={() => {}}
              >
                Change
              </div>
              <div className="flex-1" onClick={() => {}}>
                Confirm
              </div>
            </div>
          )}
        </div>
      )}
      {step === 1 && (
        <>
          <Res
            style={{
              backgroundColor: 'transparent',
            }}
            status="success"
            title={<div className="text-3xl text-circle-green">Send successfully!</div>}
            description={
              <>
                <div
                  style={{
                    boxShadow: '9.057971000671387px 9.057971000671387px 36.23188400268555px 0px rgba(0, 0, 0, 0.25)',
                  }}
                  className=" mx-auto w-11/12 rounded-lg"
                >
                  <div className="rounded-t-lg p-4" style={{ backgroundColor: '#e7ece6' }}>
                    <div className="text-3xl font-semibold text-circle-green">Transfer Results</div>
                    <div className="flex py-2">
                      <div className="flex flex-1 items-center justify-center text-circle-green">
                        <p>You</p>
                      </div>
                      <div className="flex flex-1 items-center justify-center text-3xl font-medium text-redhot-500">
                        <p>- {amount}</p>
                      </div>
                      <div className="flex flex-1 items-center justify-center text-circle-green">
                        <p>${token}</p>
                      </div>
                    </div>
                    <div className="flex py-2">
                      <div className="flex flex-1 items-center justify-center text-circle-green">
                        <p>Receipt</p>
                      </div>
                      <div className="flex flex-1 items-center justify-center text-3xl font-medium text-apple-400">
                        <p>+ {amount}</p>
                      </div>
                      <div className="flex flex-1 items-center justify-center text-circle-green">
                        <p>${token}</p>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-circle-green">Receipt</span>
                      <span className=" ml-6 text-circle-green">{truncateString(receiver)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-circle-green">Address</span>
                      <span className=" ml-6 text-circle-green">{truncateString(address)}</span>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <div>
                          <span className="font-medium text-circle-green">Transaction fees</span>
                          <span className=" ml-6 text-circle-green">{/* {transactionFees} */} unknown</span>
                        </div>
                      </div>
                      <div>
                        <span className="font-semibold text-circle-green text-redhot-frosting-primary">No.1</span>
                      </div>
                    </div>
                    <div className="mb-2 flex justify-between">
                      <div>
                        <div>
                          <span className="font-medium text-circle-green">Processing time</span>
                          <span className=" ml-6 text-circle-green">
                            {/* {processingTime} */}
                            2~5s
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="font-semibold text-circle-green text-redhot-frosting-primary">No.1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            }
          />
          <Link to="/">
            <div className=" mx-auto my-0 h-12 w-64 rounded-lg bg-gumdrop-50 pt-3 text-center text-3xl text-circle-green">
              Done
            </div>
          </Link>
        </>
      )}
    </>
  );
};

export default Result;
