import { Button, Input, Picker } from 'antd-mobile';
import { useState, useEffect } from 'react';
import { TransactionDetail } from '../..';
import './styles.scss';
import { message } from 'antd';
import { ErrorCheck } from '../../utils/RErrorCheck';

type Props = TransactionDetail & {
  onChange: (key: keyof TransactionDetail, value: any) => void;
} & { setTradingMode: (result: boolean) => void };

export type contactType = {
  name: string;
  receiver: string;
  target: string;
};

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
  const [isAddingNewContact, setAddNewContact] = useState(false);
  // 用於添加聯繫人 與父頁面隔離
  const [name, setName] = useState('');
  const [newReciver, setNewReciver] = useState('');
  const [BlockChainValue, setBlockChainValue] = useState('');
  // 添加信息框显示
  const [visible, setVisible] = useState(false);
  const [blockchain, setBlockChain] = useState<(string | null)[]>(['']); // 目前被写死
  // 存储loaclstorage数据
  const [storedContacts, setStoredContacts] = useState<contactType[] | null>([]);
  // 存储对应联系人的信息
  const [contact, setContact] = useState<contactType>();
  // 消息框
  const [messageApi, contextHolder] = message.useMessage();

  const blockchainColumns = [
    [
      { label: 'Mumbai', value: 'mumbai' },
      { label: 'Fuji', value: 'fuji' },
    ],
  ];

  

  useEffect(() => {
    try {
      const storedCon: contactType[] | null = JSON.parse(localStorage.getItem('contacts')) ?? [];
      setStoredContacts(storedCon);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    try {
      if (!isAddingNewContact) {
        const matchingContact = storedContacts.filter((contact) => {
          return contact.name.toLowerCase() == name.toLowerCase();
        });
        // 资料输入
        if (matchingContact != null && matchingContact.length) {
          const mcontact = matchingContact[0];
          if (mcontact !== undefined) {
            onChange('receiver', mcontact.receiver);
            onChange('target', mcontact.target);
          }
        } else {
          // 抹掉
          onChange('receiver', '');
          onChange('target', '');
        }
      } else {
        // 在新增联系人模式下抹掉所有显示数据
        if (receiver != '') {
          onChange('receiver', '');
          onChange('target', '');
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, [name, isAddingNewContact]);

  const errorMessageBox = (errorMessage: string) => {
    message.open({
      type:'error',
      content:errorMessage
    })
  }

  const successMessageBox = (successMessage: string) => {
    message.open({
      type:'success',
      content:successMessage
    })
  }

  const hanldCancelClick = () => {
    try {
      // setNewContant => false
      setAddNewContact(false);
      setTradingMode(true);
      // clear input info
      setName('');
      setBlockChainValue('');
      setNewReciver('');
    } catch (e) {
      console.log(e);
      setAddNewContact(false);
    }
  };

  const hanldAddClick = () => {
    try {
      const newContact: contactType = { name: name, receiver: newReciver, target: BlockChainValue };
      // error check
      const result = ErrorCheck(newContact);
      if(result != null){
        errorMessageBox(result);
        throw new Error(result);
      }
      // save new contact in localStorage
      const storedContacts: string | null = localStorage.getItem('contacts');
      const oldContacts: contactType[] = storedContacts ? JSON.parse(storedContacts) : [];
      localStorage.setItem('contacts', JSON.stringify([...oldContacts, newContact]));
      successMessageBox("The new Contact is saved.")
      // reload
      const storedCon: contactType[] | null = JSON.parse(localStorage.getItem('contacts')) ?? [];
      setStoredContacts(storedCon)
      // reset state
      setAddNewContact(false);
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
      {contextHolder}
      {/*  */}
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
            clearable
            onChange={(v) => {
              setName(v);
            }}
          ></Input>
        </div>
      </div>
      {!isAddingNewContact ? (
        <div className=" grow flex flex-col px-16 justify-center">
          <div className="mb-2">
            <h1 className="font-bold text-4xl opacity-0" style={{ color: '#0A3D53' }}>
              ----opacity---- just for the height
            </h1>
          </div>
          <div className="bg-white rounded-3xl px-5 shadow-xl">
            <Input
              onClick={() => {
                setAddNewContact(true);
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
              <Input className="text-4xl" clearable value={newReciver} onChange={(v) => setNewReciver(v)}></Input>
            </div>
          </div>
          <div className=" grow flex flex-col  justify-center">
            <div className="mb-2">
              <h1 className="font-bold text-4xl" style={{ color: '#053346' }}>
                Blockchain:
              </h1>
            </div>
            <div className="bg-white rounded-3xl px-5 shadow-xl">
              <Button
                onClick={() => {
                  setVisible(true);
                }}
                block
                size="large"
                className="text-4xl border-none"
                style={{ height: '80px' }}
              >
                {BlockChainValue ? BlockChainValue.toUpperCase() : BlockChainValue}
              </Button>
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
