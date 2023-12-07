import { Card, Button } from 'antd-mobile';
import './styles.scss';

type Props = { handleTransfer : () => void}

const SendBtn:React.FC<Props> = ({handleTransfer }) => {
  

  return (
    <Card className="bg-transparent px-5">
      <Button block size="large" className="rounded-2xl h-24 font-bold shadow-2xl" onClick={() => handleTransfer()}>
        {' '}
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
        </div>
      </Button>
    </Card>
  );
};

export default SendBtn;
