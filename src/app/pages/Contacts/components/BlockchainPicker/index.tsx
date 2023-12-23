import { Picker } from 'antd-mobile';
import { blockchainColumns } from '../../utils/blockchainConfig';
import { PickerValue } from 'antd-mobile/es/components/picker-view';
import { TransactionDetail } from '../..';
import './styles.scss';

type Pickerparameter = {
    visible: boolean,
    setVisible : (value: boolean) => void,
    onChange: (key:keyof TransactionDetail, value:PickerValue )=> void,
    blockchain: (string | null)[]
  }
  
export  const BlockchainPicker = ({ visible, setVisible, onChange, blockchain} :Pickerparameter) => {
    return (<Picker
              columns={blockchainColumns}
              visible={visible}
              value={blockchain}
              onClose={() => {
                setVisible(false);
              }}
              onConfirm={(v) => {
                onChange('target', v[0]);
              }}
            ></Picker>)
  }