import { Button, Card, Form, Input, Picker } from 'antd-mobile';
import { useState } from 'react';
import { TransactionDetail } from '../..';
import './styles.scss';

type Props = TransactionDetail & {
  onChange: (key: keyof TransactionDetail, value: any) => void;
} & { setTradingMode: (result: boolean) => void };

type contactType = {
  name: string;
  receiver: string;
  target: string;
};

type TargetTypes = contactType['target'];

const ReceiptForm: React.FC<Props> = ({
  source,
  target,
  address,
  receiver,
  amount,
  token,
  onChange,
  setTradingMode,
}) => {
  const [newContact, setNewContant] = useState(false);
  // 用於添加聯繫人 與父頁面隔離
  const [name, setName] = useState('');
  const [newReciver, setNewReciver] = useState('');
  const [BlockChainValue, setBlockChainValue] = useState('');
  // 添加信息框显示
  const [visible, setVisible] = useState(false);
  const [blockchain, setBlockChain] = useState<(string | null)[]>(['']); // 目前被写死

  const blockchainColumns = [
    [
      { label: 'Mumbai', value: 'mumbai' },
      { label: 'Fuji', value: 'fuji' },
    ],
  ];

  const hanldCancelClick = () => {
    try {
      // setNewContant => false
      setNewContant(false);
      setTradingMode(true);
      // clear input info
      setName('');
      setBlockChainValue('');
      setNewReciver('');
    } catch (e) {
      console.log(e);
      setNewContant(false);
    }
  };

  const hanldAddClick = () => {
    try {
      // error check
      if (name === '' || name === null || name === undefined) {
        throw new Error("name can't not be empty");
      }
      if (newReciver === '' || newReciver === null || newReciver === undefined) {
        throw new Error("newReciver can't not be empty");
      }
      if (newReciver.lastIndexOf('0x') != 0) {
        throw new Error('This is no a ETH WALLET address syntax');
      }
      if (newReciver.length < 42) {
        throw new Error('The length of address is not a ETH WALLET address');
      }
      if (BlockChainValue !== 'Fuji'.toLowerCase() && BlockChainValue !== 'Mumbai'.toLowerCase()) {
        console.log(BlockChainValue);
        throw new Error('only support Fuji and Mumbai blockchain');
      }
      // save new contact in localStorage
      const newContact: contactType = { name: name, receiver: newReciver, target: BlockChainValue };
      const storedContacts: string | null = localStorage.getItem('contacts');
      const oldContacts: contactType[] = storedContacts ? JSON.parse(storedContacts) : [];
      localStorage.setItem('contacts', JSON.stringify([...oldContacts, newContact]));
      // reset state
      setNewContant(false);
      setName('');
      setBlockChainValue('');
      setNewReciver('');
      setTradingMode(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="bg-transparent h-[30rem] flex flex-col">
      {/* address */}
      <div className="grow flex flex-col px-16 justify-center">
        <div className="mb-2">
          <h1 className="font-bold text-4xl" style={{ color: '#0A3D53' }}>
            Name:
          </h1>
        </div>
        <div className="bg-white rounded-3xl px-5 shadow-xl">
          <Input
            className="text-4xl"
            style={{ '--font-size': '2rem' }}
            value={name}
            onChange={(v) => setName(v)}
          ></Input>
        </div>
      </div>
      {!newContact ? (
        <div className=" grow flex flex-col px-16 justify-center">
          <div className="mb-2">
            <h1 className="font-bold text-4xl opacity-0" style={{ color: '#0A3D53' }}>
              ----opacity----
            </h1>
          </div>
          <div className="bg-white rounded-3xl px-5 shadow-xl">
            <Input
              onClick={() => {
                setNewContant(true);
                setTradingMode(false);
              }}
              placeholder="Add Contact +"
              style={{
                '--text-align': 'center',
                caretColor: 'transparent',
                fontSize: '1.5rem',
                lineHeight: '2rem',
                '--font-size': '2rem',
                fontWeight: 'bold',
              }}
            />
          </div>
        </div>
      ) : (
        <div className="grow flex flex-col px-16 justify-center">
          {/* address */}
          <div className="grow flex flex-col  justify-center">
            <div className="mb-2">
              <h1 className="font-bold text-4xl" style={{ color: '#053346' }}>
                Address:
              </h1>
            </div>
            <div className="bg-white rounded-3xl px-5 shadow-xl">
              <Input className="text-4xl" value={newReciver} onChange={(v) => setNewReciver(v)}></Input>
            </div>
          </div>
          <div className=" grow flex flex-col  justify-center">
            <div className="mb-2">
              <h1 className="font-bold text-4xl" style={{ color: '#053346' }}>
                Blockchain:
              </h1>
            </div>
            <div className="bg-white rounded-3xl px-5 shadow-xl">
              <Input
                onClick={() => {
                  setVisible(true);
                }}
                value={BlockChainValue ? BlockChainValue.toUpperCase() : BlockChainValue}
                style={{ '--text-align': 'center', caretColor: 'transparent' }}
              />
              <Picker
                columns={blockchainColumns}
                visible={visible}
                value={blockchain}
                onClose={() => {
                  setVisible(false);
                }}
                onConfirm={(v) => {
                  //@ts-ignore
                  setBlockChain(v[0]);
                  //@ts-ignore
                  setBlockChainValue(v[0]);
                }}
              ></Picker>
            </div>
            <div className="flex flex-row mt-5 space-x-20">
              <Button
                className="grow rounded-2xl h-20 font-bold text-4xl "
                style={{ color: '#053346' }}
                onClick={() => {
                  hanldCancelClick();
                }}
              >
                Cancel
              </Button>
              <Button
                className="grow rounded-2xl h-20 font-bold text-4xl"
                onClick={() => {
                  hanldAddClick();
                }}
                style={{ color: '#053346' }}
              >
                Add +
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptForm;
