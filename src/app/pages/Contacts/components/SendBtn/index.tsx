import { Button } from 'antd';
import './styles.scss';

type Props = { handleTransfer : () => void , isTrading: boolean}

const SendBtn:React.FC<Props> = ({handleTransfer, isTrading }) => {
  
  return (
      <Button block size="large" loading={isTrading} disabled={isTrading} className="bg-white rounded-2xl h-24 font-bold shadow-2xl flex items-center justify-center" onClick={() => handleTransfer()}>
        { isTrading ?  
        <div className="flex items-center justify-center ">
          <div>Trading...</div>
        </div> : 
        <div className="flex items-center justify-center">
          <div>Send</div> 
          <div
            style={{
              color: '#0ea5e9',
              fontWeight: 'normal',
              width: '50px',
              height: '50px',
              lineHeight: 1.25,
              display: 'block',
            }}
          >
            &gt;
          </div>{' '}
        </div>  }
      </Button>
    
  );
};

export default SendBtn;
