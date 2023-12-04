import { Form,Input,Picker,Button } from "antd-mobile";
import { useState } from "react";



const AddressForm = () => {
    const [address, setAddres] = useState();

    const [visible, setVisible] = useState(false);
    const [blockchain, setBlockChain] = useState<(string | null)[]>(['']); // 會被props傳進來 這裏做交互測試
    const blockchainColumns = [[{label: 'ETH', value: 'eth'}],[{ label: 'ETH', value: 'eth'}]];

    return (
        <div>
            <Form>
                <Form.Header>
                    Address:
                    </Form.Header>
                <Form.Item>
                    <Input/>
                </Form.Item>
                
                <Form.Header>
                    Blockchain:
                </Form.Header>
                    <Form.Item>
                        <Button className="w-full border-none" onClick={() => setVisible(true)}>选择网络</Button>
                        <Picker columns={blockchainColumns} 
                        value={blockchain}
                        visible={visible}
                        onClose={() => { setVisible(false)}}
                        onConfirm={v => {
                            //@ts-ignore
                            setBlockChain(v)
                        }}/>
                    </Form.Item>
                
            </Form>
        </div>
    )
}



export default AddressForm;