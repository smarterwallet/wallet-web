import React, { useEffect, useState } from 'react';
import { Result as Res, DotLoading, Toast } from 'antd-mobile';
import { truncateString } from '../../../util/util';
import { transferIcon, chainlinkIcon, downArrow } from '../../../../assets';
import { CheckCircleFilled } from '@ant-design/icons';
import BackBtn from '../../../component/BackBtn';
import { useCrossChain } from '../../../../hooks/useCrossChain';
import { TransactionDetail } from '../../../types';
import { useNavigate } from 'react-router-dom';
import { Global } from '../../../../server/Global';
// import { handleCrossChain } from '../../../util/handleCrossChain';

type Props = {
  needFooter?: boolean;
  title: string;
  transactionDetail: TransactionDetail;
  extra?: React.ReactNode;
};

const ConfirmModal: React.FC<Props> = ({ title, transactionDetail, extra, needFooter = false }) => {
  const navigate = useNavigate();
  const {
    token = 'USDC',
    amount = 1,
    receiver = '0xF42f4b5cb102b3f5A180E08E6BA726c0179D172E',
    source = 'mumbai',
    target = 'fuji',
    fees = '$1.64 (Gasfee:0.002+CrosschainFee:1.638)',
  } = transactionDetail;

  const [isProcessing, setIsProcessing] = useState(false);

  const { loadingState, handleTx } = useCrossChain({
    receiver,
    target,
    amount,
    source,
  });

  const handleConfirm = async () => {
    setIsProcessing(true);
    const crossHash = await handleTx(); // 代币授权
    // 打印交易 hash
    console.log('crossHash', crossHash);
  };

  useEffect(() => {
    if (loadingState.message === 'Error') {
      Toast.show({
        icon: 'fail',
        content: loadingState.error,
      });
    }
  }, [loadingState.error, loadingState.message]);

  const renderInstruction = () => {
    return (
      <>
        <div className="flex justify-between items-center text-3xl">
          <div className="w-[32rem]">
            1. <span className="font-semibold">Transfer</span> {amount} {token} in {source} to {amount} {token} in{' '}
            {target}
          </div>
          <div className="w-48 text-center">
            <div>
              <img src={chainlinkIcon} alt="chainklink" className="h-24 w-24 my-0 mx-auto mb-2" />
            </div>
            <div>CCIP</div>
          </div>
        </div>
        <img src={downArrow} alt="down arrow" className="h-[4.5rem] my-4 mx-auto" />
        <div className="flex justify-between items-center text-3xl">
          <div className="w-[32rem]">
            2. <span className="font-semibold">Send</span> {amount} {token} and {truncateString(receiver)} will get{' '}
            {amount} {token} in {target}
          </div>
          <div className="w-48 text-center">
            <div>
              <img src={transferIcon} alt="transfer" className="h-24 w-24 my-0 mx-auto mb-2" />
            </div>
            <div>Transfer</div>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <BackBtn />
      {!isProcessing && (
        <>
          <p className=" mx-auto mb-12 mt-8 w-11/12 text-4xl font-semibold ">
            Send ${token} to {truncateString(receiver || '0x00')}
          </p>
          <div
            style={{
              boxShadow: '9.057971000671387px 9.057971000671387px 36.23188400268555px 0px rgba(0, 0, 0, 0.25)',
            }}
            className=" mx-auto w-11/12 rounded-lg"
          >
            <div className="rounded-t-lg p-8 h-[56rem]" style={{ backgroundColor: '#e7ece6' }}>
              {extra}
              <div className="text-5xl font-medium  pl-4 mb-4">{title}</div>
              <div>{renderInstruction()}</div>
              <div className="text-5xl font-medium  pl-4 mb-4 mt-4">Estimated results:</div>
              <div className="flex py-2 text-2xl">
                <div className="flex flex-1 items-center justify-center ">
                  <p>You</p>
                </div>
                <div className="flex flex-1 items-center justify-center text-3xl font-medium text-redhot-500">
                  <p className="text-5xl font-semibold" style={{ color: 'rgba(157, 29, 29, 1)' }}>
                    - {amount}
                  </p>
                </div>
                <div className="flex flex-1 items-center justify-center ">
                  <p>${token}</p>
                </div>
              </div>
              <div className="flex py-2  text-2xl">
                <div className="flex flex-1 items-center justify-center ">
                  <p>Receipt</p>
                </div>
                <div className="flex flex-1 items-center justify-center text-3xl font-medium text-apple-400">
                  <p className="text-5xl font-semibold" style={{ color: 'rgba(93, 157, 29, 1)' }}>
                    + {amount}
                  </p>
                </div>
                <div className="flex flex-1 items-center justify-center ">
                  <p>${token}</p>
                </div>
              </div>
              <div className="text-2xl mt-8 mb-2">
                <span className="font-medium ">Receipt</span>
                <span className=" ml-6 ">{truncateString(receiver)}</span>
              </div>
              <div className="text-2xl  mb-2">
                <span className="font-medium ">Address</span>
                <span className=" ml-6 ">{truncateString(Global?.account?.contractWalletAddress || 'unknown')}</span>
              </div>
              <div className="flex justify-between text-2xl">
                <div>
                  <div>
                    <span className="font-medium ">Transaction fees</span>
                    <span className=" ml-6 ">{`$: ${parseFloat(fees.toString()).toFixed(2)}`}</span>
                  </div>
                </div>
                <div className="text-2xl  mb-2">
                  <span className="font-semibold text-red-700 text-redhot-frosting-primary">No.1</span>
                </div>
              </div>
              <div className="mb-2 flex justify-between text-2xl">
                <div>
                  <div>
                    <span className="font-medium ">Processing time</span>
                    <span className=" ml-6 ">
                      {/* {processingTime} */}
                      2~5s
                    </span>
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-red-700 text-redhot-frosting-primary">No.1</span>
                </div>
              </div>
            </div>
            {needFooter && (
              <div
                style={{
                  backgroundColor: '#fafbfa',
                }}
                className="flex h-24  w-full items-center rounded-b-lg text-center text-3xl font-semibold "
              >
                <div
                  style={{ borderRight: '1px solid rgba(168, 165, 169, 0.5)' }}
                  className="flex-1 py-2"
                  onClick={() => {
                    window.history.back();
                  }}
                >
                  Change
                </div>
                <div
                  className="flex-1"
                  onClick={() => {
                    handleConfirm();
                  }}
                >
                  Confirm
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {isProcessing && (
        <>
          <Res
            style={{
              backgroundColor: 'transparent',
            }}
            icon={<></>}
            title={
              <>
                {loadingState.message !== 'Success' && (
                  <div className="mb-12" style={{ color: '#51b27d' }}>
                    <span className="text-4xl font-semibold">{loadingState?.message || 'Waiting'}</span>
                    <span className="text-3xl">
                      <DotLoading style={{ color: '#51b27d' }} />
                    </span>
                    <span className="text-4xl">
                      <DotLoading style={{ color: '#51b27d' }} />
                    </span>
                    <span className="text-5xl">
                      <DotLoading style={{ color: '#51b27d' }} />
                    </span>
                  </div>
                )}
                {loadingState.message === 'Success' && (
                  <>
                    <CheckCircleFilled rev={undefined} className="text-9xl" style={{ color: '#739f4d' }} />
                    <div className="text-5xl font-semibold mb-12 mt-4" style={{ color: 'rgba(10, 61, 83, 1)' }}>
                      Send successfully!
                    </div>
                  </>
                )}
              </>
            }
            description={
              <div
                style={{
                  boxShadow: '9.057971000671387px 9.057971000671387px 36.23188400268555px 0px rgba(0, 0, 0, 0.25)',
                  color: 'rgba(10, 61, 83, 1)',
                }}
                className=" mx-auto w-11/12 rounded-lg p-8"
              >
                <div className="text-5xl font-medium pl-4 mb-4 mt-4">Transfer Results:</div>
                <div className="flex py-2 text-2xl">
                  <div className="flex flex-1 items-center justify-center ">
                    <p>You</p>
                  </div>
                  <div className="flex flex-1 items-center justify-center text-3xl font-medium text-redhot-500">
                    <p className="text-5xl font-semibold" style={{ color: 'rgba(157, 29, 29, 1)' }}>
                      - {amount}
                    </p>
                  </div>
                  <div className="flex flex-1 items-center justify-center ">
                    <p>${token}</p>
                  </div>
                </div>
                <div className="flex py-2  text-2xl">
                  <div className="flex flex-1 items-center justify-center ">
                    <p>Receipt</p>
                  </div>
                  <div className="flex flex-1 items-center justify-center text-3xl font-medium text-apple-400">
                    <p className="text-5xl font-semibold" style={{ color: 'rgba(93, 157, 29, 1)' }}>
                      + {amount}
                    </p>
                  </div>
                  <div className="flex flex-1 items-center justify-center ">
                    <p>${token}</p>
                  </div>
                </div>
                <div className="text-2xl mt-8 mb-2">
                  <span className="font-medium ">Receipt</span>
                  <span className=" ml-6 ">{truncateString(receiver)}</span>
                </div>
                <div className="text-2xl  mb-2">
                  <span className="font-medium ">Address</span>
                  <span className=" ml-6 ">{truncateString(Global?.account?.contractWalletAddress || 'unknown')}</span>
                </div>
                <div className="flex justify-between text-2xl">
                  <div>
                    <div>
                      <span className="font-medium ">Transaction fees</span>
                      <span className=" ml-6 ">{`$: ${parseFloat(fees.toString()).toFixed(2)}`}</span>
                    </div>
                  </div>
                  <div className="text-2xl  mb-2">
                    <span className="font-semibold text-red-700 text-redhot-frosting-primary">No.1</span>
                  </div>
                </div>
                <div className="mb-2 flex justify-between text-2xl">
                  <div>
                    <div>
                      <span className="font-medium ">Processing time</span>
                      <span className=" ml-6 ">
                        {/* {processingTime} */}
                        2~5s
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-red-700 text-redhot-frosting-primary">No.1</span>
                  </div>
                </div>
              </div>
            }
          />
          {loadingState.message === 'Success' && (
            <div
              className="mx-auto my-0 h-[5rem] w-[42rem] rounded-lg text-center text-4xl items-center flex justify-center font-semibold"
              style={{ backgroundColor: 'rgba(255, 253, 253, 1)', color: 'rgba(10, 61, 83, 1)' }}
              onClick={() => navigate('/')}
            >
              Done
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ConfirmModal;
